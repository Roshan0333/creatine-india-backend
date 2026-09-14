import { Router } from "express";
import { getAllFlavour, getAllFlavourByAdmin, searchFlavours, updateFlavour, deleteFlavour, addFlavour } from "../controller/flavour.controller.js"
import { verifyToken } from "../middleware/adminRequired.js";
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route("/").post(verifyToken, upload.fields([
    { name: "featuredImage", maxCount: 1 },
    { name: "image", maxCount: 1 },
]), addFlavour);
router.route("/:id").put(verifyToken, upload.fields([
    { name: "featuredImage", maxCount: 1 },
    { name: "image", maxCount: 1 },
]), updateFlavour);
router.route("/:id").delete(verifyToken, deleteFlavour);
router.route("/dashboard").get(verifyToken, getAllFlavourByAdmin);
router.route("/").get(getAllFlavour);
router.route("/search").get(searchFlavours);

export default router;
