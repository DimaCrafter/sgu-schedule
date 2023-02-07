import { writable } from 'svelte/store'

export function localRead (key, defaultValue) {
	if (typeof window == 'undefined') return null;

	const value = localStorage.getItem(key);
	return value ? JSON.parse(value) : defaultValue;
}

export function localWrite (key, value) {
	if (typeof window == 'undefined') return null;

	localStorage.setItem(key, JSON.stringify(value));
}

export function internal (initial, start = () => {}) {
	const store = writable(initial, start);
	store.public = { subscribe: store.subscribe };
	return store;
}
