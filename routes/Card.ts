import { Router } from "express";
import { UserData } from "..";
import Card from "../models/Card";
import { cardValidation } from "../validation";
import { verifyToken } from "./verifyToken";

export const cardRouter = Router();

cardRouter.get("/", verifyToken, async (req: UserData, res) => {
  console.log(req.user);
  const getCardsByUserId = await Card.find({ userId: req.user._id });
  if (!getCardsByUserId) {
    res.status(404).send({ message: "data not found" });
  }
  res.send(getCardsByUserId);
});

cardRouter.get("/count", verifyToken, async (req: UserData, res) => {
  const box1 = await Card.countDocuments(
    { userId: req.user._id, box_number: 1 },
    (err) => console.log(err)
  );
  const box2 = await Card.countDocuments({
    userId: req.user._id,
    box_number: 2,
  });
  const box3 = await Card.countDocuments({
    userId: req.user._id,
    box_number: 3,
  });
  const box4 = await Card.countDocuments({
    userId: req.user._id,
    box_number: 4,
  });
  const box5 = await Card.countDocuments({
    userId: req.user._id,
    box_number: 5,
  });
  res.send({ box1, box2, box3, box4, box5 });
});

cardRouter.get("/:id", verifyToken, async (req: UserData, res) => {
  const getCardsByBoxNumber = await Card.findOne({
    box_number: Number(req.params.id),
    userId: req.user._id,
  });
  if (!getCardsByBoxNumber) {
    res.status(404).send({ message: "data not found" });
  }
  res.send(getCardsByBoxNumber);
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

cardRouter.put("/:id", verifyToken, async (req: UserData, res) => {
  // cardValidation(req, res);

  if (!req.query.success) {
    return res.status(400).send({ message: "success query params not found" });
  }
  const card = await Card.findById(req.params.id);
  if (!card) {
    return res.status(404).send({ message: "card not found" });
  }

  if (card.box_number < 6) {
    try {
      const newCard = new Card({
        front: card.front,
        back: card.back,
        userId: req.user._id,
        box_number:
          req.query.success === "1" ? card.box_number + 1 : card.box_number,
      });
      await card.remove();
      await newCard.save();
      res.send({ message: "The operation was carried out successfully" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
      throw error;
    }
  }
});
