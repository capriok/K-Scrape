import { Request, Response } from "express";
import { K } from "../api";

const Kapi = new K.api();

const RacerxController = async (req: Request, res: Response, next: any) => {
  const racerx = await Kapi.load("racerx").catch(e => Kapi.log(e.message, "File"));

  res.render("Racerx.html", {
    view: "../Racerx.html",
    racerx
  });
};

export default RacerxController;
