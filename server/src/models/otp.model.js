import mongoose, { Schema } from "mongoose";

const OTPSchema = new Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 5 } // OTP expires after 5 minutes
});

const OTP = mongoose.model("OTP", OTPSchema);
export default OTP;