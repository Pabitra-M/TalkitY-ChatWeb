import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: false,
    },
    massageType: {
        type: String,
        enum: ["text", "file"],
        required: true,
    },
    content: {
        type: String,
        required: function(){
            return this.massageType === "text";
        },
    },
    fileUrl: {
        type: String,
        required: function(){
            return this.massageType === "file";
        },
    },
    timeStamp: {
        type: Date,
        default: Date.now,
    },
});

const Messages = mongoose.model("Messages", messageSchema);

export default Messages