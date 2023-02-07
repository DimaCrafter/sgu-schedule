{#if $current == name}
<div class="overlay">
	<div class="modal">
		<div class="title">{title}</div>
		<slot />
	</div>
</div>
{/if}

<script context="module">
import { readable } from 'svelte/store'

let setCurrent;
const current = readable(null, set => { setCurrent = set; });

export function showModal (name) { setCurrent(name); }
export function hideModal () { setCurrent(null); }
</script>

<script>
export let title, name;
</script>

<style>
.overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(6px);
}

.modal {
    width: 250px;
    margin: 0 15px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
}

.modal > .title {
    padding: 12px 0;
    background: linear-gradient(180deg, #fff 0%, #eee 100%);
    font-size: 15px;
    text-align: center;
}

.modal > :global(p) {
    margin: 12px;
    font-size: 14px;
    line-height: 1.25;
}

.modal > :global(footer) {
    display: flex;
    justify-content: space-between;
}
</style>