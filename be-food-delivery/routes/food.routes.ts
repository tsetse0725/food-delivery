import { Router } from "express";
import { getAllFoods, addNewFood } from "../controllers/food/food.controller";
import { getGroupedFoodsByCategory } from "../controllers/food/getGroupedFoodsByCategory";

const router = Router();

router.route("/")
  .get(getAllFoods)
  .post(addNewFood);


router.get("/grouped", getGroupedFoodsByCategory);

export default router;
