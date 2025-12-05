import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlware.js";


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

export default router;