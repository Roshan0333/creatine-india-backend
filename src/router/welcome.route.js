import { Router } from "express";
import {welcome, getWelcomeContact, updateWelcomeContact, deleteWelcomeContact} from "../controller/welcomeEmail.controller.js";
import { verifyToken } from "../middleware/adminRequired.js";

const router = Router();

router.route("/").post(welcome);
router.route("/").get(verifyToken, getWelcomeContact);
router.route("/:id").put(verifyToken, updateWelcomeContact);
router.route("/:id").delete(verifyToken, deleteWelcomeContact);

export default router;