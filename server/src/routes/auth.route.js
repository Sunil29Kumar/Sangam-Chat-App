import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateInputs.js";
import { loginValidations, signupValidations } from "../validator/authSchema.js";
import { deleteAccount, login, logout, sendOTP, signup, verifyOTP } from "../controllers/auth.Controller.js";

const router = express.Router();

router.post("/send-otp", validate(signupValidations), sendOTP);
router.post("/verify-otp", verifyOTP);

router.post("/sign-up", validate(signupValidations), signup);
// otp
router.post("/login", validate(loginValidations), login);

router.post("/logout", checkAuth, logout);

router.delete("/delete",checkAuth,deleteAccount);

export default router;