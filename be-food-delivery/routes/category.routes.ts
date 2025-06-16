import { Router } from "express";
import { addCategory, getCategories } from "../controllers/category.controller";

const router = Router();

console.log("🛣️ category.routes.ts → POST /categories, GET /categories");

router.post("/categories", addCategory);
router.get("/categories", getCategories);

export default router;
