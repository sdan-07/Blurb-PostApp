import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

//imports
import postRoutes from "./routes/post.route.js";
import authRoutes from "./routes/auth.route.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "..", "public");

//middlewares
app.use(
  cors({
    origin: process.env.VITE_FRONTEND_URL as string,
    methods: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

//api
app.use("/api/post", postRoutes);
app.use("/api/auth", authRoutes);

//health check route
app.get("/health", (_: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
  });
});

//serve frontend
app.use(express.static(publicPath));

//spa fallback
app.get("/{*path}", (_: Request, res: Response) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

export default app;
