import express from 'express'
import path from 'path'
import puppeteer from 'puppeteer'
import categoryScraper from './category'
import listingScraper from './listing'
import { LaunchOptions, NavOptions, Page } from './main'

const app = express()
const PORT = process.env.PORT || 9000

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
	res.render('index', { msg: 'Welcome!' })
})

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
	await initListingScaper(categoryPage, listingUrls)

	browser.close()
}


async function initCategoryScraper(page: Page, URL: string): Promise<string[] | any> {
	console.log('Initializing Category Scraper');

	await page.goto(URL, pageOptions)

	const listingUrls = await categoryScraper(page)

	console.log(`Successfully scraped ${listingUrls.length} listings`);
	console.log(listingUrls);

	return listingUrls
}

async function initListingScaper(page: Page, listingUrls: string[]): Promise<unknown> {
	console.log('Initializing Listing Loop Scraper');

	let listings = []
	let progress = 1

	for (const url of listingUrls) {
		console.log(`${progress} of ${listingUrls.length}`);
		await page.goto(url, pageOptions)
		listings.push(await listingScraper(page))
		progress++
	}

	console.log(`Successfully Scraped ${listingUrls.length} listings`)
	console.log(listings);

	return listings
}