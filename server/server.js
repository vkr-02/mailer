const EmailTemplate = require("./models/EmailTemplate");
const nodemailer = require("nodemailer");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(cors());
app.use(express.json());

const PORT = 5000;

app.get('/', (req, res) => {
    res.send("Backend server is running");
});

app.post("/api/send-email", async (req, res) =>{
    const userEmail = "valaree1cbd7a@kg.nexushint.com";
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


app.post("/api/test-order-confirmation", async (req, res) => {
    try {
        const {
            customerEmail,
            customerName,
            orderNumber,
            orderTotal,
            orderUrl
        } = req.body;

        if (
            !customerEmail ||
            !customerName ||
            !orderNumber ||
            orderTotal === undefined ||
            !orderUrl
        ) {
            return res.status(400).json({
                message: "All order details are required"
            });
        }

        const template = await EmailTemplate.findOne({
            trigger: "order_placed"
        });

        if (!template) {
            return res.status(404).json({
                message: "Order confirmation template not found"
            });
        }

        const replacements = {
            customerName,
            orderNumber,
            orderTotal: String(orderTotal),
            orderUrl
        };

        const replaceVariables = (content) =>
            content.replace(
                /\{\{(customerName|orderNumber|orderTotal|orderUrl)\}\}/g,
                (_, key) => replacements[key]
            );

        const html = replaceVariables(template.html);
        const subject = replaceVariables(template.subject);

        const result = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: customerEmail,
            subject,
            html
        });

        res.json({
            message: "Order confirmation email sent",
            messageId: result.messageId
        });
    } catch (error) {
        console.error("Order email error:", error.message);

        res.status(500).json({
            message: "Failed to send order confirmation email"
        });
    }
});



async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "react_mailer"
        });

        console.log("MongoDB Atlas connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}


app.post("/api/templates", async (req, res) => {
    try {
        const {
            title,
            trigger,
            subject,
            heading,
            bodyText,
            buttonText,
            buttonColor
        } = req.body;

        if (
            !title ||
            !trigger ||
            !subject ||
            !heading ||
            !bodyText ||
            !buttonText ||
            !buttonColor
        ) {
            return res.status(400).json({
                message: "All template fields are required"
            });
        }

        const html = `
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; color: #0f172a;">
                <h2>${heading}</h2>
                <p>${bodyText}</p>
                <p>Order number: {{orderNumber}}</p>
                <p>Order total: ₹{{orderTotal}}</p>
                <a href="{{orderUrl}}"
                   style="display: inline-block; padding: 12px 18px;
                          background-color: ${buttonColor};
                          color: #ffffff; text-decoration: none;
                          border-radius: 6px;">
                    ${buttonText}
                </a>
            </body>
            </html>
        `;

        const template = await EmailTemplate.findOneAndUpdate(
            { trigger },
            {
                title,
                trigger,
                subject,
                heading,
                bodyText,
                buttonText,
                buttonColor,
                html
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        res.status(200).json({
            message: "Template saved successfully",
            template
        });
    } catch (error) {
        console.error("Error saving template:", error.message);

        res.status(500).json({
            message: "Failed to save template"
        });
    }
});


startServer();


