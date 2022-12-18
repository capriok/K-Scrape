import { Api } from "../../api";
import {
  articleContentScraper,
  categoryListScraper,
  categoryPageScraper,
} from "./scrapers";
import { Page } from "../../main";

const Kapi = new Api.Kapi();

const racerxBase = "https://racerxonline.com";

export async function browseRacerX() {
  const racerx = `${racerxBase}/podcasts`;
  console.log(Kapi);

  await Kapi.open();
  const page = await Kapi.goto(racerx);
  const articles = await initializeCategoryScraper(page);
  Kapi.close();
}

export async function initializeCategoryScraper(page: Page): Promise<unknown> {
  const categoryList = await categoryListScraper(page, 2);

  let articles = [];
  let progress = 1;

  for (const urlc of categoryList.slice(0, 2)) {
    console.log(`${progress} of ${categoryList.length}`);
    const page = await Kapi.goto(racerxBase + urlc);
    const articlesList = await categoryPageScraper(page);

    for (const urla of articlesList.slice(0, 2)) {
      console.log(`${progress} of ${articlesList.length}`);
      const page = await Kapi.goto(racerxBase + urla);
      articles.push(await articleContentScraper(page));

      progress++;
    }
  }

  console.log(`Successfully Scraped ${progress} listings`);
  console.log(articles);

  return articles;
}
