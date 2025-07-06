import "dotenv/config";
import express from "express";
import connectDB from "./db/connectDatabase.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT   = process.env.PORT || 5000;        
const SECRET = process.env.COOKIE_SECRET || "dev_secret";
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || "http://localhost:5173";


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(SECRET));

app.use(
  cors({
    origin: FRONTEND_BASE_URL,   
    credentials: true,          
  })
);

if (!process.env.FRONTEND_BASE_URL) {
  console.warn(
    "[CORS] FRONTEND_BASE_URL not set — falling back to http://localhost:5173"
  );
}


app.use("/api/v1/user",  userRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/user", userRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Hello, Welcome to Vooshfoods" });
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀  Server started on http://localhost:${PORT}`);
});
