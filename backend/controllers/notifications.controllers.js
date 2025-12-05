import User from "../models/user.model.js";

export const getNotifications = async (req, res) => {
    try{
        if(!req.userId) return res.status(401).json({success: false, message: "Unauthorized"});
        const user = await User.findById(req.userId).populate("notifications");
        if(!user) return res.status(404).json({success: false, message: "User not found"});
        res.status(200).json({success: true, notifications: user.notifications || "No notifications"});

    }catch(error){
        console.log(error);
        res.status(500).json({success: false, message: error.message});
    }
}