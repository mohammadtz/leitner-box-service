import { Document, model, Schema } from "mongoose";
import { IUser } from "./User";

export interface ICard extends Document {
  uniqueId: string;
  front: string;
  back: string;
  date: Date;
  userId: IUser["_id"];
  box_number: number;
}

const Card = new Schema<ICard>({
  uniqueId: { type: Schema.Types.String, required: true },
  front: {
    type: String,
    required: true,
    maxlength: 255,
  },
  back: {
    type: String,
    required: true,
    maxlength: 255,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  box_number: {
    type: Number,
    required: true,
    max: 6,
    min: 1,
  },
});

export default model<ICard>("Card", Card);
