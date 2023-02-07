import API from 'dc-api-client'
import { goto } from '$app/navigation'
import { writable } from 'svelte/store'
import { raw } from '.'
import { DAY, WEEK } from './date'
import { internal, localRead, localWrite } from './data'

const SYNC_PERIOD = DAY;
const MAX_SYNC_PERIOD = 3 * WEEK;


export const settings = writable(localRead('settings', {
	faculty: null,
	group: null,
	subgroups: []
}));
settings.subscribe(value => localWrite('settings', value));

const _schedule = internal(localRead('schedule', [[], [], [], [], [], [], []]));
export const schedule = _schedule.public;

const _syncState = internal({ status: 'ok' });
export const syncState = _syncState.public;

export function askSync () {
	const lastSync = +(localStorage.getItem('last-sync') || 0);
	if (Date.now() - lastSync > SYNC_PERIOD) {
		if (!navigator.onLine) {
			if (Date.now() - lastSync > MAX_SYNC_PERIOD) {
				_syncState.set({ status: 'offline' });
				window.addEventListener('online', handleOnline);
			}
			return;
		}

		sync();
	}
}

function handleOnline () {
	window.removeEventListener('online', handleOnline);
	sync();
}

export async function sync () {
	_syncState.set({ status: 'pending' });

	const settingsRaw = raw(settings);
	if (!settingsRaw.faculty || !settingsRaw.group) {
		_syncState.set({ status: 'no-data' });
		goto('/settings', { replaceState: true });
		return;
	}

	const res = await API.Info.schedule(null, {
		faculty: settingsRaw.faculty.code,
		group: settingsRaw.group.code
	});

	if (res.success) {
		localStorage.setItem('schedule', JSON.stringify(res.msg));
		_schedule.set(res.msg);
	} else {
		_syncState.set({ status: 'error', detail: res.msg });
	}
}
