import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true },
    username: { type: String, trim: true, unique: true, sparse: true },
    email: { type: String, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
