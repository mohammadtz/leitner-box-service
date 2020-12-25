import { Router } from "express";
import { Types } from "mongoose";
import { UserData } from "..";
import Card from "../models/Card";
import ViewHistory from "../models/ViewHistory";
import { verifyToken } from "./verifyToken";

export const historyRouter = Router();

//get /api/history
historyRouter.get("/", verifyToken, async (req: UserData, res) => {
  return await Card.aggregate([
    // { $match: { userId: Types.ObjectId(req.user._id) } },
    {
      $lookup: {
        from: "viewhistories",
        localField: "uniqueId",
        foreignField: "CardREF",
        as: "history",
      },
    },
  ]).exec((err, result) => {
    if (err) {
      return res.status(400).send({ message: err });
    }

    return res.send(result);
  });
});
