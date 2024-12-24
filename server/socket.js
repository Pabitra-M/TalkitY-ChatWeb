import { Server as SocketIoServer } from "socket.io"
import Messages from "./models/MessagesModel.js";
import Channel from "./models/ChannelModel.js";

const setupSocket = (server) => {
    const io = new SocketIoServer(server, {
        cors: {
            origin: [process.env.ORIGIN],
            methods: ["GET","POST", "PUT", "PATCH", "DELETE"],
            credentials: true,
        }
    })
    const useSocketMap = new Map();
    const disconnect = (socket) => {
        console.log(`user disconnected ${socket.id}`);
        for( const [userId, socketId] of useSocketMap.entries()) {
            if(socketId === socket.id){
                useSocketMap.delete(userId);
                break;
            }
        }
        
    }

    const sendMessage = async(message) => {
        const senderSockeatId = useSocketMap.get(message.sender);
        const recipientSocketId = useSocketMap.get(message.recipient);

        const createdMessage = await Messages.create(message);

        const messageData = await Messages.findById(createdMessage._id).populate("sender", "id email firstName lastName image, color").populate("recipient", "id email firstName lastName image, color");
        if(recipientSocketId){
            io.to(recipientSocketId).emit("reciveMessage", messageData);
        }
        if(senderSockeatId){
            io.to(senderSockeatId).emit("reciveMessage", messageData);
        }
       
    }



    const sendChannelMessage = async (message) => {
        const { channelId, sender, content, fileUrl, massageType } = message;
    
        try {
            const createdMessage = await Messages.create({
                sender,
                recipient: null,
                content,
                fileUrl,
                massageType,
                timestamp: Date.now(),
            });
    
            const messageData = await Messages.findById(createdMessage._id)
                .populate("sender", "id email firstName lastName image color")
                .exec();
    
            await Channel.findByIdAndUpdate(channelId, {
                $push: { messages: createdMessage._id },
            });
    
            const channal = await Channel.findById(channelId)
                .populate("members")
                .populate("admin")
                .exec();
    
            if (!channal) {
                console.error("Channel not found for ID:", channelId);
                return;
            }
    
            const fromData = { ...messageData._doc, channelId: channal._id };
    
            // Send message to all members
            if (channal.members) {
                channal.members.forEach((member) => {
                    const memberSocketId = useSocketMap.get(member._id.toString());
                    if (memberSocketId) {
                        io.to(memberSocketId).emit("recive-channel-message", fromData);
                    }
                });
            }
    
            // Send message to all admins
            if (channal.admin && Array.isArray(channal.admin)) {
                channal.admin.forEach((admin) => {
                    const adminSocketId = useSocketMap.get(admin._id.toString());
                    if (adminSocketId) {
                        io.to(adminSocketId).emit("recive-channel-message", fromData);
                    }
                });
            } else {
                console.error("Channel admin is undefined for channel:", channelId);
            }
    
        } catch (error) {
            console.error("Error in sendChannelMessage:", error);
        }
    };
    

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if(userId){
            useSocketMap.set(userId, socket.id);
            console.log(`user connected ${userId} with socket id ${socket.id}`);
            
        }
        else{
            console.log("user not found");
            
        }
        socket.on("sendMessage", sendMessage)
        socket.on("send-channel-message", sendChannelMessage)
        socket.on("disconnect", () => disconnect(socket))
    })

}

export default setupSocket