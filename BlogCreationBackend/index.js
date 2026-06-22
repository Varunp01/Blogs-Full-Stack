import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { databaseConnect } from "./config/database.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import BlogRoutes from "./routes/BlogRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://blogs-full-stack.vercel.app",
  "http://localhost:5173"
];

// CORS MUST be before everything else
app.use((req, res, next) => {
  const origin = req.headers.origin;

  console.log("Request:", req.method, req.url, "Origin:", origin);

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Home Page</h1>");
});

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/blog", BlogRoutes);

const PORT = process.env.PORT || 5000;

databaseConnect();

app.listen(PORT, () => {
  console.log("server started", PORT);
});