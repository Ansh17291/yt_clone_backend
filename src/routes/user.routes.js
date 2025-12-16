import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAcessToken, registerUser, updateAccountDetails, updateCoverImages, updateUserAvatar } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlware.js";
import { verifyJWT } from './../middlewares/auth.middleware.js';


const router = Router();
// https://localhost:8000/api/users/register
router.route("/register").post(
    upload.fields([
        {
            name: "avatar", // field name from frontend, so check there
            maxCount: 1
        },
        {
            name: "coverImages", // field name from frontend, so check there
            maxCount: 5
        },
        {
            name: "coverImage", // also accept singular field if frontend uses it
            maxCount: 5
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser)

// SECURE ROUTES
router.route("/logout").post(verifyJWT , logoutUser) // here verfifyJWT is a middleware !!

router.route("/refreshToken").post(refreshAcessToken)    

router.route("/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/current-user").get(verifyJWT,getCurrentUser)

router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar")/patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router.route("/coverImage").patch(verifyJWT, upload.array("coverImages", 5), updateCoverImages);

router.route("/channel/:username").get(verifyJWT, getUserChannelProfile);

router.route("/history").get(verifyJWT,getWatchHistory);
export default router;