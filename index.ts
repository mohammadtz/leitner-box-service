import * as express from "express";
import { authRouter } from "./routes/auth";
import * as mongoose from "mongoose";
import * as dotenv from "dotenv";
import { cardRouter } from "./routes/Card";
import * as cors from "cors";

dotenv.config();

// global variables
const app = express();
const port = 4000;
const url = `http://localhost:${port}`;
const connectionSetting = { useUnifiedTopology: true, useNewUrlParser: true };

app.use(cors());

// database connection
mongoose.connect(process.env.DB_CONNECT, connectionSetting, (error) => {
  if (error) return console.log(error);
  console.log(`connect to DB`);
});

// middleware
app.use(express.json());

// route middlewares
app.use(`/api/user`, authRouter);
app.use(`/api/cards`, cardRouter);

// userType
export interface UserData extends express.Request {
  user?: {
    _id: string;
  };
}

app.listen(port, () => console.log(`server is running on ${url}`));
