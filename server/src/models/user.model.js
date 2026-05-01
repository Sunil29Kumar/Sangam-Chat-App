import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    loginWith: { type: String, enum: ["email", "google", "facebook", "zoho", "phone"], default: "email" },
    lastLoginAt: [
        {
            type: Date,
            default: Date.now
        }
    ],
    lastLogoutAt: [
        {
            type: Date,
            default: Date.now
        }
    ]
}, { timestamps: true });


UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    // next();
});

// compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model('User', UserSchema);
export default User;