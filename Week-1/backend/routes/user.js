import express from "express";
import { registerUser, loginUser, verifyEmail, forgotPassword, resetPassword, updateProfile, ownProfile } from "../controller/auth.js";
import { authorizeUser } from "../middleware/authorization.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/update-profile",authorizeUser, updateProfile);
router.get("/me",authorizeUser, ownProfile)


export default router;