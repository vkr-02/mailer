
const mongoose = require("mongoose");

const emailTemplateSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        trigger: {
            type: String,
            required: true,
            enum: ["order_placed", "welcome", "password_reset"]
        },
        subject: {
            type: String,
            required: true
        },
        heading: {
            type: String,
            required: true
        },
        bodyText: {
            type: String,
            required: true
        },
        buttonText: {
            type: String,
            required: true
        },
        buttonColor: {
            type: String,
            required: true,
            match: /^#[0-9A-Fa-f]{6}$/
        },
        html: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("EmailTemplate", emailTemplateSchema);
