import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
      select: false,
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    }]
}, {timestamps: true})

export default mongoose.model("User", userSchema);