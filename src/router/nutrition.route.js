import { Router } from "express";
import {getNutrition, getNutritionByAdmin, updateNutrition, deleteNutrition, addNutrition} from "../controller/nutrition.controller.js";
import { verifyToken } from "../middleware/adminRequired.js";

const router = Router();

router.route("/").post(verifyToken, addNutrition);
router.route("/:id").put(verifyToken, updateNutrition);
router.route("/:id").delete(verifyToken, deleteNutrition);
router.route("/dashboard").get(verifyToken, getNutritionByAdmin);
router.route("/").get(getNutrition);

export default router;