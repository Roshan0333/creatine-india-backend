import { Router } from "express";
import { verifyToken } from "../middleware/adminRequired.js";
import {getCategories, updateCategory, deleteCategory, createCategory} from "../controller/category.controller.js"

const router = Router();

router.route("/").post(verifyToken, createCategory);
router.route("/").get(getCategories);
router.route("/:id").patch(updateCategory);
router.route("/:id").delete(deleteCategory)

export default router