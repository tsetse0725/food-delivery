import { Router } from "express";

// 🧩 Controllers
import { signupController } from "../controllers/auth/signup.controller";
import { loginController } from "../controllers/auth/login.controller";
import { forgotPasswordController } from "../controllers/auth/forgotPassword";
import { verifyOtpController } from "../controllers/auth/verifyOtp.controller";
import { resetPasswordController } from "../controllers/auth/resetPassword.controller";
import { verifyTokenController } from "../controllers/auth/verifyToken.controller";

const router = Router();

// 👤 Signup/Login
router.post("/signup", signupController);
router.post("/login", loginController);

// 🔐 Password recovery
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-otp", verifyOtpController);
router.post("/reset-password/:token", resetPasswordController);

// ✅ Token validation
router.post("/verify", verifyTokenController);

export default router;
