import User from "../models/user.model.js";
import Session from "../models/session.model.js";
    
export default async function checkAuth(req, res, next) {
    const { sid } = req?.signedCookies;


    if (!sid) {
        return res.status(401).json({ 
            success: false, 
            message: "Authentication required. Please log in." 
        });
    }

    try {
        const session = await Session.findOne({ sessionId: sid });
        
        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Session expired. Please log in again."
            });
        }

        const user = await User.findById(session.userId).lean();
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User account no longer exists."
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error); // Debugging ke liye zaroori hai
        return res.status(500).json({ 
            success: false, 
            message: "Something went wrong on our end." 
        });
    }
}