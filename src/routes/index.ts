import { Router as R } from "express";
import HomeController from "../controllers/HomeController";
import RacerxController from "../controllers/RacerxController";
import XreportController from "../controllers/XreportController";

export default function Router(router: R): R {
  router.route("/").get(HomeController);
  router.route("/racerx").get(RacerxController);
  router.route("/xreport").get(XreportController);
  return router;
}
