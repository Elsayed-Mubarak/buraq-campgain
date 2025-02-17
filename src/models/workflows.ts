import mongoose, { Document, Model } from "mongoose";

// Define TypeScript interface based on expected fields
export interface IWorkflow extends Document {
  [key: string]: any;
}

// Attach interface to the existing collection
export const workflows: Model<IWorkflow> = mongoose.models.workflows
  ? mongoose.model<IWorkflow>("workflows") // Use existing model
  : mongoose.model<IWorkflow>(
      "workflows",
      new mongoose.Schema({}, { strict: false })
    ); // Define schema if not already registered
