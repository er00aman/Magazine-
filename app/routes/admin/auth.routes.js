import { Router } from "express";
const router = Router();
import * as authController from '../../controller/admin/auth.js';
import * as profile from '../../controller/admin/profile.js'
import { verifyAdminToken, verifyOTP } from "../../middleware/authentication.js"; 
import upload from "../../utils/multer.js";










// Admin Auth
router.route("/register").post(authController.createAccount);
router.route("/login").post(authController.login);
router.route("/forget").post(authController.forgetPassword);
router.route("/reset").post(verifyOTP, authController.resetPassword); 

// Admin Profile
router.route("/uploadMyProfile").post(
    verifyAdminToken,
    upload.fields([{ name: 'uploadYourFile', maxCount: 1 }]),
    profile.uploadMyProfile
);
router.route("/getAllProfile").get(verifyAdminToken,profile.getAllMyProfile)
router.route("/removeProfile").post(
    verifyAdminToken,
    profile.removeProfile
);
router.route("/updateProfile").put(verifyAdminToken,
    upload.fields([{name:'uploadYourFile',maxCount:1}]),
    profile.updateProfile)

export default router;
