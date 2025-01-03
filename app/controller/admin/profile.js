import * as commonService from '../../services/common.js';
import { successEn, errorEn } from '../../responses/message.js';
import { sendErrorResponse, sendSuccessResponse } from '../../responses/response.js';
import HttpStatus from 'http-status-codes';
import profile from '../../model/admin/profile.js';
import fs from 'fs'

export const uploadMyProfile = async (req, res) => {
    try {
        const fileField = req.files?.uploadYourFile?.[0];

        if (!fileField) {
            return sendErrorResponse(res, errorEn.INVALID_FIELD, HttpStatus.BAD_REQUEST);
        }

        const uploadYourFile = fileField.path;
        const { name, createdAt, updatedAt } = req.body;

        if (!name || !uploadYourFile) {
            return sendErrorResponse(res, errorEn.INVALID_FIELD, HttpStatus.BAD_REQUEST);
        }

        const myProfile = {
            name,
            uploadYourFile,
            createdAt: createdAt ? new Date(createdAt) : Date.now(),
            updatedAt: updatedAt ? new Date(updatedAt) : Date.now(),
        };

        const dataToSave = await commonService.create(profile, myProfile);

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

export const getAllMyProfile = async(req,res)=>{
    try{
        const data = await profile.find()
        if(data){
            return sendSuccessResponse(res,data,successEn.DETAILS_FETCH,HttpStatus.OK)
        }else{
            return sendErrorResponse(res,errorEn.NOT_FOUND,HttpStatus.NOT_FOUND)
        }
    }catch(error){
        return sendErrorResponse(res, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export const removeProfile = async (req, res) => {
    try {
        const { _id } = req.body || req.query;

        if (!_id) {
            return sendErrorResponse(res, errorEn.INVALID_FIELD, HttpStatus.BAD_REQUEST);
        }

        const profileData = await profile.findById(_id);
        if (!profileData) {
            return sendErrorResponse(res, errorEn.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        if (profileData.uploadYourFile) {
            try {
                if (fs.existsSync(profileData.uploadYourFile)) {
                    fs.unlinkSync(profileData.uploadYourFile);
                    console.log("File deleted successfully");
                } else {
                    console.warn("File not found, skipping deletion");
                }
            } catch (error) {
                console.error("Error while deleting file:", error);
            }
        }

        const updatedProfile = await profile.findByIdAndUpdate(
            _id,
            { $unset: { uploadYourFile: "" } },
            { new: true } 
        );

        if (updatedProfile) {
            return sendSuccessResponse(
                res,
                { profile: updatedProfile },
                successEn.DELETE_SUCCESSFULLY,
                HttpStatus.OK
            );
        } else {
            return sendErrorResponse(res, errorEn.DEFAULT_ERROR, HttpStatus.BAD_REQUEST);
        }
    } catch (error) {
        console.error("Error:", error);
        return sendErrorResponse(res, errorEn.PROFILE_UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { _id, name } = req.body;
        const fileField = req.files?.uploadYourFile?.[0];

        if (!_id) {
            return sendErrorResponse(res, errorEn.INVALID_FIELD, HttpStatus.BAD_REQUEST);
        }

        const updatedData = {};
        if (name) updatedData.name = name;
        if (fileField) updatedData.uploadYourFile = fileField.path;
        updatedData.updatedAt = Date.now();

        const updatedProfile = await commonService.findOneAndUpdate(profile, { _id }, updatedData);

        if (!updatedProfile) {
            return sendErrorResponse(res, errorEn.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        return sendSuccessResponse(
            res,
            updatedProfile,
            successEn.UPDATED,
            HttpStatus.OK
        );
    } catch (error) {
        console.error("Error in updateProfile controller:", error);
        return sendErrorResponse(res, errorEn.SOMETHING_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
