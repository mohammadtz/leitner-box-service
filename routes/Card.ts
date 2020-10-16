import { json, Request, Router } from "express";
import { UserData } from "..";
import Card from "../models/Card";
import { cardValidation } from "../validation";
import { verifyToken } from "./verifyToken";

export const cardRouter = Router();

cardRouter.get("/", verifyToken, async (req: UserData, res) => {
  const getCardsByUserId = await Card.find({ userId: req.user._id }).exec();
  console.log(getCardsByUserId);
  if (!getCardsByUserId) {
    res.status(404).send("data not found");
  }
  res.send(getCardsByUserId);
});

cardRouter.post("/", verifyToken, async (req: UserData, res) => {
  cardValidation(req, res);
  const card = new Card({
    front: req.body.front,
    back: req.body.back,
    userId: req.user._id,
    box_number: 1,
  });

  try {
    const savedCard = await card.save();
    res.send(savedCard);
  } catch (error) {
    res.status(400).send(error);
    throw error;
  }
});
