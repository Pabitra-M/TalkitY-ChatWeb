import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routes/AuthRoute.js"
import contactRoute from "./routes/ContactRoute.js"
import setupSocket from "./socket.js"
import messageRoute from "./routes/messageRoutes.js"
import channelRoute from "./routes/ChannelRoutes.js"

dotenv.config()

const app = express();
const port = process.env.PORT || 3001;
const databaseURl = process.env.DATABASH_URL;

app.use(
    cors()
)

app.use("/uploads/profile", express.static('uploads/profile'))
app.use("/uploads/files", express.static('uploads/files'))

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth',authRoutes)
app.use('/api/contact',contactRoute)
app.use('/api/messages', messageRoute);
app.use('/api/channel', channelRoute)
const connect = async () => {
    try{
        await mongoose.connect(databaseURl);
        console.log('connected to mongo');
    }
    catch(err){
        console.log(err);
    }
}

const server = app.listen(port, ()=>{
    connect();
    console.log(`server is running on port no ${port}`);
    
})

setupSocket(server)

