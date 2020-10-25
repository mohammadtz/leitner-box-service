import { Router } from "express";
import { UserData } from "..";
import Card from "../models/Card";
import { cardValidation } from "../validation";
import { verifyToken } from "./verifyToken";

export const cardRouter = Router();

//get /api/cards
cardRouter.get("/", verifyToken, async (req: UserData, res) => {
  const getCardsByUserId = await Card.find({ userId: req.user._id });
  if (!getCardsByUserId) {
    return res.status(404).send({ message: "data not found" });
  }
  return res.send(getCardsByUserId);
});

cardRouter.get("/history", verifyToken, async (req: UserData, res) => {
  const getCardsByUserId = await Card.find({ userId: req.user._id, box_number: 6 });
  if (!getCardsByUserId) {
    return res.status(404).send({ message: "data not found" });
  }
  return res.send(getCardsByUserId);
});

cardRouter.get("/count", verifyToken, async (req: UserData, res) => {
  await getCount(req, res);
});

cardRouter.get("/:id", verifyToken, async (req: UserData, res) => {
  const getCardByBoxNumber = await Card.findOne({
    box_number: Number(req.params.id),
    userId: req.user._id,
  });
  if (!getCardByBoxNumber) {
    return res.status(404).send({ message: "data not found" });
  }
  return res.send(getCardByBoxNumber);
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
    return res.send(savedCard);
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

  if (card.box_number < 7) {
    try {
      const newCard = new Card({
        front: card.front,
        back: card.back,
        userId: req.user._id,
        box_number:
          req.query.success === "1" ? card.box_number + 1 : req.query.success === "3" ? 1 : card.box_number,
      });
      await card.remove();
      await newCard.save();
      return res.send({ message: "The operation was carried out successfully" });
    } catch (error) {
      res.status(400).send(error);
      throw error;
    }
  }
});

async function getCount(req: UserData, res) {
  const box1 = await Card.countDocuments(
    { userId: req.user._id, box_number: 1 },
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
  return res.send({ box1, box2, box3, box4, box5 });
}

