export function cleanText<T>(text: T): string {
	return String(text).replace(/\r?\n|\r/g, '')
}

export function clearnPrice<T>(price: T): string {
	return String(price).replace(/[^$0-9.]+/g, '')
}

export function capitalize<T>(string: T): string {
	return String(string)[0].toUpperCase() + String(string).slice(1)
}