<header>
	<div class="title">Настройки</div>
	{#if $syncState.status != 'no-data'}
		<!-- svelte-ignore a11y-missing-attribute -->
		<a on:click={() => history.back()} class="action" title="Перейти назад"><Icon name="x" /></a>
	{/if}
</header>
<main id="settings">
	<div id="about-app">
		<img src="/app-icon.svg" alt="Иконка приложения" />
		<div>
			<div class="name">Schedule</div>
			<div class="muted">Версия 1.2 (29 сент. 2022)</div>
		</div>
	</div>

	{#if $settings}
		<div class="item">
			<Icon name="faculty" />
			{$settings.faculty ? $settings.faculty.name : 'Факультет не выбран'}
		</div>
		<div class="item">
			<Icon name="users" />
			Группа {$settings.group ? $settings.group.name : 'не выбрана'}
		</div>
		<div class="item">
			<Icon name="direction" />
			Подгруппы: {$settings.subgroups.length ? $settings.subgroups.join(', ') : 'нет'}
		</div>
		<button on:click={editSettings} class="btn primary">
			<Icon name="edit" />
			Изменить
		</button>
	{/if}

	<br />
	<a href="https://vk.com/dima10z" target="_blank" class="item">
		<Icon name="vk" />
		Страница разработчика
	</a>
	{#if canDisableInstallPopup}
		<div on:click={disableInstallPopup} class="item checkbox">
			<span></span>
			Отключить напоминание об установке
		</div>
	{/if}
</main>

<a href="https://rifty.ru" target="_blank" id="supported">
	<Icon name="link" />
	Сервис работает при поддержке
	<img src="/img/rifty-white.svg" alt="Логотип Rifty" />
	Виртуальные серверы и хостинг сайтов
	<b>от 49 рублей</b>
</a>
<div id="copy">
	DePowered 2013-2022 &copy; Все права защищены.
</div>

<Modal name="select-faculty" title="Выберите факультет">
	{#if !faculties}
		<Loader />
	{:else if faculties.error}
		<p>Ошибка загрузки: {faculties.error}</p>
		<footer>
			<button on:click={hideModal} class="action muted">Закрыть</button>
		</footer>
	{:else}
		<div class="select-list">
			{#each faculties as faculty}
				<div on:click={() => applyFaculty(faculty)} class="item">{faculty.name}</div>
			{/each}
		</div>
		<footer>
			<button on:click={hideModal} class="action muted">Отмена</button>
			{#if $settings.faculty}
				<button on:click={() => applyFaculty($settings.faculty)} class="action muted">Пропустить</button>
			{/if}
		</footer>
	{/if}
</Modal>
<Modal name="select-group" title="Выберите группу">
	{#if !groups}
		<Loader />
	{:else if groups.error}
		<p>Ошибка загрузки: {groups.error}</p>
		<footer>
			<button on:click={hideModal} class="action muted">Закрыть</button>
		</footer>
	{:else}
		<div class="btn-list">
			{#each groups as group}
				<div on:click={() => applyGroup(group)} class="btn secondary">{group.name}</div>
			{/each}
		</div>
		<footer>
			<button on:click={hideModal} class="action muted">Отмена</button>
			{#if $settings.group}
				<button on:click={() => applyGroup($settings.group)} class="action muted">Пропустить</button>
			{/if}
		</footer>
	{/if}
</Modal>
<Modal name="select-subgroups" title="Выберите подгруппы">
	{#if !subgroups}
		<Loader />
	{:else if subgroups.error}
		<p>Ошибка загрузки: {subgroups.error}</p>
		<footer>
			<button on:click={hideModal} class="action muted">Закрыть</button>
		</footer>
	{:else}
		<div class="select-list">
			{#each subgroups as subgroup}
				<Checkbox bind:target={$settings.subgroups} value={subgroup} class="item">{subgroup}</Checkbox>
			{/each}
		</div>
		<footer>
			<span></span>
			<button on:click={() => { sync(); hideModal(); }} class="action primary">Готово</button>
		</footer>
	{/if}
</Modal>

<script>
import API from 'dc-api-client'
import { onMount } from 'svelte'
import { settings, sync, syncState } from '../../utils/storage'

import Icon from '../../components/Icon.svelte'
import Modal, { hideModal, showModal } from '../../components/Modal.svelte'
import Loader from '../../components/Loader.svelte'
import Checkbox from '../../components/Checkbox.svelte'

let canDisableInstallPopup = false;
onMount(() => {
	canDisableInstallPopup = localStorage.getItem('last-installation-skip') != '-1';
});

function disableInstallPopup () {
	localStorage.setItem('last-installation-skip', '-1');
	canDisableInstallPopup = false;
}

/** @type {any} */
let faculties;
async function editSettings () {
	faculties = null;
	showModal('select-faculty');

	const res = await API.Info.faculties();
	if (res.success) faculties = res.msg;
	else faculties = { error: res.msg };
}

/** @type {any} */
let groups;
async function applyFaculty (faculty) {
	groups = null;
	settings.update(value => { value.faculty = faculty; return value; });
	showModal('select-group');

	const res = await API.Info.groups(null, { faculty: faculty.code });
	if (res.success) groups = res.msg;
	else groups = { error: res.msg };
}

/** @type {any} */
let subgroups;
async function applyGroup (group) {
	subgroups = null;
	settings.update(value => { value.group = group; return value; });
	showModal('select-subgroups');

	const res = await API.Info.subgroups(null, { faculty: $settings.faculty.code, group: group.code });
	if (res.success) subgroups = res.msg;
	else subgroups = { error: res.msg };
}
</script>

<style>
#settings {
	padding: 24px;
}

#settings > .item {
    display: flex;
    align-items: flex-start;
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 12px;
    text-decoration: none;
    color: inherit;
}

#settings > .item > :global(.icon) {
    font-size: 22px;
    margin-right: 12px;
}

#settings > .btn {
    display: block;
    margin-left: auto;
}

#about-app {
	display: flex;
	align-items: center;
	margin-bottom: 24px;
}

#about-app > img {
	width: 64px;
	margin-right: 24px;
	filter: drop-shadow(0px 3px 15px rgba(0, 0, 0, 0.15));
}

#about-app .name {
	font-weight: 600;
	font-size: 22px;
}

#about-app .muted {
	margin-top: 6px;
	font-weight: 600;
	font-size: 14px;
	color: #B2B2B2;
}

#supported {
	position: relative;
	margin: 0 24px;
	margin-top: auto;
	padding: 12px;
	font-size: 14px;
	font-weight: 600;
	line-height: 1.25;
	color: #fafafa;
	text-decoration: none;
	background-color: #3A7CFF;
	border-radius: 8px;
}

#supported > :global(.icon) {
	position: absolute;
	top: 16px;
	right: 16px;
	font-size: 18px;
	color: #cedeff;
}

#supported > img {
	display: block;
	margin: 8px 0;
}

#supported > b {
	display: block;
	font-size: 17px;
}

#copy {
	margin: 12px 0;
	font-size: 13px;
	font-weight: 600;
	color: #B2B2B2;
	text-align: center;
}
</style>