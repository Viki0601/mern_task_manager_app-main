// import "dotenv/config";
// import express from "express";
// import connectDB from "./db/connectDatabase.js";
// import userRoutes from "./routes/userRoutes.js";
// import taskRoutes from "./routes/taskRoutes.js";
// import cookieParser from "cookie-parser";
// import cors from "cors";

// const app = express();
// const PORT   = process.env.PORT || 5000;        
// const SECRET = process.env.COOKIE_SECRET || "dev_secret";
// const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || "http://localhost:5173";


// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser(SECRET));

// app.use(
//   cors({
//     origin: FRONTEND_BASE_URL,   
//     credentials: true,          
//   })
// );

// if (!process.env.FRONTEND_BASE_URL) {
//   console.warn(
//     "[CORS] FRONTEND_BASE_URL not set — falling back to http://localhost:5173"
//   );
// }


// app.use("/api/v1/user",  userRoutes);
// app.use("/api/v1/tasks", taskRoutes);
// app.use("/api/v1/user", userRoutes);


// app.get("/", (req, res) => {
//   res.json({ message: "Hello, Welcome to Vooshfoods" });
// });

// app.listen(PORT, async () => {
//   await connectDB();
//   console.log(`🚀  Server started on http://localhost:${PORT}`);
// });
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

// List of allowed origins (local + production frontend)
const allowedOrigins = [
  "http://localhost:5173"
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(SECRET));

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Warn if env var is not set
if (!process.env.FRONTEND_BASE_URL) {
  console.warn(
    "[CORS] FRONTEND_BASE_URL not set — falling back to default allowedOrigins."
  );
}

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello, Welcome to Vooshfoods" });
});

// Start the server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
