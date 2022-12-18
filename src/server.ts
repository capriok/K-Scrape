import express from "express";
import path from "path";
import { browseRacerX } from "./Scrapers/RacerX";
import { browseXReports } from "./Scrapers/XReports";

// Puppeteer: https://pptr.dev/api/

const app = express();
const PORT = process.env.PORT || 5000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);

app.get("/", (req, res) => {
  res.render("index", { msg: "Welcome!" });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  browseRacerX();
  // browseXReports();
});
