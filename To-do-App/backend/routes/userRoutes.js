import express from "express";
import { google as googleLogin } from "../controllers/userController.js";


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

export default router;
