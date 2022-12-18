import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import { K } from "./api";
import { browseRacerX } from "./scrapers/RacerX";
import { browseXReports } from "./scrapers/XReports";

// Puppeteer: https://pptr.dev/api/puppeteer.page
// EJS repo: https://github.com/arboiscodemedia/Typescrip-series/tree/main/Products

const app = express();
const PORT = process.env.PORT || 5000;

app.use(expressLayouts);
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);
app.set("layout", "layouts/layout");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const Kapi = new K.api();

app.get("/", async (req, res) => {
  const racerx = await Kapi.load("racerx").catch((e) =>
    Kapi.log(e.message, "File")
  );
  const xreport = await Kapi.load("xreport").catch((e) =>
    Kapi.log(e.message, "File")
  );

  res.render("home", {
    racerx,
    xreport,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  // hopOn();
});

const hopOn = () => {
  browseRacerX();
  browseXReports();
};
