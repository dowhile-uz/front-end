// import { type ClassValue, clsx } from 'clsx'
// import { twMerge } from 'tailwind-merge'

export function cn(...inputs: any[]) {
	// return twMerge(clsx(inputs))
	return "";
}

export function randomElement<T>(array: Array<T>): T {
	return array[Math.floor(Math.random() * array.length)];
}

export * from "./css-var";
export * from "./get-connection-text";
export * from "./get-render-container";
export * from "./is-custom-node-selected";
export * from "./is-text-selected";
