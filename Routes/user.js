import express from "express";
import userController from "../Controllers/user.js";

const router = express.Router();

router.post("/send-otp", userController.sendOtp);
router.post("/verify-otp", userController.verifyOtp);

export default router;
