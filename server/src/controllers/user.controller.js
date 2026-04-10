import User from "../models/user.model.js";

export const user = async (req, res) => {
    const userId = req.user._id;

    try {
        const userDoc = await User.findById(userId);
        return res.status(200).json({ success: true, user: userDoc });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch user data" });
    }

}
