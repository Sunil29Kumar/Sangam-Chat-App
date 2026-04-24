import { sendMailEvent } from "../mail/mailEvents.js";
import OTP from "../models/otp.model.js";
import Session from "../models/session.model.js";
import User from "../models/user.model.js";
import crypto from "crypto";


export const sendOTP = async (req, res) => {
    console.log("send opt");

    try {
        const { email } = req.body;
        console.log(email);


        // check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "Email already registered. Please login." });
        }

        // generate OTP and save to DB
        const otp = Math.floor(Math.random() * 1000000).toString()

        await OTP.findOneAndUpdate(
            { email },
            { otp },
            { upsert: true, returnDocument: 'after' }
        );

        // send OTP to user's email (implementation not shown here)
        sendMailEvent({
            type: "SEND_OTP",
            user: email,
            meta: { otp }
        })


        return res.status(200).json({ success: true, message: `OTP sent to ${email}` });

    } catch (error) {
        console.error("Error during sending OTP:", error);
        return res.status(500).json({ success: false, error: "Server error during sending OTP" });
    }
}

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const record = await OTP.findOne({ email });
        if (!record) {
            return res.status(400).json({ success: false, error: "No OTP request found for this email" });
        }
        if (record.otp !== otp) {
            return res.status(400).json({ success: false, error: "Invalid OTP" });
        }
        // OTP is valid, delete the record
        await OTP.deleteOne({ email });

        return res.status(200).json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error during OTP verification:", error);
        return res.status(500).json({ success: false, error: "Server error during OTP verification" });
    }
}

export const signup = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "User already exists" });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();



        return res.status(201).json({ success: true, message: "Account created successfully!" });
    } catch (error) {

        console.error("Error during registration:", error);
        return res.status(500).json({ success: false, error: "Server error during registration" });
    }

}




export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, error: "User does not exist" });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, error: "Invalid password" });
        }

        // 2. Session Logic
        const sessionId = crypto.randomUUID();
        const duration = 1000 * 60 * 60 * 24 * 7; // 7 days in ms
        const expiresAt = new Date(Date.now() + duration); // CURRENT time + duration

        res.cookie("sid", sessionId, {
            httpOnly: true,
            signed: true,
            maxAge: duration,
            sameSite: "none",
            secure: true // abhi http hay is leya false  
        });

        // 3. Set session in DB
        const newSession = new Session({
            userId: user._id,
            sessionId: sessionId,
            expiresAt: expiresAt // Correct Future Date
        });
        await newSession.save();

        // 4. Update user timestamp
        await User.updateOne(
            { email },
            {
                $set: { loginWith: "email" },
                $push: { lastLoginAt: new Date() }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: { name: user.name, email: user.email } // User info bhej dein
        });

    } catch (error) {
        console.error("LOGIN ERROR DETAILS:", error); // <-- Ise terminal mein dekho
        return res.status(500).json({ success: false, error: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        const userId = req.user?._id;
        const sessionId = req.signedCookies.sid;

        if (!userId || !sessionId) {
            return res.status(400).json({ success: false, error: "No active session found" });
        }

        // 1. Delete session from DB first
        await Session.deleteOne({ userId, sessionId });

        // 2. Clear the cookie
        res.clearCookie("sid", {
            httpOnly: true,
            signed: true,
            sameSite: "none",
            secure: true
        });


        await User.findByIdAndUpdate(userId, {
            $push: { lastLogoutAt: new Date() }
        });

        return res.status(200).json({ success: true, message: "Logout successful" });

    } catch (error) {
        console.error("Logout Error:", error); // Terminal mein error check karne ke liye
        return res.status(500).json({ success: false, error: "Server error during logout" });
    }
}


export const deleteAccount = async (req,res)=>{
    try {
        const id = req.user._id;
        const user = await User.findById(id);
        if(!user){
            return res.status(400).json({success:false, message:"User not found"})
        }
    } catch (error) {
        return res.status(500).json({success:false , message:"Interval server error"})
    }
}