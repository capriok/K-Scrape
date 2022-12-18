import { Api } from "../../api";
import { Page } from "../../main";
import { cleanText } from "../../Helpers/functions";

const Kapi = new Api.Kapi();

export const categoryListScraper = async (
  page: Page,
  limit?: number
): Promise<string[]> => {
  const url = ".right > a";

  let list = await page.$$eval(url, (nodes: Element[]): string[] => {
    return nodes.map((node: Element): string => {
      return node.getAttribute("href");
    });
  });

  return list.slice(0, limit ? limit : list.length);
};

export const articleListScraper = async (
  page: Page,
  limit?: number
): Promise<string[]> => {
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
    description: ".block_container > .intro",
    podcast: ".block_container > iframe",
  };

  const article = await page.$(content);

  let podcast: string | undefined;
  try {
    const iframe = await page.$(selectors.podcast);
    const frame = await iframe.contentFrame();
    podcast = frame.url();
  } catch (error) {
    Kapi.log(error.message, "Warn");
  }

  const title = await article.$eval(
    selectors.title,
    (node: Element): string => node.textContent
  );

  const date = await article.$eval(
    selectors.date,
    (node: Element): string => node.textContent
  );

  const description = await article.$$eval(
    selectors.description,
    (nodes: Element[]): string[] => {
      return nodes.slice(0, 2).map((node: Element): string => {
        return node.textContent.replace("Watch The X22 Report On Video", "");
      });
    }
  );

  const meta = {
    title: await page.title(),
    url: page.url(),
  };

  return {
    title: cleanText(title),
    date: cleanText(date),
    description: cleanText(description),
    podcast,
    meta,
  };
};
