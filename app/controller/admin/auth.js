import HttpStatus from 'http-status-codes';
import * as commonService from '../../services/common.js';
import { genPassword, comparePass } from '../../utils/password.js';
import AdminModel from '../../model/admin/admin.model.js';
import { sendSuccessResponse, sendErrorResponse } from '../../responses/response.js';
import { successEn, errorEn } from '../../responses/message.js';
import { generateToken } from '../../utils/jwt.js';
import transporter from '../../services/nodemailer.js'; 

// Create Account Function
export const createAccount = async (req, res) => {
    try {
        let language = req.headers.language;
        if (language == undefined || language == '' || language == null) {
            language = 'en';
        }

        let { fullName, email, password, countryCode, phoneNumber, address, role, deviceToken } = req.body;

        if (!email || !password) {
            return sendErrorResponse(res, errorEn.INVALID_FIELD, HttpStatus.BAD_REQUEST);
        }

        const lowerCaseEmail = email.toLowerCase();

        const existingAdmin = await AdminModel.findOne({ email: lowerCaseEmail });
        if (existingAdmin) {
            return sendErrorResponse(res, errorEn.ALREADY_EXIST, HttpStatus.DEFAULT_ERROR);
        }

        password = await genPassword(password);

        let dataToSave = {
            fullName: fullName,
            email: lowerCaseEmail,
            password: password,
            countryCode: countryCode,
            phoneNumber: phoneNumber,
            address: address,
            role: role,
            deviceToken: deviceToken
        };

        const data = await commonService.create(AdminModel, dataToSave);
        if (data) {
            sendSuccessResponse(res, data, successEn.adminCreated, HttpStatus.OK);
        } else {
            sendErrorResponse(res, errorEn.DEFAULT_ERROR, HttpStatus.DEFAULT_ERROR);
        }
    } catch (error) {
        return sendErrorResponse(res, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};

// Login Function
export const login = async (req, res) => {
    try {
        let language = req.headers.language || 'en';

        const { email, password, deviceToken } = req.body;
        if (!email || !password) {
            return sendErrorResponse(res, errorEn.INVALID_FIELD, HttpStatus.BAD_REQUEST);
        }

        const adminData = await commonService.getByCondition(AdminModel, { email });
        if (!adminData || adminData.length === 0) {
            return sendErrorResponse(res, errorEn.ADMIN_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const admin = adminData[0];

        console.log("Admin data fetched from DB:", admin);
        console.log("Plain password:", password);
        console.log("Hashed password from DB:", admin.password);

        const checkPassword = await comparePass(password, admin.password);
        if (!checkPassword) {
            return sendErrorResponse(res, errorEn.PASS_NOT_MATCHED, HttpStatus.NOT_FOUND);
        }

        const tokenResponse = generateToken({ email: admin.email, _id: admin._id }, "24h");
        if (tokenResponse.status === 0) {
            return sendErrorResponse(res, tokenResponse.error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const token = tokenResponse.token;

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            maxAge: 24 * 60 * 60 * 1000, 
        });

        const saveData = {
            accessToken: token,
            lastLogin: new Date().getTime(),
            deviceToken,
        };

        const update = await commonService.findOneAndUpdate(AdminModel, admin._id, saveData, { new: true });
        if (!update) {
            return sendErrorResponse(
                res,
                language === "ar" ? errorAR.unableToLogin : errorEn.unableToLogin,
                HttpStatus.NOT_FOUND
            );
        }

        const result = {
            fullName: update.fullName,
            email: update.email,
            accessToken: token, 
            lastLogin: update.lastLogin,
            deviceToken: update.deviceToken,
            createdAt: update.createdAt,
            updatedAt: update.updatedAt,
        };

        return sendSuccessResponse(res, result, successEn.adminLoginSuccess, HttpStatus.OK);
    } catch (error) {
        console.error("Login error:", error.message);
        return sendErrorResponse(res, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};



// Forget Password Function
export const forgetPassword = async (req, res) => {
    try {
        let language = req.headers.language;
        if (language == undefined || language == '' || language == null) {
            language = 'en';
        }
        
        const { email } = req.body;
        if(!email){
            sendErrorResponse(res,errorEn.INVALID_FIELD,HttpStatus.BAD_REQUEST)
        }
        
        const checkAdminEmail = await AdminModel.findOne({ email: email });  
        
        if (!checkAdminEmail) {
            return sendErrorResponse(res, errorEn.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        checkAdminEmail.resetOTP = otp;
        
        await checkAdminEmail.save();

        const mailOptions = {
            from: process.env.EMAIL,
            to: checkAdminEmail.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return sendErrorResponse(res, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                return sendSuccessResponse(res, { otpSent: true }, successEn.OTP_SENT, HttpStatus.OK);
            }
        });
    } catch (error) {
        return sendErrorResponse(res, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};

// Reset Password Function
export const resetPassword = async (req, res) => {
    try {
        let language = req.headers.language;
        if (language == undefined || language == '' || language == null) {
            language = 'en';
        }

        const { email, otp, newPassword } = req.body;
        if(!email || !otp || !newPassword){
            sendErrorResponse(res, errorEn.INVALID_FIELD, HttpStatus.BAD_REQUEST)
        }

        console.log(req.body);

        const checkAdminEmail = await AdminModel.findOne({ email: email });
        
        if (!checkAdminEmail) {
            return sendErrorResponse(res, errorEn.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        if (checkAdminEmail.resetOTP !== otp) {
            return sendErrorResponse(res, errorEn.INVALID_OTP, HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await genPassword(newPassword);

        checkAdminEmail.password = hashedPassword;
        checkAdminEmail.resetOTP = undefined;  
        await checkAdminEmail.save();

        console.log("Password Reset Success Data:", checkAdminEmail.email); 

        const responseData = {
            email: checkAdminEmail.email,
            message: successEn.PASSWORD_RESET
        };

        console.log("Response Data:", responseData); 

        return sendSuccessResponse(res, responseData, successEn.PASSWORD_RESET, HttpStatus.OK);

    } catch (error) {
        return sendErrorResponse(res, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
