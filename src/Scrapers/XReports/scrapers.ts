import { Api } from "../../api";
import { cleanText } from "../../Helpers/functions";
import { Page } from "../../main";

const Kapi = new Api.Kapi();

export const reportListScraper = async (
  page: Page,
  limit?: number
): Promise<string[]> => {
  const titleUrl = ".title > a";

  let reportUrls = await page.$$eval(titleUrl, (nodes: Element[]): string[] => {
    return nodes.map((node: Element): string => {
      return node.getAttribute("href");
    });
  });

  return reportUrls.slice(0, limit ? limit : reportUrls.length);
};

export const reportContentScraper = async (page: Page): Promise<Object> => {
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
    description: cleanText(description),
    podcast,
  };
};
