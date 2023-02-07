import { StartStopNotifier, Writable, Readable } from 'svelte/store'

export function localRead (key: string, defaultValue: any): any;
export function localWrite (key: string, value: any): void;

type InternalWritable<T> = Writable<T> & { public: Readable<T> };
export function internal<T> (initial: T, start?: StartStopNotifier<T>): InternalWritable<T>;
