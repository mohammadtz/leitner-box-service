import { Document, model, Schema, SchemaOptions, SchemaType } from "mongoose";

export interface IUser extends Document {
  user_name: string;
  email: string;
  password: string;
  date?: string;
  mobile?: string;
}

const UserSchema: Schema<IUser> = new Schema({
  user_name: {
    type: String,
    required: true,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  mobile: {
    type: String,
    required: false,
    max: 13,
    min: 10,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default model<IUser>("User", UserSchema);
