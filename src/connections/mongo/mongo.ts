import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase";

export async function connectMongoDB(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI);

    console.log(" Connected to MongoDB");
    listAllCollections();
  } catch (error) {
    console.error(" MongoDB Connection Failed:", error);
    process.exit(1);
  }
}

mongoose.connection.on("connected", () => console.log(" MongoDB Connected"));
mongoose.connection.on("error", (err) => console.error(" MongoDB Error:", err));
mongoose.connection.on("disconnected", () =>
  console.warn(" MongoDB Disconnected")
);

async function listAllCollections() {
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
    console.error(" Error listing collections:", error);
  }
}

export default mongoose;
