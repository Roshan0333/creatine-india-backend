import { Router } from "express";
import multer from "multer";
import {addBlog, getBlogBySlug, getBlogs,updateBlog, deleteBlog} from "../controller/blog.controller.js";
import {verifyToken} from "../middleware/adminRequired.js"


const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

router.route("/").post(verifyToken, upload.single("image"), addBlog);
router.route("/:id").put(verifyToken, updateBlog);
router.route("/").get(getBlogs);
router.route("/:slug").get(getBlogBySlug);
router.route("/:id").delete(verifyToken, deleteBlog);

export default router;

