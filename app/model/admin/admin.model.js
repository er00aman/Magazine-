import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            default: null,
        },
        email: {
            type: String,
            unique: true, // Ensures no duplicate emails are allowed
            required: true, // Makes the email field mandatory
        },
        countryCode: {
            type: String,
            default: null,
        },
        phoneNumber: {
            type: String,
            default: null,
        },
        address: {
            type: String,
            default: null,
        },
        password: {
            type: String,
            default: null,
        },
        otp: {
            type: Number,
            default: 1234,
        },
        resetOTP: {  // New field to store OTP for password reset
            type: String,  // Can store OTP as string (6 digit OTP)
            default: null,
        },
        role: {
            type: Number,
            default: 0, // 0 for Admin, 1 for subAdmin
        },
        deviceToken: {
            type: String,
            default: null,
        },
        accessToken: {
            type: String,
            default: null,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Number,
            default: new Date().getTime(),
        },
        updatedAt: {
            type: Date,
            default: new Date().getTime(),
        },
        lastLogin: {
            type: Date,
            default: new Date().getTime(),
        },
    },
    {
        strict: true,
        collection: "Admin",
        versionKey: false,
    }
);

const AdminModel = mongoose.model("Admin", adminSchema);
export default AdminModel;
