import { Router } from "express";
import { varifyToken } from "../middlewares/Authmiddleware.js";
import { getMessaged, uplodeFile } from "../controllers/MessageController.js";
import multer from "multer";

const messageRoute = Router();
const uplode = multer({dest: "uploads/files"});

messageRoute.post("/get-message", varifyToken, getMessaged);
messageRoute.post("/uplode-file", varifyToken, uplode.single("file"), uplodeFile);

export default messageRoute;