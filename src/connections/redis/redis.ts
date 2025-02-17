import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export class RedisConnection {
  private static instance: Redis | null = null;

  private constructor() {}

  public static getInstance(): Redis {
    if (!RedisConnection.instance) {
      RedisConnection.instance = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        retryStrategy: (times) => Math.min(times * 50, 2000),
      });

      // Handle Redis connection events
      RedisConnection.instance.on("connect", () =>
        console.log("Connected to Redis")
      );
      RedisConnection.instance.on("error", (err) =>
        console.error("Redis Error:", err)
      );
    }

    return RedisConnection.instance;
  }
}

export const redisClient = RedisConnection.getInstance();
