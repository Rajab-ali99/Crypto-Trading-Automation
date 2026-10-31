import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import router from "./routes/index.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Bullish Pixel API is running",
  });
});

app.use("/api", router);

app.use(errorHandler);

export default app;