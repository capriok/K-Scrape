import { Page, HTMLEl } from './typings'
import { createString } from './utils/utils'

const allListings = '/html/body/div[2]/div[5]/div/div/div[2]/div[3]'
const linkX = '/div/div/a'

export default async function scrapeCategory(page: Page) {
	const [listingMap] = await page.$x(allListings)
	const listingsUrls = await createList(listingMap, 5)

	return listingsUrls
}

async function createList(map: HTMLEl, count?: number): Promise<string[]> {
	if (map === undefined) return null
	const mapChildren = await map.getProperty('children')
	let amount = count
	if (count === undefined) amount = Object.keys(await mapChildren.jsonValue()).length

	let arr = []
	let nth = 1

	for (let i = 0; i < amount; i++) {
		let anchorX = `${allListings}/div[${nth}]${linkX}`
		let [linkHandle] = await map.$x(anchorX)
		let link = await createString('href', linkHandle)
		arr.push(link)
		nth++
	}

	return arr
}
