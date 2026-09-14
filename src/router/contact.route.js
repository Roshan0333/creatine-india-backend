import { Router } from "express";
import {contact, getContact, updateStatus} from "../controller/contact.controller.js";
import { verifyToken } from "../middleware/adminRequired.js";

const router = Router();

router.route("/").post(contact);
router.route("/").get(verifyToken, getContact);
router.route("/:id").patch(verifyToken, updateStatus);

export default router;
