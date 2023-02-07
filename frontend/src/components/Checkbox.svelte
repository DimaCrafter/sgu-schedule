<div on:click={toggle} class="checkbox {$$props.class}" class:checked={target.includes(value)}>
	<i></i>
	<slot />
</div>

<script>
/** @type {string[]} */
export let target;
/** @type {string} */
export let value;

function toggle () {
	const i = target.indexOf(value);
	if (i == -1) target.push(value);
	else target.splice(i, 1);

	target = [...target];
}
</script>

<style>
.checkbox > i {
    position: relative;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    margin-right: 12px;
    background: linear-gradient(180deg, #F6F6F6 0%, #DEDEDE 100%);
    box-shadow: inset #e7e7e7 0 0 0 1px;
}

.checkbox {
    display: flex;
    align-items: center;
}

.checkbox.checked > i:before {
    content: '';
    position: absolute;
    top: 3px;
    left: 6px;
    width: 3px;
    height: 6px;
    border-right: 2px solid #305dff;
    border-bottom: 2px solid #305dff;
    transform: rotateZ(45deg);
}
</style>