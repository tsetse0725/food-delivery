import express, { Request, Response } from "express";
import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8000;
const MONGO_URI = "mongodb+srv://tse9406:PcFZu9ZgVWibinOs@fooddelivery.hxrouha.mongodb.net/foodDelivery";
const JWT_SECRET = "foodDelivery";

// ✅ Database connect
const databaseConnect = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Successfully connected to MongoDB");
  } catch (err) {
    console.log("❌ Database connection error:", err);
  }
};

databaseConnect();

// ✅ User Schema
const Users = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, immutable: true },
  updatedAt: { type: Date, default: Date.now },
});

const UserModel = model("Users", Users);

// ✅ Root route
app.get("/", async (request: Request, response: Response): Promise<void> => {
  response.send("Hello world");
});

// ✅ Signup route
app.post("/signup", async (request: Request, response: Response): Promise<void> => {
  const { email, password } = request.body;

  const isEmailExisted = await UserModel.findOne({ email });

  if (!isEmailExisted) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create({ email, password: hashedPassword });
     response.send({ message: "Successfully registered" });
  }

   response.status(400).send({ message: "User already existed" });
});

// ✅ Login route
app.post("/login", async (request: Request, response: Response): Promise<void> => {
  const { email, password } = request.body;

  const isEmailExisted = await UserModel.findOne({ email });

  if (!isEmailExisted) {
    response.status(400).send({ message: "User doesn't exist" });
    return;
  }

  const isMatch = await bcrypt.compare(password, isEmailExisted.password);

  if (!isMatch) {
    response.status(400).send({ message: "Wrong password" });
    return;
  }

  const token = jwt.sign({ userId: isEmailExisted._id }, JWT_SECRET);
  response.send({ message: "Successfully logged in", token });
});


// ✅ Token verify route
app.post("/verify", async (request: Request, response: Response): Promise<void> => {
  const { token } = request.body;

  try {
    const isValid = jwt.verify(token, JWT_SECRET);

    if (isValid) {
      const destructToken = jwt.decode(token);
       response.send({ destructToken });
    }

     response.status(401).send({ message: "Token is not valid" });
  } catch (err) {
     response.status(401).send({ message: "Token is not valid" });
  }
});

// ✅ Server start
app.listen(PORT, (): void => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
