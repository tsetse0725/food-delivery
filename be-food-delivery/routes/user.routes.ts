
import express from "express";
import { updateUserAddress } from "../controllers/user.controller";

const router = express.Router();

router.patch("/:userId", updateUserAddress);

export default router;
