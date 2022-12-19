import { K } from "../../api";
import { Page } from "../../main";
import { cleanText } from "../../Helpers/functions";

const Kapi = new K.api();

export const categoryListScraper = async (page: Page, limit?: number): Promise<string[]> => {
  const url = ".right > a";

  let list = await page.$$eval(url, (nodes: Element[]): string[] => {
    return nodes.map((node: Element): string => {
      return node.getAttribute("href");
    });
  });

  const categories = [
    "/category/racer-x-podcast",
    "/category/racer-x-race-review-podcast",
    "/category/exhaust",
  ];

  const filtered = list.filter((l) => categories.includes(l));

  return filtered.slice(0, limit ? limit : list.length);
};

export const articleListScraper = async (page: Page, limit?: number): Promise<string[]> => {
  const url = ".ui_link.big_link";

  let list = await page.$$eval(url, (nodes: Element[]): string[] => {
    return nodes.map((node: Element): string => {
      return node.getAttribute("href");
    });
  });

  return list.slice(0, limit ? limit : list.length);
};

export const articleContentScraper = async (page: Page): Promise<object> => {
  const content = "#content";
  const selectors = {
    title: ".hero_title",
    date: ".hero_sub > .date",
    description: ".block_container > p:not(.intro)",
    podcast: ".block_container > iframe",
    image: ".img_wrap > img",
  };

  const article = await page.$(content);

  let podcast: string | undefined;
  try {
    const iframe = await page.$(selectors.podcast);
    const frame = await iframe.contentFrame();
    podcast = frame.url();
  } catch (error) {
    Kapi.log(error.message, "Scraper");
  }

  const title = await article
    .$eval(selectors.title, (node: Element): string => node.textContent)
    .catch((e) => Kapi.log(e.message));

  const date = await article
    .$eval(selectors.date, (node: Element): string => node.textContent)
    .catch((e) => Kapi.log(e.message));

  const description = await article
    .$$eval(selectors.description, (nodes: Element[]): string[] => {
      return nodes.slice(0, 2).map((node: Element): string => {
        return node.textContent;
      });
    })
    .catch((e) => Kapi.log(e.message));

  const image = await article
    .$eval(selectors.image, (node: Element): string => node.getAttribute("src"))
    .then((src) => "https://" + src.slice(2))
    .catch((e) => Kapi.log(e.message));

  const meta = {
    title: await page.title(),
    url: page.url(),
  };

  return {
    title: cleanText(title),
    date: cleanText(date),
    description: cleanText(description),
    image,
    podcast,
    meta,
  };
};
