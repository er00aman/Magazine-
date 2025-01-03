import { Router } from "express";
const router = Router();
import * as manageUser from '../../controller/admin/manageUser.js';
import { verifyAdminToken } from "../../middleware/authentication.js";
import upload from "../../utils/multer.js";
import * as publisherAccount from '../../controller/admin/publishMagazine.js';
import * as packages from '../../controller/admin/package.js'
import * as home from '../../controller/admin/home.js'







// Manage user routes
router.route("/create").post(manageUser.createUser);
router.route("/getAll").get(manageUser.getAll);
router.route("/updateUser").post(verifyAdminToken, manageUser.updateUser);
router.route("/delete").post(verifyAdminToken, manageUser.deleteUser);

// Publisher Account Routes
router.route("/publisherAccountCreate").post(
    verifyAdminToken,
    upload.fields([
        { name: 'uploadYourFile', maxCount: 1 },
        { name: 'chooseYourThumbnail', maxCount: 1 }
    ]),
    publisherAccount.publisherAccountCreate
);
router.route("/getAllPublisher").get(verifyAdminToken,publisherAccount.getAllPublisherAccount)
router.route("/updatePublisherAccount").put(
    verifyAdminToken,
    upload.fields([
        { name: "uploadYourFile", maxCount: 1 },
        { name: "chooseYourThumbnail", maxCount: 1 }
    ]),
    publisherAccount.updatePublisherAccount
);
router.route("/deletePublisherAccount").post(
    verifyAdminToken,
    publisherAccount.publisherAccountDelete
);


// Packages routes
router.route("/createPackages").post(verifyAdminToken,packages.createPackage)
router.route("/getAllPackages").get(verifyAdminToken,packages.getAll)
router.route("/updatePackages").put(
    verifyAdminToken,
    packages.updatePackages)
router.route("/deletePackages").post(verifyAdminToken,packages.deletePackages)


// Home routes
router.route("/getAllPublishMagazine").get(verifyAdminToken,home.getMagazineByMonthlyYearly)
router.route("/getAllRecentUploadMagazine").get(verifyAdminToken,home.getAllRecentUploadMagazine)
export default router;
