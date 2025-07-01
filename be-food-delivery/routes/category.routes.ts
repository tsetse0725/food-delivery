import { Router } from "express";
import { addCategory, getCategories } from "../controllers/category.controller";

const router = Router();


router.route("/")
  .post(addCategory)  
  .get(getCategories); 

export default router;
