import mongoose, { Schema, Document } from "mongoose";
import { ICampaignMessage } from "../interfaces/ICampaignMessage";

const CampaignMessageSchema: Schema = new Schema(
  {
    cmapaignId: { type: String, required: true },
    messageId: { type: Number, required: true },
    messageStatus: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model<ICampaignMessage>(
  "Product",
  CampaignMessageSchema
);
