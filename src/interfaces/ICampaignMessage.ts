export interface ICampaignMessage extends Document {
  cmapaignId: string;
  messageId: string;
  messageStatus: string;
  createdAt: Date;
}
