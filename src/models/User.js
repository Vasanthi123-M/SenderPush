
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
},{ timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
