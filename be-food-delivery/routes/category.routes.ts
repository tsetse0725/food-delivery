import { Router } from "express";
import { addCategory, getCategories } from "../controllers/category.controller";

const router = Router();

//  Route бүртгэгдсэн лог
console.log("🛣️ category.routes.ts → POST /categories, GET /categories");

//  POST /categories
router.post("/categories", addCategory);

//  GET /categories
router.get("/categories", getCategories);

export default router;
