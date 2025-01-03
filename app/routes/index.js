import { Router } from "express";
import adminAuthRoutes from '../routes/admin/auth.routes.js'
import userAuthRoutes from './user/auth.routes.js'
import adminRoutes from '../routes/admin/admin.routes.js'


const router = Router()

router.use("/adminAuth",adminAuthRoutes)
router.use("/admin",adminRoutes)
router.use("/userAuth",userAuthRoutes)

export default router;