import { Router } from "express";
import { Types } from "mongoose";
import { UserData } from "..";
import ViewHistory from "../models/ViewHistory";
import { verifyToken } from "./verifyToken";

export const reportRouter = Router();

reportRouter.get("/", verifyToken, async (req: UserData, res) => {
  const history = await ViewHistory.find({
    userId: Types.ObjectId(req.user._id),
  });
  let correct = 0;
  let incorrect = 0;
  let correctPersent = 0;
  let incorrectPersent = 0;

  history.forEach((item) => {
    if (item.status === 1) {
      correct += 1;
    } else {
      incorrect += 1;
    }
  });

  correctPersent = (100 * correct) / (correct + incorrect);
  incorrectPersent = (100 * incorrect) / (correct + incorrect);

  return res.send({
    totalViews: history.length,
    correct,
    incorrect,
    correctPersent,
    incorrectPersent,
  });
});
