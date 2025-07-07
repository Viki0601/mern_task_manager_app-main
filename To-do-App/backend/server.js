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
const FRONTEND_BASE_URL =
  process.env.FRONTEND_BASE_URL || "https://mern-task-manager-app-main.onrender.com";

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(SECRET));

// ✅ CORS Setup
app.use(
  cors({
    origin: FRONTEND_BASE_URL,
    credentials: true,
  })
);

if (!process.env.FRONTEND_BASE_URL) {
  console.warn(
    "[CORS] FRONTEND_BASE_URL not set — falling back to https://mern-task-manager-app-main.onrender.com"
  );
}

// ✅ Routes
app.use("/api/v1/user", userRoutes); // only once is needed
app.use("/api/v1/tasks", taskRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.json({ message: "Hello, Welcome to Vooshfoods" });
});
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Start Server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server started on http://localhost:${PORT}`);

});
