import HttpStatus from 'http-status-codes';
import * as commonService from '../../services/common.js';
import { genPassword, comparePass } from '../../utils/password.js';
import UserModel from '../../model/user/user.model.js';
import { sendSuccessResponse, sendErrorResponse } from '../../responses/response.js';
import { successEn, errorEn } from '../../responses/message.js';
import { generateToken } from '../../utils/jwt.js';
import transporter from '../../services/nodemailer.js'; 


export const createAccount = async (req, res) => {
    try {
        let language = req.headers.language;
        if (language == undefined || language == '' || language == null) {
            language = 'en';
        }

        let { userName, email, password, countryCode, phoneNumber, deviceToken, location } = req.body;

        if (!email || !password) {
            return sendErrorResponse(res, errorEn.INVALID_FIELD, HttpStatus.INVALID_FIELD);
        }

        const lowerCaseEmail = email.toLowerCase();

        const existingUser = await UserModel.findOne({ email: lowerCaseEmail });
        if (existingUser) {
            return sendErrorResponse(res, errorEn.ALREADY_EXIST, HttpStatus.DEFAULT_ERROR);
        }

        password = await genPassword(password);

        let dataToSave = {
            userName:userName,
            email: lowerCaseEmail,
            password: password,
            countryCode: countryCode,
            phoneNumber: phoneNumber,
            deviceToken: deviceToken,
            location: location,  
            isProfileCompleted: false, 
            language: language
        };

        const data = await commonService.create(UserModel, dataToSave); 
        if (data) {
            sendSuccessResponse(res, data, successEn.USER_CREATED, HttpStatus.OK);
        } else {
            sendErrorResponse(res, errorEn.DEFAULT_ERROR, HttpStatus.NOT_FOUND);
        }
    } catch (error) {
        return sendErrorResponse(res, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};


export const getAll = async(req,res)=>{
    try{
        const data = await UserModel.find()
        if(data){
            return sendSuccessResponse(res,successEn.DETAILS_FETCH,HttpStatus.OK)
        }else{
            return sendErrorResponse(res,errorEn.NOT_FOUND,HttpStatus.NOT_FOUND)
        }
    }catch(error){
        console.log(error.message)
        return sendErrorResponse(res, error.message,HttpStatus.DEFAULT_ERROR)
    }
}