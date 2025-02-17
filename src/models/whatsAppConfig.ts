import mongoose, { Document, Model } from "mongoose";

// Define TypeScript interface based on expected fields
export interface IWhatsAppConfig extends Document {
  [key: string]: any;
}

export const whatsappConfigs: Model<IWhatsAppConfig> = mongoose.models
  .whatsappconfigs
  ? mongoose.model<IWhatsAppConfig>("whatsappconfigs") // Use existing model
  : mongoose.model<IWhatsAppConfig>(
      "whatsappconfigs",
      new mongoose.Schema({}, { strict: false })
    );
