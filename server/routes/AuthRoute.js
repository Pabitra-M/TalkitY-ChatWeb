import { Router } from "express";
import { addProfileImage, deleteProfileImage, getUserInfo, login, logout, signup, updateProfile } from "../controllers/AuthController.js";
import { varifyToken } from "../middlewares/Authmiddleware.js";
import multer from "multer";
const uplode = multer({dest: "uploads/profile"});
const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", varifyToken, getUserInfo);
authRoutes.post("/update-profile", varifyToken, updateProfile);
authRoutes.post("/add-profile-image", varifyToken, uplode.single("Profile-image"), addProfileImage);
authRoutes.delete("/delete-profile-image", varifyToken, deleteProfileImage);
authRoutes.post("/logout", logout);
export default authRoutes;