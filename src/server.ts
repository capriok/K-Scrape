import express from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import { browseRacerX } from "./scrapers/RacerX";
import { browseXReports } from "./scrapers/Xreports";
import routes from "./routes/index";

// Puppeteer: https://pptr.dev/api/puppeteer.page
// Semantic: https://semantic-ui.com/elements/button.html
// EJS: https://github.com/arboiscodemedia/Typescrip-series/tree/main/Products
// R18 SSR: https://codesandbox.io/s/kind-sammet-j56ro?file=/server/render.js

const app = express();
const PORT = process.env.PORT || 5000;

app.use(expressLayouts);
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);
app.set("layout", "layouts/layout");
app.set("views", path.join(__dirname, "views"));
app.set("assets", path.join(__dirname, "assets"));
app.use(express.static(path.join(__dirname, "public")));

const router = express.Router();
app.use("/", routes(router));

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  // hopOn();
});

const hopOn = () => {
  browseRacerX();
  browseXReports();
};
