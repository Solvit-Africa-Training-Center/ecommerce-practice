import express from "express";
import { config } from "dotenv";
import { Database } from "./database";
import { routers } from "./routes";
import { redis } from "./utils/redis";

config();

const app = express();

app.use(express.json());

app.use(routers);

app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    success: false,
    message: "The requested resource was not found",
  });
});

redis.connect().catch(console.error);

const port = parseInt(process.env.PORT as string) || 5000;

Database.database
  .authenticate()
  .then(async () => {
    try {
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    } catch (error) {
      console.log("Error initializing notification service:", error);
    }
  })
  .catch((error) => {
    console.log("Database connection failed:", error);
  });

export { app };
