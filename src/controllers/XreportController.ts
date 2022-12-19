import { Request, Response } from "express";
import { K } from "../api";

const Kapi = new K.api();

const XreportController = async (req: Request, res: Response, next: any) => {
  const xreport = await Kapi.load("xreport").catch(e => Kapi.log(e.message, "File"));

  res.render("Xreport.html", {
    view: "../Xreport.html",
    xreport
  });
};

export default XreportController;
