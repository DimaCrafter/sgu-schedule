<slot></slot>
<IconSprite />

<Modal name="install-app" title="Установить как приложение?">
	<p>Полный функционал сервиса доступен и на сайте, но кому хочется каждый раз ждать загрузки и тратить трафик?</p>
	<p>Сервис можно установить как приложение, которое весит всего ~344 Кб и пользоваться им с выключенным интернетом.</p>
	<footer>
		<button on:click={skipInstall} class="action muted">Напомнить позже</button>
		<button on:click={promptInstall} class="action primary">Установить</button>
	</footer>
</Modal>

<Modal name="sync-failed" title="Ошибка синхронизации">
	<p>{$syncState.detail}</p>
	<footer>
		<button on:click={hideModal} class="action muted">Закрыть</button>
		<button on:click={() => { sync(); hideModal(); }} class="action primary">Повторить попытку</button>
	</footer>
</Modal>

<script>
import { onMount } from 'svelte'
import API from 'dc-api-client'

import IconSprite from '../components/IconSprite.svelte'
import Modal, { showModal, hideModal } from '../components/Modal.svelte'
import { askSync, sync, syncState } from '../utils/storage'

/** @type {() => void} */
let promptInstall;
onMount(async () => {
	API.settings.useKebab = true;
	API.settings.secure = !API.settings.dev();
	if (API.settings.dev()) {
		API.settings.base = location.hostname + ':8081';
	} else {
		API.settings.base = location.hostname + '/api';
	}

	window.addEventListener('beforeinstallprompt', e => {
		e.preventDefault();
		const lastInstallationSkip = localStorage.getItem('last-installation-skip') || '0';
		if (lastInstallationSkip != '-1' && +lastInstallationSkip < Date.now() - 3 * 24 * 60 * 60 * 1000) {
			promptInstall = () => e.prompt();
			showModal('install-app');
		}
	});

	askSync();
});

function skipInstall () {
	localStorage.setItem('last-installation-skip', Date.now().toString());
	hideModal();
}
</script>