import puppeteer from "puppeteer";
import { Browser, LaunchOptions, NavOptions } from "./main";

const launchOptions: LaunchOptions = {
  headless: true,
  defaultViewport: {
    width: 1920,
    height: 1080,
  },
};
const pageOptions: NavOptions = {
  waitUntil: "networkidle2",
};

export namespace Api {
  export class Kapi {
    browser: Browser;

    constructor() {
      this.browser = null;
    }

    async open() {
      this.log("Opening browser");
      this.browser = await puppeteer.launch(launchOptions);
    }

    async goto(url: string) {
      const page = await this.browser.newPage();
      await page.goto(url, pageOptions);
      this.log(`At Page: ${url}`);
      return page;
    }

    async saveFindings() {}

    async close() {
      this.log("Closing browser");
      this.browser.close();
    }

    log(msg: string, type?: string) {
      console.log(`[${type || "Log"}]: ${msg} `);
    }
  }
}
