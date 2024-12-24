import { Router } from "express";
import { varifyToken } from "../middlewares/Authmiddleware.js";
import { getAllContact, getContactFromDmList, searchContact } from "../controllers/ContactControler.js";

const contactRoute = Router();


contactRoute.post("/search",varifyToken, searchContact)
contactRoute.get("/get-contacts-for-dm",varifyToken, getContactFromDmList)
contactRoute.get("/get-all-contacts",varifyToken, getAllContact)
export default contactRoute;