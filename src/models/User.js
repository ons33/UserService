import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    role: { type: String },
    interests: [String],
    hasRestaurantSubscription: { type: Boolean, default: false },
    email: { type: String, unique: true },
    phoneNumber: { type: String, unique: true },
    password: { type: String },
    blocked: { type: Boolean, default: false },

    verified: Boolean,
    resetToken: String,
    expireToken: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
