import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", 
  port: 465, 
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});


const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `<${process.env.EMAIL_USER}>`,
      to, 
      subject,
      text, 
      html,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


export default sendEmail;


