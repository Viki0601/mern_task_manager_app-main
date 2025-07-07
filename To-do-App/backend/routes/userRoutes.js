import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  google,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/signup").post(signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/google", google);
router.post("/forgot-password", forgotPassword); 
router.post("/reset-password", resetPassword); 
router.post("/google", googleLogin); // ✅ This handles POST /api/v1/user/google

export default router;
