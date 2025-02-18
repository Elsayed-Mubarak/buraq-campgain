import mongoose, { Schema, Document } from "mongoose";

export interface ICampaignMessage extends Document {
  cmapaignId: string;
  messageId: string;
  messageStatus: string;
  createdAt: Date;
}

const CampaignMessageSchema: Schema = new Schema(
  {
    campaignId: { type: String, required: true },
    messageId: { type: String, required: true },
    messageStatus: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model<ICampaignMessage>(
  "CampaignMessage",
  CampaignMessageSchema
);
