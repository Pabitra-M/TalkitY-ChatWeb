import { Router } from "express";
import { varifyToken } from "../middlewares/Authmiddleware.js";
import { CreateChanal, getUserChannels } from "../controllers/ChannelController.js";

const channelRoute = Router();

channelRoute.post("/create-channel", varifyToken, CreateChanal);
channelRoute.get("/get-user-channels", varifyToken, getUserChannels);

export default channelRoute;
