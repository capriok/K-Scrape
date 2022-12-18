import { Api } from "../../api";
import { Page } from "../../main";
import { reportContentScraper, reportListScraper } from "./scrapers";

const Kapi = new Api.Kapi();

export async function browseXReports() {
  const xReports = "https://x22report.com/all-x22-reports";
  await Kapi.open();
  const page = await Kapi.goto(xReports);
  const reports = await initializeReportScraper(page);
  Kapi.close();
}

export const initializeReportScraper = async (page: Page): Promise<unknown> => {
  const reportList = await reportListScraper(page, 2);

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
