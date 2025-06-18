import { Router } from "express";
import { getAllFoods, addNewFood } from "../controllers/food.controller";

const router = Router();

router.get("/foods", getAllFoods);
router.post("/foods", addNewFood);

export default router;
