import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status-codes';
import dotenv from 'dotenv';
import AdminModel from '../model/admin/admin.model.js';
import { sendSuccessResponse, sendErrorResponse } from '../../app/responses/response.js';
import { successEn, errorEn } from '../../app/responses/message.js';

dotenv.config();
export const verifyAdminToken = async (req, res, next) => {
    try {
      const accessToken = req.cookies?.accessToken || req.headers.accesstoken;
  
    //   console.log("Cookies Received:", req.cookies);
    //   console.log("Headers Received:", req.headers);
  
      if (!accessToken) {
        return sendErrorResponse(res, errorEn.NO_TOKEN, HttpStatus.FORBIDDEN);
      }
  
      jwt.verify(accessToken, process.env.SECRET_KEY, async (err, decoded) => {
        if (err) {
          console.log("JWT Error:", err);
          return sendErrorResponse(res, errorEn.TOKEN_EXPIRED, HttpStatus.FORBIDDEN);
        }
  
        // console.log("Decoded Token:", decoded);
  
        const admin = await AdminModel.findOne({ _id: decoded._id });
        // console.log("Database Admin Result:", admin);
  
        if (!admin) {
          return sendErrorResponse(res, errorEn.LOGGED_OUT, HttpStatus.FORBIDDEN);
        }
  
        req.adminData = { ...admin._doc };
  
        next();
      });
    } catch (error) {
      console.error("Error in verifyAdminToken:", error);
      return sendErrorResponse(res, errorEn.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
  
// Function to generate a token
export const generateToken = (adminId) => {
  try {
    const token = jwt.sign(
      { id: adminId, access: "access-token" },
      process.env.SECRET_KEY,
      { expiresIn: "2 days" }
    );
    return token;
  } catch (error) {
    throw new Error("Error generating token");
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    let { language } = req.headers;
    if (!language) {
      language = 'en';
    }

    const { email, otp } = req.body;

    const admin = await AdminModel.findOne({ email });

    if (!admin) {
      return sendErrorResponse(
        res,
        errorEn.NOT_FOUND || "Admin not found",
        HttpStatus.NOT_FOUND
      );
    }

    if (admin.resetOTP !== otp) {
      return sendErrorResponse(
        res,
        errorEn.INVALID_OTP || "Invalid OTP",
        HttpStatus.BAD_REQUEST
      );
    }

    next();
  } catch (error) {
    return sendErrorResponse(res, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
