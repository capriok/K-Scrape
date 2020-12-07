import { Page, HTMLEl } from './main'
import { clearnPrice, capitalize, cleanText } from './utils/utils'

const listingInfoSelector = '.product-detail__info'
const titleSelector = '.product-name'
const origPriceSelector = '.value'
const salePriceSelector = '.price__value--sale'
const colorSelector = '.js-selected-color'
const descriptionSelector = '.js-content'
const detailsSelector = '.js-content > .pl-3 > li'

const listingImagesSelector = '.css-2zclyl'
const imagesSelector = '.css-1a4s3ga>.css-1p6kesl>.assetWrapper>.css-wxdkry>.css-b7jmoi>img'

export default async function scrapeListing(page: Page): Promise<Object> {

	const listingInfo = await page.$(listingInfoSelector)

	const title = await listingInfo.$eval(
		titleSelector,
		(node: Element): string => node.textContent
	)

	const origPrice = await listingInfo.$eval(
		origPriceSelector,
		(node: Element): string => node.textContent
	)

	const salePrice = await listingInfo.$eval(
		salePriceSelector,
		(node: Element): string => node.textContent
	)

	const color = await listingInfo.$eval(
		colorSelector,
		(node: Element): string => node.textContent
	)

	const description = await listingInfo.$eval(
		descriptionSelector,
		(node: Element): string => node.textContent
	)

	const details = await listingInfo.$$eval(
		detailsSelector,
		(nodes: Element[]): string[] => {
			return nodes.map((node: Element): string => {
				return node.textContent
			})
		}
	)

	const listingImages = await page.$(listingImagesSelector)

	const images = await listingImages.$$eval(
		imagesSelector,
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