import { Router } from "express";
import {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller";

const router = Router();


router.post("/", createOrder);


router.get("/user/:userId", getOrdersByUser);


router.get("/", getAllOrders);


router.patch("/:id", updateOrderStatus);

export default router;
