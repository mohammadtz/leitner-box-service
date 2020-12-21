import { Document, model, Schema } from "mongoose";

export interface ICard extends Document {
  front: string;
  back: string;
  date: Date;
  userId: string;
  box_number: number;
}

const Card = new Schema<ICard>({
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
    type: String,
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
