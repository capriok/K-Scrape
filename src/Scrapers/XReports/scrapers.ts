import { K } from "../../api";
import { cleanText } from "../../Helpers/functions";
import { Page } from "../../main";

const Kapi = new K.api();

export const reportListScraper = async (page: Page, limit?: number): Promise<string[]> => {
  const titleUrl = ".title > a";

  let list = await page.$$eval(titleUrl, (nodes: Element[]): string[] => {
    return nodes.map((node: Element): string => {
      return node.getAttribute("href");
    });
  });

  return list.slice(0, limit ? limit : list.length);
};

export const reportContentScraper = async (page: Page): Promise<Object> => {
  const content = ".article-content";
  const selectors = {
    title: ".entry-title",
    date: ".entry-date",
    description: ".entry-content > p:not(.powerpress_links)",
    podcast: ".entry-content > iframe",
    image: "img.size-full",
  };

  const report = await page.$(content);

  let podcast: string | undefined;
  try {
    const iframe = await page.$(selectors.podcast);
    const frame = await iframe.contentFrame();
    podcast = frame.url();
  } catch (error) {
    Kapi.log(error.message, "Scraper");
  }

  const title = await report
    .$eval(selectors.title, (node: Element): string => node.textContent)
    .catch((e) => Kapi.log(e.message));

  const date = await report
    .$eval(selectors.date, (node: Element): string => node.textContent)
    .catch((e) => Kapi.log(e.message));

  const description = await report
    .$$eval(selectors.description, (nodes: Element[]): string[] => {
      return nodes.slice(0, 2).map((node: Element): string => {
        return node.textContent.replace("Watch The X22 Report On Video", "");
      });
    })
    .catch((e) => Kapi.log(e.message));

  const image = await report
    .$eval(selectors.image, (node: Element): string => node.getAttribute("src"))
    .catch((e) => Kapi.log(e.message));

  const meta = {
    title: await page.title(),
    url: page.url(),
  };

  return {
    title: cleanText(title),
    date: cleanText(date),
    description: cleanText(description),
    image: image && image,
    podcast,
    meta,
  };
};
