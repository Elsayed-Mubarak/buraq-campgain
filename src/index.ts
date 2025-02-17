import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connectRabbitMQ } from "./connections/rabbittMQ/rabbitMQ";
import { useRedis } from "./connections/redis/redis";
import { connectMongoDB } from "./connections/mongo/mongo";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  await connectRabbitMQ();
  await useRedis();
  await connectMongoDB();
});
