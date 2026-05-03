import cors from "cors";
import express from "express";
import routes from "./routes/index.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/notFound.middleware.js";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      message: "Portfolio API is running",
      health: "/api/health",
    },
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
