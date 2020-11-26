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
  const getCardsByUserId = await Card.find({
    userId: req.user._id,
    box_number: 6,
  });
  if (!getCardsByUserId) {
    return res.status(404).send({ message: "data not found" });
  }
  return res.send(getCardsByUserId);
});

cardRouter.get("/count", verifyToken, async (req: UserData, res) => {
  const result = await getCount(req.user._id);
  res.send(result);
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
  const card = await Card.findById(req.params.id);

  if (!card) {
    return res.status(404).send({ message: "card not found" });
  }

  if (card.box_number < 7) {
    try {
      const boxNumberRender = () => {
        return card.box_number === 6
          ? 1
          : req.query.answer === card.back
          ? card.box_number + 1
          : 1;
      };

      const newCard = new Card({
        front: card.front,
        back: card.back,
        userId: req.user._id,
        box_number: boxNumberRender(),
      });

      await card.remove();
      await newCard.save();
      if (req.query.answer) {
        if (req.query.answer === card.back) {
          return res.send({
            code: 1,
            message: "the answer is correct",
          });
        }
        return res.status(400).send({
          message: "the answer incorrect",
          code: 2,
        });
      }
    } catch (error) {
      res.status(400).send(error);
      throw error;
    }
  }
});

cardRouter.delete("/:id", verifyToken, async (req: UserData, res) => {
  const card = await Card.findById(req.params.id);
  if (!card) {
    return res.status(404).send("card not found");
  }
  try {
    await Card.deleteOne(card);
  } catch (error) {}
});

export async function getCount(useId) {
  const box1 = await Card.countDocuments({
    userId: useId,
    box_number: 1,
  });
  const box2 = await Card.countDocuments({
    userId: useId,
    box_number: 2,
  });
  const box3 = await Card.countDocuments({
    userId: useId,
    box_number: 3,
  });
  const box4 = await Card.countDocuments({
    userId: useId,
    box_number: 4,
  });
  const box5 = await Card.countDocuments({
    userId: useId,
    box_number: 5,
  });
  return { box1, box2, box3, box4, box5 };
}
