import { Router } from "express";
import { getAllFoods, addNewFood } from "../controllers/food/food.controller";
import { getGroupedFoodsByCategory } from "../controllers/food/getGroupedFoodsByCategory";

const router = Router();

router.get("/foods", getAllFoods);
router.post("/foods", addNewFood);
router.get("/foods/grouped", getGroupedFoodsByCategory)

export default router;
