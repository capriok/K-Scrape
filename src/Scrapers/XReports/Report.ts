import Kapi from "../../";
import { cleanText } from "../../Helpers/functions";
import { Page } from "../../main";

export async function browseXReports() {
  const xReports = "https://x22report.com/all-x22-reports";
  await Kapi.open();
  const page = await Kapi.goto(xReports);
  const reports = await initializeReportScraper(page);
  Kapi.close();
}

export const initializeReportScraper = async (page: Page): Promise<unknown> => {
  const reportList = await reportListScraper(page, 2);

  console.log("Initializing Listing Loop Scraper");

  let reports = [];
  let progress = 1;

  for (const url of reportList) {
    console.log(`${progress} of ${reportList.length}`);
    const page = await Kapi.goto(url);
    reports.push(await reportContentScraper(page));
    progress++;
  }

  console.log(`Successfully Scraped ${reportList.length} listings`);
  console.log(reports);

  return reports;
};

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
