import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase";

class MongoDBConnection {
  private static instance: MongoDBConnection;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log("MongoDB already connected.");
      return;
    }

    try {
      await mongoose.connect(MONGO_URI);
      this.isConnected = true;
      console.log("Connected to MongoDB");
      this.listAllCollections();
    } catch (error) {
      console.error("MongoDB Connection Failed:", error);
      process.exit(1);
    }
  }

  private async listAllCollections() {
    try {
      if (!mongoose.connection?.db) {
        return;
      }

      const collections = await (mongoose.connection.db as unknown as any)
        .listCollections()
        .toArray();

      const collectionNames = collections.map((col: any) => col.name);
      console.log("Collections in Database:", collectionNames);
    } catch (error) {
      console.error("Error listing collections:", error);
    }
  }
}

export default MongoDBConnection;
