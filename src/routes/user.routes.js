import { Router } from "express";
import { loginUser, logoutUser, refreshAcessToken, registerUser } from "../controllers/user.controller.js";
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

export default router;