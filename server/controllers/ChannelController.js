import Channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";
import mongoose from "mongoose";

export const CreateChanal = async (req, response, next) => {
    try{
        const {name, members} = req.body;
        const userId = req.userId;
        const admin = await User.findById(userId);
        if(!admin){
            return response.status(404).send("User not found");
        }
        const validMembers = await User.find({ _id: { $in: members } });
        if (validMembers.length !== members.length) {
            return response.status(400).send("Invalid members");
        }


        
        
        const newChannel = new Channel({
            name,
            members,
            admin: userId,
        });

        await newChannel.save();


        return response.status(201).json({Channel : newChannel});
    } catch (error) {
        console.log(error);
        return response.status(500).send("Enternal server error!!");
    }
}



export const getUserChannels = async (req, response, next) => {
    try{
        
        const userId = new mongoose.Types.ObjectId(req.userId);
        const channels = await Channel.find({ $or: [{ admin: userId }, { members: userId }] }).sort({ updateAt: -1 });
        


        return response.status(200).json({channels});
    } catch (error) {
        console.log(error);
        return response.status(500).send("Enternal server error!!");
    }
}