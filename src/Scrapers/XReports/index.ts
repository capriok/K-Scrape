import { Api } from "../../api";
import { Page } from "../../main";
import { reportContentScraper, reportListScraper } from "./scrapers";

const Kapi = new Api.Kapi();

const xReportsBase = "https://x22report.com";

export async function browseXReports() {
  const xReports = `${xReportsBase}/all-x22-reports`;
  await Kapi.open();
  const page = await Kapi.goto(xReports);
  const reports = await initializeReportScraper(page);
  Kapi.log(reports, "Finding");
  Kapi.close();
}

export const initializeReportScraper = async (page: Page): Promise<unknown> => {
  const reportList = await reportListScraper(page, 2);

  let reports = [];
  let progress = 1;

  for (const url of reportList) {
    Kapi.log(`ReportList Scraping ${progress} of ${reportList.length}`);
    const page = await Kapi.goto(url);
    reports.push(await reportContentScraper(page));

    progress++;
  }

  Kapi.log(`Successfully Scraped ${reportList.length} Reports`);

  return reports;
};
