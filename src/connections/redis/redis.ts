import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

//  Handle Redis Connection Events
redisClient.on("connect", () => console.log(" Connected to Redis"));
redisClient.on("error", (err) => console.error(" Redis Error:", err));

export async function useRedis(): Promise<void> {
  try {
    // Set a key in Redis
    await redisClient.set("testKey", "Hello, Redis with ioredis!");

    // Get the value
    const value = await redisClient.get("testKey");
    console.log("🔹 Redis Value:", value);
  } catch (error) {
    console.error(" Redis Operation Failed:", error);
  }
}
