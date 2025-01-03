import HttpStatus from 'http-status-codes';
import * as commonService from '../../services/common.js';
import { genPassword, comparePass } from '../../utils/password.js';
import UserModel from '../../model/user/user.model.js';
import { sendSuccessResponse, sendErrorResponse } from '../../responses/response.js';
import { successEn, errorEn } from '../../responses/message.js';


export const createUser = async (req, res) => {
    try {
      let language = req.headers.language;
      if (language == undefined || language == '' || language == null) {
        language = 'en';
      }
  
      let { userName, email, password, phoneNumber, deviceToken, longitude, latitude, createdAt, updatedAt } = req.body;
  
      if (!userName || !email || !password || !phoneNumber || !longitude || !latitude) {
        return sendErrorResponse(res, errorEn.INVALID_FIELD, HttpStatus.BAD_REQUEST);
      }
  
      const lowerCaseEmail = email.toLowerCase();
      const exitUser = await UserModel.findOne({ email: lowerCaseEmail });
      if (exitUser) {
        return sendErrorResponse(res, errorEn.ALREADY_EXIST, HttpStatus.DEFAULT_ERROR);
      }
  
      password = await genPassword(password);
  
      const location = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
  
      const dataToSave = {
        userName: userName,
        email: lowerCaseEmail,
        password: password,
        phoneNumber: phoneNumber,
        deviceToken: deviceToken,
        location: location,
        isDeleted: false, 
        createdAt: createdAt ? new Date(createdAt) : Date.now(), 
        updatedAt: updatedAt ? new Date(updatedAt) : Date.now(),
      };
  
      const data = await commonService.create(UserModel, dataToSave);
      if (data) {
        const responseData = {
          ...data.toObject(), 
          isDeleted: data.isDeleted,  
        };
        sendSuccessResponse(res, responseData, successEn.USER_CREATED, HttpStatus.OK);
      } else {
        sendErrorResponse(res, errorEn.DEFAULT_ERROR, HttpStatus.DEFAULT_ERROR);
      }
    } catch (error) {
      return sendErrorResponse(res, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};


export const getAll = async(req,res)=>{
    try{
        const data = await UserModel.find({isDeleted:false})

        if(data){
            return sendSuccessResponse(res,data,successEn.LIST_FETCH,HttpStatus.OK)
        }else{
            return sendErrorResponse(res,errorEn.NOT_FOUND,HttpStatus.NOT_FOUND)
        }
    }catch(error){
        return sendErrorResponse(res, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
  

export const updateUser = async (req, res) => {
    try {
      const { _id, userName, email, phoneNumber, createdAt, updatedAt } = req.body;
  
      if (!_id) {
        return sendErrorResponse(res, errorEn.INVALID_FIELD, HttpStatus.BAD_REQUEST);
      }
  
      const lowerCaseEmail = email.toLowerCase();
      const condition = { _id: _id };
  
      const dataToSave = {
        userName: userName,
        email: lowerCaseEmail,
        phoneNumber: phoneNumber,
        isDeleted: false, 
        createdAt: createdAt ? new Date(createdAt) : Date.now(), 
        updatedAt: updatedAt ? new Date(updatedAt) : Date.now(),
      };
  
      const data = await commonService.findOneAndUpdate(UserModel, condition, dataToSave);
  
      if (data) {
        sendSuccessResponse(res, data, successEn.UPDATED, HttpStatus.OK);
      } else {
        sendErrorResponse(res, errorEn.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
  
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, errorEn.SOMETHING_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
  

export const deleteUser = async (req, res) => {
    try {
      const { _id } = req.body;
  
      if (!_id) {
        return sendErrorResponse(res, errorEn.INVALID_FIELD, 400, { receivedData: req.body });
      }
  
      const user = await UserModel.findOne({ _id: _id, isDeleted: false });
  
      if (!user) {
        return sendErrorResponse(
          res,
          errorEn.USER_ALREADY_DELETED,
          400,
          { _id, message: "User not found or already deleted" }
        );
      }
  
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: _id },
        { $set: { isDeleted: true, updatedAt: new Date().getTime() } },
        { new: true }
      );
  
      if (updatedUser) {
        return sendSuccessResponse(res, successEn.USER_DELETED, 200, { user: updatedUser });
      }
  
      return sendErrorResponse(res, errorEn.INTERNAL_SERVER_ERROR, 500, { _id, message: "Failed to delete user" });
    } catch (error) {
      return sendErrorResponse(res, error.message, 500, { errorDetails: error.stack });
    }
};
  
  