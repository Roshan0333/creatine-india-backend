import {Router} from "express";
import {getInstaPost, getInstaPostByAdmin, updateInstaPost, deleteInstaPost, addInstaPost} from "../controller/instaPost.controller.js";
import { verifyToken } from "../middleware/adminRequired.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

router.route("/").post(verifyToken, upload.single("postImage"), addInstaPost);
router.route("/:id").put(verifyToken, upload.single("postImage"), updateInstaPost);
router.route("/:id").delete(verifyToken, deleteInstaPost);
router.route("/dashboard").get(verifyToken, getInstaPostByAdmin);
router.route("/").get(getInstaPost);

export default router
