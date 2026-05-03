import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { env } from "./src/config/env.js";

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log(`Portfolio API running at http://localhost:${PORT}`);
    });

    const shutdown = () => {
      server.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
