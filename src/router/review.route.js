import { Router } from "express";
import {getReview, addReview, updateReview, deleteReview} from "../controller/review.controller.js";
import { verifyToken } from "../middleware/adminRequired.js";

const router = Router();

router.route("/").post(verifyToken, addReview);
router.route("/:id").put(verifyToken, updateReview);
router.route("/:id").delete(verifyToken, deleteReview);
router.route("/").get(verifyToken, getReview);
router.route("/").get(getReview);

export default router;
