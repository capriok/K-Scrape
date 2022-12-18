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

// mine
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "html");
// app.engine("html", require("ejs").renderFile);

// repo
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  const Kapi = new K.api();
  const racerx = await Kapi.load("racerx").catch((e) =>
    Kapi.log(e.message, "File")
  );
  const xreport = await Kapi.load("xreport").catch((e) =>
    Kapi.log(e.message, "File")
  );

  res.render("main", {
    racerx: racerx,
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
