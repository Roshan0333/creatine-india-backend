import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import blogRoutes from "./src/router/blog.route.js";
import contactRoutes from "./src/router/contact.route.js";
import welcomeRoutes from "./src/router/welcome.route.js";
import authRoutes from "./src/router/auth.route.js";
import blogCategoryRoutes from "./src/router/blogcategory.route.js";
import faqRoutes from "./src/router/faq.route.js";
import flavourRoutes from "./src/router/flavour.route.js";
import instaPostRoutes from "./src/router/instaPost.route.js";
import nutritionRoutes from "./src/router/nutrition.route.js";
import reviewRoutes from "./src/router/review.route.js"

const app = express();
dotenv.config();

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PUT","PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

app.use("/api/blog", blogRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/welcome", welcomeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/blogCategory", blogCategoryRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/flavour", flavourRoutes);
app.use("/api/instaPost", instaPostRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/review", reviewRoutes);


export default app;