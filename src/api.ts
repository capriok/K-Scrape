import fs from "fs";
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

export namespace K {
  export class api {
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

    async save(filename: string, data: any) {
      fs.writeFileSync(
        `src/Findings/${filename}-findings.json`,
        JSON.stringify(data)
      );
      console.log("Saved Findings!", "File");
    }

    async load(filename: string) {
      const file = JSON.parse(
        fs.readFileSync(`src/Findings/${filename}-findings.json`, "utf8")
      );
      return file;
    }

    async close() {
      this.log("Closing browser");
      this.browser.close();
    }

    log(msg: any, type?: string) {
      console.log(`[${type || "Log"}]:`, msg);
    }
  }
}
