import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    gmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    apiKey: { type: String, required: true, unique: true },
    lastUsed: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);
