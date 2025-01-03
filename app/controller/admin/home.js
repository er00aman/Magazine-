import HttpStatus from 'http-status-codes';
import * as commonService from '../../services/common.js';
import { sendSuccessResponse, sendErrorResponse } from '../../responses/response.js';
import { successEn, errorEn } from '../../responses/message.js';
import publishMagazine  from '../../model/admin/publisherMagazine.js'
import { subMonths } from "date-fns"; // Optional, for date calculations

export const getMagazineByMonthlyYearly = async (req, res) => {
  try {
    const { month, year } = req.query;

    const currentYear = new Date().getFullYear();
    let startDate, endDate;

    if (month) {
      const currentMonth = parseInt(month, 10) - 1; 
      startDate = new Date(currentYear, currentMonth, 1);
      endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999); 
    } else if (year) {
      const yearNumber = parseInt(year, 10);
      startDate = new Date(yearNumber, 0, 1); 
      endDate = new Date(yearNumber + 1, 0, 0, 23, 59, 59, 999);
    } else {
      startDate = new Date(2000, 0, 1);
      endDate = new Date();
    }

    const condition = {
      createdAt: { $gte: startDate, $lte: endDate }, 
      isDeleted: false,
    };

    // console.log("Condition for query:", condition);

    const data = await commonService.getByCondition(publishMagazine, condition);

    if (data && data.length > 0) {
      return sendSuccessResponse(res, data, successEn.DETAILS_FETCH, HttpStatus.OK);
    } else {
      return sendErrorResponse(res, errorEn.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  } catch (error) {
    console.log("Error fetching data:", error.message);
    return sendErrorResponse(res, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
};



export const getAllRecentUploadMagazine = async (req, res) => {
  try {
    const currentDate = new Date();
    const sixMonthsAgo = subMonths(currentDate, 6); 

    const condition = {
      $or: [
        { createdAt: { $gte: sixMonthsAgo } }, // Created within the last 6 months
        { updatedAt: { $gte: sixMonthsAgo } }, // Updated within the last 6 months
      ],
      isDeleted: false, 
    };

    const sort = { createdAt: -1 }; 

    const data = await commonService.getByCondition(publishMagazine, condition, sort);

    if (data && data.length > 0) {
      return sendSuccessResponse(res, data, successEn.DETAILS_FETCH, HttpStatus.OK);
    } else {
      return sendErrorResponse(res, errorEn.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  } catch (error) {
    console.log(error.message);
    return sendErrorResponse(res, error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
};


