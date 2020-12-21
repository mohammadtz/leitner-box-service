import { model, Schema, Document } from "mongoose";
import { ICard } from "./Card";

export interface IViewHistory extends Document {
  CardREF: ICard["_id"];
  ViewDate: Date;
}

const ViewHistory = new Schema<IViewHistory>({
  CardREF: { type: Schema.Types.ObjectId, required: true },
  ViewDate: { type: Date, default: Date.now(), required: true },
});

export default model<IViewHistory>("ViewHistory", ViewHistory);
