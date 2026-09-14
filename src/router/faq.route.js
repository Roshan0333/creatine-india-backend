import { Router } from "express";
import {getAllFaq,getAllFaqByAdmin, updateFaq, deleteFaq, faqAdd} from "../controller/faq.controller.js"
import { verifyToken } from "../middleware/adminRequired.js";

const router = Router();

router.route("/").post(verifyToken, faqAdd);
router.route("/:id").put(verifyToken, updateFaq);
router.route("/:id").delete(verifyToken, deleteFaq);
router.route("/dashboard").get(verifyToken, getAllFaqByAdmin);
router.route("/").get(getAllFaq);

export default router