import { Router } from "express";
import {
  getAllFoods,
  addNewFood,
  getFoodById,
  updateFood,     // ⬅️ энэ нэрийг авсан
  deleteFood,     // ⬅️ энэ нэрийг авсан
} from "../controllers/food/food.controller";

import { getGroupedFoodsByCategory } from "../controllers/food/getGroupedFoodsByCategory";
import upload from "../middlewares/multer";

const router = Router();

router.get("/", getAllFoods);
router.post("/", upload.single("image"), addNewFood);
router.get("/grouped", getGroupedFoodsByCategory);
router.get("/:id", getFoodById);

// ✅ Шинэчлэлт болон устгал
router.patch("/:id", upload.single("image"), updateFood);
router.delete("/:id", deleteFood);

export default router;
