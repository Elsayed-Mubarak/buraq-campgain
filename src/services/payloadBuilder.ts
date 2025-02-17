import { CampaignMessage } from "../interfaces/IIncomingMessage";
import { ITemplateMessage, templateMessages } from "../models/templateMessages";
import { IWorkflow, workflows } from "../models/workflows";

export async function getTemplateMessage(
  message: CampaignMessage,
  campaign: IWorkflow
): Promise<ITemplateMessage | null> {
  console.log(` Processing  ID: ${message.campaignId}`);
  console.log("workflow from getTemplateMessage", campaign);
  const templateMessage: ITemplateMessage | null =
    await templateMessages.findOne({
      name: message.templateName,
    });
  return templateMessage;
}
