import express from 'express'
import puppeteer from 'puppeteer'
import categoryScraper from './category'
import listingScraper from './listing'
import { LaunchOptions, NavOptions, Page } from './typings'

const app = express()
const PORT = process.env.PORT || 9000

const scraperLaunchOptions: LaunchOptions = {
	headless: true,
	defaultViewport: {
		width: 1920,
		height: 1080
	}
}
const pageOptions: NavOptions = {
	waitUntil: 'networkidle2'
}
const categoryURL = 'https://www.guess.com/us/en/men/apparel/new-arrivals'

app.listen(PORT, () => {
	console.log(`Server running on ${PORT}`)
	startBrowser(categoryURL)
})

async function startBrowser(URL: string) {
	const browser = await puppeteer.launch(scraperLaunchOptions)
	const categoryPage = await browser.newPage()
	const listingUrls = await initCategoryScraper(categoryPage, URL)
	const listings = await initListingScaper(categoryPage, listingUrls)

	browser.close()
}


async function initCategoryScraper(page: Page, URL: string): Promise<string[]> {
	console.log('Initializing Category Scraper');

	await page.goto(URL, pageOptions)

	const urls = await categoryScraper(page)

	return urls
}

async function initListingScaper(page: Page, listingUrls: string[]): Promise<unknown> {
	console.log('Initializing Listing Loop Scraper');

	let arr = []
	let progress = 1

	for (const url of listingUrls) {
		console.log(`${progress} of ${listingUrls.length}`);
		if (url.includes('klarna')) return
		await page.goto(url, pageOptions)
		arr.push(await listingScraper(page))
		progress++
	}

	console.log(`Successfully Scraped ${listingUrls.length} listings`)
	console.log(arr);

	return arr
}