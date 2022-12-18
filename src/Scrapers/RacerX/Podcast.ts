import Kapi from "../../";
import { cleanText } from "../../Helpers/functions";
import { Page } from "../../main";

export async function browseRacerX() {
  const racerx = "https://racerxonline.com/podcasts";
  await Kapi.open();
  const page = await Kapi.goto(racerx);
  const articles = await initializeCategoryScraper(page);
  Kapi.close();
}

export async function initializeCategoryScraper(page: Page): Promise<unknown> {
  const categoryList = await categoryListScraper(page, 2);

  console.log("Initializing Listing Loop Scraper");

  let articles = [];
  let progress = 1;

  for (const url of categoryList) {
    console.log(`${progress} of ${categoryList.length}`);
    // const page = await Kapi.goto(url);
    // articles.push(await articleContentScraper(page));
    progress++;
  }

  console.log(`Successfully Scraped ${categoryList.length} listings`);
  console.log(articles);

  return articles;
}

const categoryListScraper = async (
  page: Page,
  limit?: number
): Promise<string[]> => {
  const url = ".right > a";

  let categoryUrls = await page.$$eval(url, (nodes: Element[]): string[] => {
    return nodes.map((node: Element): string => {
      return node.getAttribute("href");
    });
  });
  console.log(categoryUrls);

  return categoryUrls.slice(0, limit ? limit : categoryUrls.length);
};

const articleContentScraper = async (page: Page): Promise<object> => {
  const content = ".article-content";
  const selectors = {
    title: ".entry-title",
    date: ".entry-date",
    description: ".entry-content > p:not(.powerpress_links)",
    podcast: ".entry-content > iframe",
  };

  const report = await page.$(content);

  const iframe = await page.$(selectors.podcast);
  const frame = await iframe.contentFrame();
  const podcast = frame.url();

  const title = await report.$eval(
    selectors.title,
    (node: Element): string => node.textContent
  );

  const date = await report.$eval(
    selectors.date,
    (node: Element): string => node.textContent
  );

  const description = await report.$$eval(
    selectors.description,
    (nodes: Element[]): string[] => {
      return nodes.slice(0, 2).map((node: Element): string => {
        return node.textContent.replace("Watch The X22 Report On Video", "");
      });
    }
  );

  return {
    title: cleanText(title),
    date: cleanText(date),
    // description: cleanText(description),
    podcast,
  };
};
