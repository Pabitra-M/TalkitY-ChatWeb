import mongoose from "mongoose";

const channelSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    members: [{type:mongoose.Schema.Types.ObjectId,ref: "Users", required: true}],
    admin: [{type:mongoose.Schema.Types.ObjectId,ref: "Users", required: true}],
    messages:[{type:mongoose.Schema.Types.ObjectId,ref: "Messages", required: false}],
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now},

   
    });

    channelSchema.pre("save", function(next) {
        this.updateAt = Date.now();
        next();
    })

    channelSchema.pre("findOneAndUpdate", function(next) {
        this.set({updateAt: Date.now()});
        next();
    })

    const Channel = mongoose.model("Channels", channelSchema);

    export default Channel;