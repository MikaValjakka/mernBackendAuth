import express from "express";
import authController from "../controllers/auth.controller";

const router = express.Router();

// This is a router to call controller in user signin and user signout
//--------------------------------------------------------------------

router.route("/auth/signin")
    // user will post their user credentials
    .post(authController.signin);
    
// dignout -> clear cookie    
router.route("/auth/signout")
    .get(authController.signout);

export default router;
