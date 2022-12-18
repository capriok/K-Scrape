import { Api } from "../../api";
import {
  articleContentScraper,
  categoryListScraper,
  articleListScraper,
} from "./scrapers";
import { Page } from "../../main";

const Kapi = new Api.Kapi();

const racerxBase = "https://racerxonline.com";

export async function browseRacerX() {
  const racerx = `${racerxBase}/podcasts`;
  await Kapi.open();
  const page = await Kapi.goto(racerx);
  const articles = await initializeCategoryScraper(page);
  Kapi.log(articles, "Finding");
  Kapi.close();
}

export async function initializeCategoryScraper(page: Page): Promise<unknown> {
  const categoryList = await categoryListScraper(page, 2);

  let articles = [];
  let progressc = 1;
  let progressa = 1;

  for (const urlc of categoryList) {
    Kapi.log(`CategoryList Scraping ${progressc} of ${categoryList.length}`);
    const page = await Kapi.goto(racerxBase + urlc);
    const articlesList = await articleListScraper(page, 2);

    for (const urla of articlesList) {
      Kapi.log(
        `ArticlesList Scraping ${progressa} of ${
          categoryList.length + articlesList.length
        }`
      );
      const page = await Kapi.goto(racerxBase + urla);
      articles.push(await articleContentScraper(page));

      progressa++;
    }

    progressc++;
  }

  console.log(`Successfully Scraped ${progressc} Categories`);
  console.log(`Successfully Scraped ${progressa} Articles`);

  return articles;
}
