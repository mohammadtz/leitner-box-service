import { Router } from "express";
import { UserData } from "..";
import Card from "../models/Card";
import { cardValidation } from "../validation";
import { verifyToken } from "./verifyToken";

export const cardRouter = Router();

cardRouter.get("/", verifyToken, async (req: UserData, res) => {
  const getCardsByUserId = await Card.find({ userId: req.user._id });
  if (!getCardsByUserId) {
    res.status(404).send("data not found");
  }
  res.send(getCardsByUserId);
});

cardRouter.get("/count", verifyToken, async (req: UserData, res) => {
  const box1 = await Card.count(
    { userId: req.user._id, box_number: 1 },
    (err) => console.log(err)
  );
  const box2 = await Card.count({ userId: req.user._id, box_number: 2 });
  const box3 = await Card.count({ userId: req.user._id, box_number: 3 });
  const box4 = await Card.count({ userId: req.user._id, box_number: 4 });
  const box5 = await Card.count({ userId: req.user._id, box_number: 5 });
  res.send({ box1, box2, box3, box4, box5 });
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
