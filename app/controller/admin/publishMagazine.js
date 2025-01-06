import { errorEn, successEn } from "../../responses/message.js";
import { sendErrorResponse, sendSuccessResponse } from "../../responses/response.js";
import * as commonService from '../../services/common.js';
import publisherModel from "../../model/admin/publisherMagazine.js";
import HttpStatus from 'http-status-codes';


export const publisherAccountCreate = async (req, res) => {
  try {
    if (req.files) {
      const uploadYourFile = req.files.uploadYourFile ? req.files.uploadYourFile[0].path : ''; 
      const chooseYourThumbnail = req.files.chooseYourThumbnail ? req.files.chooseYourThumbnail[0].path : ''; 

      if (!uploadYourFile || !chooseYourThumbnail) {
        return sendErrorResponse(res, errorEn.INVALID_FIELD, HttpStatus.BAD_REQUEST);
      }

      req.body.uploadYourFile = uploadYourFile;
      req.body.chooseYourThumbnail = chooseYourThumbnail;
    } else {
      return sendErrorResponse(res, errorEn.INVALID_FIELD, HttpStatus.BAD_REQUEST);
    }

    const { 
      userName, 
      mobileNumber, 
      emailAddress, 
      publicationType, 
      plans, 
      uploadYourFile, 
      chooseYourThumbnail, 
      createdAt, 
      updatedAt 
    } = req.body;

    if (!userName || !mobileNumber || !emailAddress || !publicationType || !plans || !uploadYourFile || !chooseYourThumbnail) {
      return sendErrorResponse(res, errorEn.INVALID_FIELD, HttpStatus.BAD_REQUEST);
    }

    const lowerCaseEmail = emailAddress.toLowerCase();

    const newUser = {
      userName,
      mobileNumber: Number(mobileNumber),
      emailAddress: lowerCaseEmail,
      publicationType,
      plans,
      uploadYourFile,
      chooseYourThumbnail,
      isDeleted: false,
      createdAt: createdAt ? new Date(createdAt) : Date.now(), 
      updatedAt: updatedAt ? new Date(updatedAt) : Date.now(),
    };

    const dataToSave = await commonService.create(publisherModel, newUser);

    return sendSuccessResponse(
      res, 
      dataToSave, 
      successEn.FILE_UPLOAD_SUCCESS, 
      HttpStatus.OK
    );
  } catch (error) {
    return sendErrorResponse(res, errorEn.FILE_UPLOAD_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const getAllPublisherAccount = async(req,res)=>{
  try{
      const data = await publisherModel.find({isDeleted:false})

      if(data){
          return sendSuccessResponse(res,data,successEn.LIST_FETCH,HttpStatus.OK)
      }else{
          return sendErrorResponse(res,errorEn.NOT_FOUND,HttpStatus.NOT_FOUND)
      }
  }catch(error){
      return sendErrorResponse(res, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export const updatePublisherAccount = async (req, res) => {
  try {
    const { _id, userName, mobileNumber, emailAddress, publicationType, plans, createdAt, updatedAt } = req.body;

    const uploadYourFile = req.files && req.files.uploadYourFile ? req.files.uploadYourFile[0].path : undefined;
    const chooseYourThumbnail = req.files && req.files.chooseYourThumbnail ? req.files.chooseYourThumbnail[0].path : undefined;

    console.log(req.body);
    console.log("uploadYourFile:", uploadYourFile);
    console.log("chooseYourThumbnail:", chooseYourThumbnail);

    if (!_id || (!uploadYourFile && !chooseYourThumbnail)) {
      return sendErrorResponse(res, errorEn.INVALID_FIELD, HttpStatus.BAD_REQUEST);
    }

    const existingPublisher = await publisherModel.findById(_id);
    if (!existingPublisher) {
      return sendErrorResponse(res, errorEn.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const lowerCaseEmail = emailAddress.toLowerCase();

    const updatedProfile = {
      userName,
      mobileNumber: Number(mobileNumber),
      emailAddress: lowerCaseEmail,
      publicationType,
      plans,
      isDeleted:false,
      uploadYourFile: uploadYourFile || existingPublisher.uploadYourFile, 
      createdAt: createdAt ? new Date(createdAt) : Date.now(), 
      updatedAt: updatedAt ? new Date(updatedAt) : Date.now(),
    };

    const updatedData = await commonService.findOneAndUpdate(publisherModel, _id, updatedProfile);
    if (!updatedData) {
      return sendErrorResponse(res, successEn.UPDATED, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return sendSuccessResponse(
      res,
      updatedData,
      "Publisher account updated successfully",
      HttpStatus.OK
    );
  } catch (error) {
    console.error("Error in updating publisher account:", error.message);
    return sendErrorResponse(res, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const publisherAccountDelete = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return sendErrorResponse(res, errorEn.INVALID_FIELD, 400, { receivedData: req.body });
    }

    const user = await publisherModel.findOne({ _id: _id, isDeleted: false });

    if (!user) {
      return sendErrorResponse(
        res,
        errorEn.USER_ALREADY_DELETED,
        400,
        { _id, message: "User not found or already deleted" }
      );
    }

    const updatedUser = await publisherModel.findOneAndUpdate(
      { _id: _id },
      { $set: { isDeleted: true, updatedAt: Date.now() } },
      { new: true }
    );

    if (updatedUser) {
      return sendSuccessResponse(res, updatedUser, successEn.USER_DELETED, 200);
    }

    return sendErrorResponse(res, errorEn.INTERNAL_SERVER_ERROR, 500, { _id, message: "Failed to delete user" });
  } catch (error) {
    console.error("Error in publisherAccountDelete:", error.message);
    return sendErrorResponse(res, error.message, 500, { errorDetails: error.stack });
  }
};

