import "dotenv/config";
import express from "express";
import connectDB from "./db/connectDatabase.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = process.env.COOKIE_SECRET || "dev_secret";
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || "https://mern-task-manager-app-main.onrender.com";

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(SECRET));

// CORS middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-task-manager-app-main.onrender.com",
      FRONTEND_BASE_URL
    ],
    credentials: true,
  })
);

// Warn if env var is not set
if (!process.env.FRONTEND_BASE_URL) {
  console.warn(
    "[CORS] FRONTEND_BASE_URL not set — falling back to https://mern-task-manager-app-main.onrender.com"
  );
}

// ✅ Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/tasks", taskRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.json({ message: "Hello, Welcome to Vooshfoods" });
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ message: err.message || "Something went wrong" });
});

// ✅ Start Server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
