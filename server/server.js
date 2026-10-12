const nodemailer = require("nodemailer");
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
    res.send("Backend server is running");
});

app.post("/api/send-email", async (req, res) =>{
    const userEmail = "hosbein1b85f4@cc.nexushint.com";
    const subject = "Subject test";
    const text = "This is a test email from my React mailer project.";

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: subject,
        text: text,
    };

    try {
        const msg = await transporter.sendMail(mailOptions);
        res.json({
            message: "Email sent successfully",
            messageId: msg.messageId
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Failed to send email"
        });
    };
});

const transporter = nodemailer.createTransport({
  service: "Gmail", // Use any Service ID from the table below (matching is case-insensitive)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});

