import { Router } from "express";
const router = Router();
import * as authController from '../../controller/user/auth.js'









router.route("/register").post(authController.createAccount)


export default router

