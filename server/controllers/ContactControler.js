import Messages from "../models/MessagesModel.js";
import User from "../models/UserModel.js";
import mongoose from "mongoose";

export const searchContact = async (req, response, next) => {
    try {
        const { serchTerm } = req.body;
        
        
        if(serchTerm === undefined || serchTerm === null){
            return response.status(400).send("Serch Term is required");
        }
        const santizedSerchTerm = serchTerm.replace(/[.*+^%${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(santizedSerchTerm, "i");

        const contact = await User.find({
            $and:[
                { _id: { $ne: req.userId } },
                {
                    $or: [
                        { firstName: regex },
                        { lastName: regex },
                        { email: regex }
                    ],
                },
            ],
        })
        return response.status(200).json({contact});
    } catch (error) {
        return response.status(500).send("Enternal server error!!");
    }
}



export const getContactFromDmList = async (req, response, next) => {
    try {
       let { userId } = req;
       userId = new mongoose.Types.ObjectId(userId);

       const contacts = await Messages.aggregate([
        {
            $match: {
                $or: [{ sender: userId }, { recipient: userId }],
            },
        },
        {
            $sort: { timestamp: -1 },
        },
        {
            $group: {
                _id: {
                    $cond: {
                        if: { $eq: ["$sender", userId] },
                        then: "$recipient",
                        else: "$sender",
                    },
                },
                lastMessageTime: { $first: "$timestamp" },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "contactInfo",
            },
        },
        {
            $unwind: "$contactInfo",
        },
        {
            $project: {
                _id: 1,
                lastMessageTime: 1,
                firstName: "$contactInfo.firstName",
                lastName: "$contactInfo.lastName",
                email: "$contactInfo.email",
                image: "$contactInfo.image",
                color: "$contactInfo.color",
        
            },
        },
        {
            $sort: { lastMessageTime: -1 },
        },
       ])
        return response.status(200).json({contacts});
    } catch (error) {
        console.log(error);
        return response.status(500).send("Enternal server error!!");
        
        
    }
}






export const getAllContact = async (req, response, next) => {
    try {
       const users = await User.find({ _id: { $ne: req.userId } }, "_id firstName lastName email");
       const contacts = users.map((user) => ({ 
        lable: user.firstName ? `${user.firstName} ${user.lastName}`: user.email,
        value: user._id,
       }));
        return response.status(200).json({contacts});
    } catch (error) {
        return response.status(500).send("Enternal server error!!");
    }
}
