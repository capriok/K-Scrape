import { K } from "../../api";
import { Page } from "../../main";
import { reportContentScraper, reportListScraper } from "./scrapers";

const Kapi = new K.api();

const xReportsBase = "https://x22report.com";

export async function browseXReports() {
  const xReports = `${xReportsBase}/all-x22-reports`;
  await Kapi.open();
  const page = await Kapi.goto(xReports);
  const reports = await initializeReportScraper(page);
  Kapi.save("xreport", reports);
  Kapi.close();
}

export const initializeReportScraper = async (page: Page) => {
  const reportList = await reportListScraper(page, 5);

  let reports = [];
  let progress = 1;

  for (const url of reportList) {
    Kapi.log(`ReportList Scraping #${progress}`);
    const page = await Kapi.goto(url);
    reports.push(await reportContentScraper(page));

    progress++;
  }

  Kapi.log(`Successfully Scraped ${reportList.length} Reports`);

  return reports;
};
