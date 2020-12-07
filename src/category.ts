import { Page } from './main'

const listingAnchorSelector = '.product-tile__main-link'

export default async function scrapeCategory(page: Page): Promise<string[]> {

	let listingUrls = await page.$$eval(
		listingAnchorSelector,
		(nodes: Element[]): string[] => {
			return nodes.slice(0, 5).map((node: Element): string => {
				return node.getAttribute('href')
			})
		}
	)

	return listingUrls
}
