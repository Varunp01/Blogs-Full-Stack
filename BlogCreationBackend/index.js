import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { databaseConnect } from "./config/database.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import BlogRoutes from "./routes/BlogRoutes.js";

dotenv.config({
  path: ".env"
});

databaseConnect();

const app = express();

const allowedOrigins = [
  "https://blogs-full-stack.vercel.app",
  "http://localhost:5173"
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin like Postman, curl, server-to-server
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// CORS should be before routes
app.use(cors(corsOptions));

// Handle preflight requests
app.options(/.*/, cors(corsOptions));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Home Page</h1>");
});

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/blog", BlogRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("server started", PORT);
});