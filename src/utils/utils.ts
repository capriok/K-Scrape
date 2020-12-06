import { HTMLEl } from '../typings'

export async function createString(prop: string, el: HTMLEl): Promise<string | unknown> {
	if (el === undefined) return null
	const string = await el.getProperty(prop)
	const rawString = await string.jsonValue()
	return await parseText(rawString)
}

export async function createImg(img: HTMLEl): Promise<string | unknown> {
	if (img === undefined) return null
	const src = await img.getProperty('src')
	const rawSrc = await src.jsonValue()
	return await rawSrc
}

export function parseText<T>(text: T): string {
	return String(text).replace(/\r?\n|\r/g, '')
}

export function parsePrice<T>(price: T): string {
	return String(price).replace(/[^$0-9.]+/g, '')
}