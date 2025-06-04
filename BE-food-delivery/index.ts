import express, { request, Request, Response } from "express";
import mongoose from "mongoose";
import { Schema, model } from "mongoose";

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

databaseConnect();

app.get("/users", async (_request: Request, response: Response) => {
  const users = await UserModel.find();
  response.send(users);
});

app.get("/user", async (_request: Request, response: Response) => {
  const user = await UserModel.findOne({ email: "tse9406@yahoo.com" });
  response.send(user);
});

app.put("/change", async (request: Request, response: Response) => {
  const { email, input } = request.body;
  const changeUser = await UserModel.findOneAndUpdate(
    { email },
    { email: input.email, password: input.password },
    { new: true }
  );
  response.send(changeUser);
});

app.post(`/adduser`, async (request: Request, response: Response) => {
  const { email, password } = request.body;
  const result = await UserModel.create({ email, password });
  response.send(result);
});

app.listen(8000, () => {
  console.log(`running on http://localhost:8000`);
});
