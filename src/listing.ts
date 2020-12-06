import { Page, HTMLEl } from './typings'
import { createImg, createString, parsePrice, parseText } from './utils/utils'

const titleX = '/html/body/div[2]/div[3]/div[1]/div[2]/div/div[1]/div/h1'
const priceX = '/html/body/div[2]/div[3]/div[1]/div[2]/div/div[2]/div/div/div/span/span/span'
const descX = '//*[@id="description-1"]'
const detailsX = '//*[@id="details-1"]/ul'
const imgX = '/html/body/div[2]/div[3]/div[1]/div[1]/div[1]/div/div[1]/div/div/div[1]/div/div/img'

export default async function scrapeListing(page: Page) {

	const [titleHandle] = await page.$x(titleX)
	const title = await createString('textContent', titleHandle)

	const [priceHandle] = await page.$x(priceX)
	const price = await parsePrice(await createString('textContent', priceHandle))

	const [descHandle] = await page.$x(descX)
	const description = await createString('textContent', descHandle)

	const [detailshandle] = await page.$x(detailsX)
	const details = await createList(detailshandle)

	const [imgHandle] = await page.$x(imgX)
	const img = await createImg(imgHandle)

	return { title, price, description, details, img }

}

async function createList(map: HTMLEl): Promise<string[]> {
	if (map === undefined) return null
	const ulChildren = await map.getProperty('children')
	const amount = Object.keys(await ulChildren.jsonValue()).length
	let arr = []
	let nth = 1
	for (let i = 0; i < amount; i++) {
		let liX = `${detailsX}/li[${nth}]`
		let [liHandle] = await map.$x(liX)
		let liText = await liHandle.getProperty('textContent')
		let rawLi = await liText.jsonValue()
		arr.push(parseText(rawLi))
		nth++
	}

	return arr
}
