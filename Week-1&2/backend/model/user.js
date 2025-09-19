import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  userType:{
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  verifyEmail:{
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    default: ""
  }
});

export const User = mongoose.model("User", userSchema);
