"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verification_token: {
        type: String,
        required: true,
    },
    verification_token_expiry: {
        type: Date,
        default: Date.now(),
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    updated_at: {
        type: Date,
        default: Date.now(),
    },
});
exports.default = (0, mongoose_1.model)("User", userSchema);
