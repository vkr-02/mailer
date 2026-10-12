const mongoose = require("mongoose");

const emailTemplateSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
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