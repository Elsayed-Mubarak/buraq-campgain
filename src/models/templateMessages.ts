import mongoose, { Document, Model } from "mongoose";

// Define TypeScript interface based on expected fields
export interface ITemplateMessage extends Document {
  [key: string]: any;
}

export const templateMessages: Model<ITemplateMessage> = mongoose.models
  .templatemessages
  ? mongoose.model<ITemplateMessage>("templatemessages") // Use existing model
  : mongoose.model<ITemplateMessage>(
      "templatemessages",
      new mongoose.Schema({}, { strict: false })
    ); // Define schema if not already registered
