import fs from "fs";
import path from "path";
import sendEmail from "../config/nodemailer.js"; 

const templatePath = path.join(process.cwd(), "view", "verifyEmail.html");
const template = fs.readFileSync(templatePath, "utf-8");

const templatePasswordResetPath = path.join(process.cwd(), "view", "resetPassword.html");
const templatePasswordReset = fs.readFileSync(templatePasswordResetPath, "utf-8");

const sendVerificationEmail = async (user, verificationUrl) => {
  try {
    let html = template
      .replace(/{{name}}/g, user.username)
      .replace(/{{verificationUrl}}/g, verificationUrl)
      .replace(/{{expiryHours}}/g, "1") 
    await sendEmail(
      user.email,
      "Verify your email",
      `Hi ${user.username}, please verify your email: ${verificationUrl}`, 
      html
    );

    console.log("✅ Verification email sent to:", user.email);
  } catch (error) {
    console.error("❌ Failed to send verification email:", error);
  }
};

const sendPasswordResetEmail = async (user, resetUrl) => {
    try {
        let html = templatePasswordReset
            .replace(/{{email}}/g, user.username)
            .replace(/{{resetUrl}}/g, resetUrl)
            .replace(/{{expiryHours}}/g, "1");
        await sendEmail(
            user.email,
            "Reset your password",
            `Hi ${user.username}, please reset your password: ${resetUrl}`,
            html
        );
        console.log("✅ Password reset email sent to:", user.email);
    } catch (error) {
        console.error("❌ Failed to send password reset email:", error);
    }
};

export  {sendVerificationEmail, sendPasswordResetEmail };
