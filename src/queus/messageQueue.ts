import { Queue } from "bullmq";
import { redisClient } from "../connections/redis/redis";

// Create a queue for sending messages
export const messageQueue = new Queue("messageQueue", {
  connection: redisClient,
});
