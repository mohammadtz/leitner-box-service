import { model, Schema, Document } from "mongoose";
import { ICard } from "./Card";
import { IUser } from "./User";

export interface IViewHistory extends Document {
  CardREF: ICard["_id"];
  ViewDate: Date;
  status: 1 | 2;
  box_number: ICard["box_number"];
  userId: IUser["_id"];
}

const ViewHistory = new Schema<IViewHistory>({
  CardREF: { type: Schema.Types.String, required: true },
  ViewDate: { type: Date, default: Date.now },
  status: { type: Schema.Types.Number, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  box_number: { type: Schema.Types.Number, required: true },
});

export default model<IViewHistory>("ViewHistory", ViewHistory);
