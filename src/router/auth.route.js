import { Router } from "express";
import {register, login} from "../controller/auth.controller.js";
import {isAdminEmailPresent, isDuplicateEmail} from "../middleware/email.js";

const router = Router();

router.route("/register").post(isDuplicateEmail, register);
router.route("/login").post(isAdminEmailPresent, login);

export default router

