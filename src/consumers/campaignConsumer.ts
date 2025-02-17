import mongoose from "mongoose";
import { CampaignMessage } from "../interfaces/IIncomingMessage";
import { IWhatsAppConfig, whatsappConfigs } from "../models/whatsAppConfig";
import { IWorkflow, workflows } from "../models/workflows";
import { getTemplateMessage } from "../services/payloadBuilder";
import logger from "../utils/logger";

export async function processCampaignMessage(
  message: CampaignMessage
): Promise<void> {
  console.log(` Processing  message: ${message}`);
  const accountId = new mongoose.Types.ObjectId(message.accountId);
  const campaignId = new mongoose.Types.ObjectId(message.campaignId);

  const campaign: IWorkflow | null = await workflows.findOne({
    id: campaignId,
  });
  console.log("specific campaign", campaign);

  const whatsAppConfig: IWhatsAppConfig | null = await whatsappConfigs.findOne({
    account: accountId,
  });
  console.log("specific config", whatsAppConfig);
  if (!campaign) {
    logger.error({
      event: "processCampaignMessage",
      module: "campaignConsumer.ts",
      message: "Campaign not found",
      campaignId: message.campaignId,
      time: new Date().toISOString(),
    });
    return;
  }

  const templateMessage = await getTemplateMessage(message, campaign);
  console.log(templateMessage?.rawTemplateData);
  console.log("whatsapp configs", whatsAppConfig);
  //   logger.info({
  //     event: "processCampaignMessage",
  //     module: "campaignConsumer.ts",
  //     message: "campaign data",
  //     data: campaign,
  //     time: new Date().toISOString(),
  //   });
}
