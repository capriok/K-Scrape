import { Page } from './main'

import { clearnPrice, capitalize, cleanText } from './utils/utils'

const infoHandle = '.product-detail__info'
const imagesHandle = '.css-2zclyl'
const selectors = {
	title: '.product-name',
	origPrice: '.value',
	salePrice: '.price__value--sale',
	color: '.js-selected-color',
	description: '.js-content',
	details: '.js-content > .pl-3 > li',
	images: '.css-1a4s3ga>.css-1p6kesl>.assetWrapper>.css-wxdkry>.css-b7jmoi>img'

}

export default async function scrapeListing(page: Page): Promise<Object> {

	const listingInfo = await page.$(infoHandle)

	const title = await listingInfo.$eval(
		selectors.title,
		(node: Element): string => node.textContent
	)

	const origPrice = await listingInfo.$eval(
		selectors.origPrice,
		(node: Element): string => node.textContent
	)

	const salePrice = await listingInfo.$eval(
		selectors.salePrice,
		(node: Element): string => node.textContent
	)

	const color = await listingInfo.$eval(
		selectors.color,
		(node: Element): string => node.textContent
	)

	const description = await listingInfo.$eval(
		selectors.description,
		(node: Element): string => node.textContent
	)

	const details = await listingInfo.$$eval(
		selectors.details,
		(nodes: Element[]): string[] => {
			return nodes.map((node: Element): string => {
				return node.textContent
			})
		}
	)

	const listingImages = await page.$(imagesHandle)

	const images = await listingImages.$$eval(
		selectors.images,
		(nodes: Element[]): string[] => {
			return nodes.map((node: Element): string => {
				return node.getAttribute('src')
			})
		}
	)

	return {
		title: cleanText(title),
		origPrice: clearnPrice(origPrice),
		salePrice: clearnPrice(salePrice),
		color: capitalize(color),
		description: cleanText(description),
		details: details.map(d => cleanText(d)),
		images
	}
}