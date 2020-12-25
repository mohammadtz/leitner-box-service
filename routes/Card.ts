import { Router } from "express";
import { Types } from "mongoose";
import { UserData } from "..";
import Card from "../models/Card";
import ViewHistory from "../models/ViewHistory";
import { cardValidation } from "../validation";
import { verifyToken } from "./verifyToken";

export const cardRouter = Router();

//get /api/cards
cardRouter.get("/", verifyToken, async (req: UserData, res) => {
  const getCardsByUserId = await Card.find({
    userId: Types.ObjectId(req.user._id),
  });
  if (!getCardsByUserId) {
    return res.status(404).send({ message: "داده یافت نشد" });
  }
  return res.send(getCardsByUserId);
});

cardRouter.get("/history", verifyToken, async (req: UserData, res) => {
  const getCardsByUserId = await Card.find({
    userId: Types.ObjectId(req.user._id),
    box_number: 6,
  });
  if (!getCardsByUserId) {
    return res.status(404).send({ message: "داده یافت نشد" });
  }
  return res.send(getCardsByUserId);
});

cardRouter.get("/count", verifyToken, async (req: UserData, res) => {
  const result = await getCount(req.user._id);
  res.send(result);
});

cardRouter.get("/grouping", (req, res) => {
  Grouping(req.query.groupby).then((result) => res.send(result));
});

cardRouter.get("/:id", verifyToken, async (req: UserData, res) => {
  const getCardByBoxNumber = await Card.findOne({
    box_number: Number(req.params.id),
    userId: Types.ObjectId(req.user._id),
  });
  if (!getCardByBoxNumber) {
    return res.status(404).send({ message: "داده یافت نشد" });
  }
  return res.send(getCardByBoxNumber);
});

async function Grouping(groupby) {
  const grouping = await Card.aggregate([
    {
      $group: {
        _id: `$${groupby}`,
        entries: {
          $push: {
            userId: "$userId",
            front: "$front",
            back: "$back",
            box_number: "$box_number",
            date: "$date",
          },
        },
      },
    },
  ]);
  return grouping;
}

cardRouter.post("/", verifyToken, async (req: UserData, res) => {
  cardValidation(req, res);
  const card = new Card({
    uniqueId: Math.random().toString(12).substr(2, 24),
    front: req.body.front,
    back: req.body.back,
    userId: Types.ObjectId(req.user._id),
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
  const card = await Card.findById(req.params.id);
  const back = card.back.split(",");

  if (!card) {
    return res.status(404).send({ message: "کارت یافت نشد" });
  }

  if (card.box_number < 7) {
    try {
      const boxNumberRender = () => {
        return card.box_number === 6
          ? 1
          : back.includes(req.query.answer.toString())
          ? card.box_number + 1
          : 1;
      };

      const newCard = new Card({
        uniqueId: card.uniqueId,
        front: card.front,
        back: card.back,
        userId: Types.ObjectId(req.user._id),
        box_number: boxNumberRender(),
      });

      await card.remove();
      await newCard.save();
      if (req.query.answer) {
        if (back.includes(req.query.answer.toString())) {
          const history = new ViewHistory({
            CardREF: newCard.uniqueId,
            status: 1 /* 1- correct  2- incorrect */,
            userId: Types.ObjectId(req.user._id),
            box_number: card.box_number,
          });
          history.save();
          return res.send({
            code: 1,
            message: "جواب وارد شده صیح است",
          });
        }
        const history = new ViewHistory({
          CardREF: newCard.uniqueId,
          status: 2 /* 1- correct  2- incorrect */,
          userId: Types.ObjectId(req.user._id),
          box_number: card.box_number,
        });
        history.save();
        return res.status(400).send({
          message: "جواب وارد شده اشتباه است",
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
  const history = await ViewHistory.find({ CardREF: req.params.id });

  if (!card) {
    return res.status(404).send("کارت یافت نشد");
  }
  try {
    await Card.deleteOne(card);
    await ViewHistory.deleteMany(history);
    return res.send({ message: "کارت با موفقیت حذف شد" });
  } catch (error) {
    return res.status(400).send(error);
  }
});

export async function getCount(useId) {
  const box1 = await Card.countDocuments({
    userId: Types.ObjectId(useId),
    box_number: 1,
  });
  const box2 = await Card.countDocuments({
    userId: Types.ObjectId(useId),
    box_number: 2,
  });
  const box3 = await Card.countDocuments({
    userId: Types.ObjectId(useId),
    box_number: 3,
  });
  const box4 = await Card.countDocuments({
    userId: Types.ObjectId(useId),
    box_number: 4,
  });
  const box5 = await Card.countDocuments({
    userId: Types.ObjectId(useId),
    box_number: 5,
  });
  return { box1, box2, box3, box4, box5 };
}
