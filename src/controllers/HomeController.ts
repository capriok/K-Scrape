import { Request, Response } from "express";
import { K } from "../api";

const Kapi = new K.api();

const HomeController = async (req: Request, res: Response, next: any) => {
  const racerx = await Kapi.load("racerx").catch(e => Kapi.log(e.message, "File"));
  const xreport = await Kapi.load("xreport").catch(e => Kapi.log(e.message, "File"));

  res.render("Home.html", {
    view: "../Home.html",
    racerx,
    xreport
  });
};

export default HomeController;
