import express, { request, Request, response, Response } from "express";
import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";

const databaseConnect = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://tse9406:PcFZu9ZgVWibinOs@fooddelivery.hxrouha.mongodb.net/foodDelivery`
    );
    console.log("Successfully db connected");
  } catch (err) {
    console.log(err);
  }
};

const Users = new Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },

  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },
});

const UserModel = model("Users", Users);

const app = express();
app.use(express.json());
app.use(cors());

databaseConnect();

app.get("/", async (request: Request, response: Response) => {
  response.send("Hello world");
});

app.post("/signup", async (request: Request, response: Response) => {
  const { email, password } = request.body;
  const isEmailExisted = await UserModel.findOne({ email });

  if (!isEmailExisted) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    await UserModel.create({ email, password: hashedPassword });
    response.send({ message: "Successfully registered" });
    return;
  }
  response.status(400).send({ message: "User already existed" });
});

app.post("/login", async (request: Request, response: Response) => {
  const { email, password } = request.body;
  const isEmailExisted = await UserModel.findOne({ email });

  if (!isEmailExisted) {
    response.status(400).send({ message: "User doesn't existed" });
    return;
  } else {
    const hashedPassword = await bcrypt.compareSync(
      password,
      isEmailExisted.password!
    );

    if (hashedPassword) {
      response.send({ message: "Successfully logged in" });
    } else {
      response.send({ message: "Wrong password, try again" });
      return;
    }
  }
});

app.listen(8000, () => {
  console.log(`running on http://localhost:8000`);
});
