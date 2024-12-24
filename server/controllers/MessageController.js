import Messages from "../models/MessagesModel.js";
import User from "../models/UserModel.js";
import { unlinkSync, mkdirSync, renameSync } from "fs";
export const getMessaged = async (req, response, next) => {
    try {
        const user1 = req.userId;
        const user2 = req.body.id;
        
        
        if(!user1 || !user2){
            return response.status(400).send("Serch Term is required");
        }



     

        const messages = await Messages.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 },
            ]
        }).sort({ timestamp: 1 });



        return response.status(200).json({messages});
    } catch (error) {
        return response.status(500).send("Enternal server error!!");
    }
}





export const uplodeFile = async (req, response, next) => {
    try {
       if(!req.file){
           return response.status(400).send("File is required");
       }
       const date = Date.now();
       let fileDir = `uploads/files/${date}`;
       let filename = `${fileDir}/${req.file.originalname}`;
       mkdirSync(fileDir, { recursive: true });
       renameSync(req.file.path, filename);
        return response.status(200).json({ filePath : filename });
    } catch (error) {
        return response.status(500).send("Enternal server error!!");
    }
}