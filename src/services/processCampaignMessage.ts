import mongoose from "mongoose";
import { IWorkflow, workflows } from "../models/workflows";
import { IWhatsAppConfig, whatsappConfigs } from "../models/whatsAppConfig";
import logger from "../utils/logger";
import { IRawTemplateData } from "../interfaces/IRawTemplateData";
import { getTemplateMessage } from "./positionalPayloadBuilder";
import { CampaignMessage } from "../interfaces/IIncomingMessage";
import { fetchAndProcessCsv } from "./csvExtractor";

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
      module: "processCampaignMessage.ts",
      message: "Campaign not found",
      campaignId: message.campaignId,
      time: new Date().toISOString(),
    });
    return;
  }

  const templateData: IRawTemplateData | null = await getTemplateMessage(
    message,
    campaign
  );
  if (!templateData) {
    logger.error({
      event: "processCampaignMessage",
      module: "processCampaignMessage.ts",
      message: "templateData not found",
      templateName: message.templateName,
      time: new Date().toISOString(),
    });
    return;
  }
  console.log("templateData", JSON.stringify(templateData, null, 2));
  if (!whatsAppConfig) {
    logger.error({
      event: "processCampaignMessage",
      module: "processCampaignMessage.ts",
      message: "templateData not found",
      templateName: message.templateName,
      time: new Date().toISOString(),
    });
    return;
  }
  await fetchAndProcessCsv(
    message.csvUrl,
    templateData,
    whatsAppConfig,
    message.campaignId
  );
  //   logger.info({
  //     event: "processCampaignMessage",
  //     module: "campaignConsumer.ts",
  //     message: "campaign data",
  //     data: campaign,
  //     time: new Date().toISOString(),
  //   });
}
