import { User } from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../logs/logger.js";
import  { sendVerificationEmail,sendPasswordResetEmail } from "../utils/verifyEmail.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    logger.info(`Register attempt for email: ${email}`);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Registration failed - User already exists: ${email}`);
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

     const token = jwt.sign(
      { userId: newUser._id, email },
      process.env.EMAIL_VERIFY_SECRET,
      { expiresIn: "1h" }
    );

    const verificationUrl = `${process.env.BACKEND_URL}/api/user/verify-email?token=${token}`;

    const response = await sendVerificationEmail(newUser, verificationUrl);
    console.log("Email send response:", response);

    logger.info(`✅ New user registered successfully: ${email}`);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    logger.error(`❌ Registration error for ${req.body.email || "unknown email"}: ${error.message}`, { stack: error.stack });
    return res
      .status(500)
      .json({ error: error.message || "Failed to register user" });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    logger.info(`Login attempt for email: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login failed - User not found: ${email}`);
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Login failed - Invalid password for user: ${email}`);
      return res.status(400).json({ message: "Invalid password" });
    }

    if (!user.verifyEmail) {
       const token = jwt.sign(
      { userId: user._id, email },
      process.env.EMAIL_VERIFY_SECRET,
      { expiresIn: "1h" }
    );

    const verificationUrl = `${process.env.BACKEND_URL}/api/user/verify-email?token=${token}`;

    const response = await sendVerificationEmail(user, verificationUrl);
      logger.warn(`Login failed - Email not verified for user: ${email}`);

      return res.status(400).json({ message: "Please verify your email to login , check your mail." });
    }

    const token = jwt.sign({ userId: user._id , userType: user.userType}, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    logger.info(`User logged in successfully: ${email}`);

    return res
      .status(200)
      .json({ token, message: "User logged in successfully" });
  } catch (error) {
    logger.error(` Login error for ${req.body.email || "unknown email"}: ${error.message}`, { stack: error.stack });
    return res
      .status(500)
      .json({ message: error.message || "Failed to login user" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const  token  = req.query.token;
    if (!token) {
      return res.status(400).json({ error: "Verification token is required" });
    }
    const decoded = jwt.verify(token, (process.env.EMAIL_VERIFY_SECRET).toString());
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ error: "Invalid token or user not found" });
    }
    if (user.verifyEmail) {
      return res.status(400).json({ message: "Email already verified" });
    }
    user.verifyEmail = true;
    await user.save();
     return res.redirect(`${process.env.FRONTEND_URL}/email-verified`);
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({ error: error.message || "Failed to verify email" });
  } 
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User with this email does not exist" });
    }
    const token = jwt.sign(
      { userId: user._id, email },
      process.env.PASSWORD_RESET_SECRET,
      { expiresIn: "1h" }
    );
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(user, resetUrl);
    return res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ error: error.message || "Failed to process forgot password" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password are required" });
    }
    const decoded = jwt.verify(token, process.env.PASSWORD_RESET_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ error: "Invalid token or user not found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ error: error.message || "Failed to reset password" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const profileImage = req.files.profileImage
    if (profileImage) {
      const user = await User.findById(userId);
      if (user.profileImage) {
        await deleteFromCloudinary(user.profileImage);
      }
      const profileImageUrl = await uploadToCloudinary(profileImage.tempFilePath);
      user.profileImage = profileImageUrl;
      await user.save();
      return res.status(200).json({ message: "Profile updated successfully" });
    }
    const { username, email } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (username) user.username = username;
    if (email) user.email = email;
    await user.save();
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ error: error.message || "Failed to update profile" });
  }
};

const ownProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Fetch profile error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch profile" });
  }
};



export { registerUser, loginUser , verifyEmail, forgotPassword, resetPassword , updateProfile , ownProfile};
