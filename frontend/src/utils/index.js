/**
 * @template T
 * @param {import('svelte/store').Readable<T>} store
 * @returns {T | undefined}
 */
export function raw (store) {
	let value;
	store.subscribe(_value => value = _value)();
	return value;
}

export function shadeObj (object, ...fields) {
	const result = {};
	for (const field of fields) {
		result[field] = object[field];
	}

	return result;
}
