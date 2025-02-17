import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { RedisConnection } from "./connections/redis/redis";
import MongoDBConnection from "./connections/mongo/mongo";
import { campaignConsumer } from "./consumers/campaignConsumer";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const campaignQueue = process.env.RABBITMQ_QUEUE || "campaigns_queue";

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  await campaignConsumer(campaignQueue);
  await MongoDBConnection.getInstance().connect();
  RedisConnection.getInstance();
});
