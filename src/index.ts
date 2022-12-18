import express from "express";
import path from "path";
import puppeteer from "puppeteer";
import { Browser, LaunchOptions, NavOptions } from "./main";
import { browseRacerX } from "./Scrapers/RacerX/Podcast";
import { browseXReports } from "./Scrapers/XReports/Report";

// Puppeteer: https://pptr.dev/api/

const app = express();
const PORT = process.env.PORT || 5000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);

app.get("/", (req, res) => {
  res.render("index", { msg: "Welcome!" });
});

const launchOptions: LaunchOptions = {
  headless: true,
  defaultViewport: {
    width: 1920,
    height: 1080,
  },
};
export const pageOptions: NavOptions = {
  waitUntil: "networkidle2",
};

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  browseRacerX();
  // browseXReports();
});

class Kapi {
  browser: Browser;

  constructor() {
    this.browser = null;
  }

  async open() {
    this.browser = await puppeteer.launch(launchOptions);
  }

  async goto(url: string) {
    const page = await this.browser.newPage();
    await page.goto(url, pageOptions);
    return page;
  }

  async saveFindings() {}

  async close() {
    this.browser.close();
  }
}

export default new Kapi();
