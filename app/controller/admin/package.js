import { errorEn, successEn } from "../../responses/message.js";
import { sendErrorResponse, sendSuccessResponse } from "../../responses/response.js";
import HttpStatus from 'http-status-codes';
import packageModel from '../../model/admin/package.js'
import * as commonService from '../../services/common.js'


export const createPackage = async (req, res) => {
    try {
        const { name, price, features, duration } = req.body;
        
        if (!name || !price || !features || !duration) {
            return sendErrorResponse(res, errorEn.INVALID_FIELD, HttpStatus.INVALID_FIELD);
        }

        const exitPlans = await packageModel.findOne({ price: price });
        if (exitPlans) {
          return sendErrorResponse(res, errorEn.ALREADY_EXIST, HttpStatus.DEFAULT_ERROR);
        }
        const { numberOfVisitors, demographic, numberOfDevice } = features;

        const dataToSave = {
            name: name,
            price: price,
            features: {
                numberOfVisitors: numberOfVisitors,
                demographic: demographic,
                numberOfDevice: numberOfDevice
            },
            duration: duration,
            isDeleted:false
        };

        const data = await commonService.create(packageModel, dataToSave);
        
        if (data) {
            return sendSuccessResponse(res, data, successEn.PACKAGE_CREATED, HttpStatus.OK);
        } else {
            return sendErrorResponse(res, errorEn.DEFAULT_ERROR, HttpStatus.DEFAULT_ERROR);
        }

    } catch (error) {
        return sendErrorResponse(res, errorEn.FILE_UPLOAD_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};

export const getAll = async(req,res)=>{
    try{
        const data = await packageModel.find({isDeleted:false})
        if(data){
            return sendSuccessResponse(res, data, successEn.LIST_FETCH,HttpStatus.OK)
        }else{
            return sendErrorResponse(res,errorEn.NOT_FOUND,HttpStatus.NOT_FOUND)
        }
    }catch(err){
        return sendErrorResponse(res, errorEn.FILE_UPLOAD_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export const updatePackages = async (req, res) => {
    try {
        const { name, price, features, duration, _id } = req.body;

        console.log("Request body:", req.body);

        if (!_id) {
            return sendErrorResponse(res, errorEn.INVALID_FIELD, HttpStatus.INVALID_FIELD);
        }

        const condition = { _id:_id};

        const { numberOfVisitors, demographic, numberOfDevice } = features;

        const profile = {
            name: name,
            price: price,
            features: {
                numberOfVisitors: numberOfVisitors,
                demographic: demographic,
                numberOfDevice: numberOfDevice
            },
            duration: duration,
            isDeleted: false 
        };

        console.log("Condition for update:", condition);
        console.log("Profile data for update:", profile);

        const data = await commonService.findOneAndUpdate(packageModel, condition, profile);

        console.log("Updated package data:", data);

        if (data) {
            return sendSuccessResponse(res, data, successEn.UPDATED, HttpStatus.OK);
        } else {
            console.log("No document found with ID:", _id);
            return sendErrorResponse(res, errorEn.DEFAULT_ERROR, HttpStatus.DEFAULT_ERROR);
        }
    } catch (error) {
        console.log("Error updating package:", error.message);
        return sendErrorResponse(res, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};

export const deletePackages = async (req, res) => {
    try {
      const { _id } = req.body;
  
      if (!_id) {
        return sendErrorResponse(res, errorEn.INVALID_FIELD, 400, { receivedData: req.body });
      }
  
      const user = await packageModel.findOne({ _id: _id, isDeleted: false });
  
      if (!user) {
        return sendErrorResponse(
          res,
          errorEn.USER_ALREADY_DELETED,
          400,
          { _id, message: "Package not found or already deleted" }
        );
      }
  
      const updatedPackages = await packageModel.findOneAndUpdate(
        { _id: _id },
        { $set: { isDeleted: true, updatedAt: new Date().getTime() } },
        { new: true }
      );
  
      if (updatedPackages) {
        return sendSuccessResponse(
          res,
          updatedPackages, 
          successEn.DELETED_SUCCESS,
          200,
          HttpStatus.OK
        );
      }
  
      return sendErrorResponse(res, errorEn.INTERNAL_SERVER_ERROR, HttpStatus.DEFAULT_ERROR);
    } catch (error) {
      return sendErrorResponse(res, error.message, 500, { errorDetails: error.stack });
    }
};
  