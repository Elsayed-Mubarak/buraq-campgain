import { CampaignMessage } from "../interfaces/IIncomingMessage";
import {
  IRawTemplateData,
  ITemplateComponent,
} from "../interfaces/IRawTemplateData";
import { ITemplatePayload } from "../interfaces/ITemplatePayload";
import PayloadBuilder from "../interfaces/PayloadBuilder";
import { ITemplateMessage, templateMessages } from "../models/templateMessages";
import { IWorkflow, workflows } from "../models/workflows";

export async function getTemplateMessage(
  message: CampaignMessage,
  campaign: IWorkflow
): Promise<IRawTemplateData | null> {
  console.log(` Processing  ID: ${message.campaignId}`);
  console.log("workflow from getTemplateMessage", campaign);
  const templateMessage: ITemplateMessage | null =
    await templateMessages.findOne({
      name: message.templateName,
    });
  return templateMessage?.rawTemplateData;
}

export class PositionalPayloadBuilder extends PayloadBuilder {
  addHeader(headerText?: string) {}
  addBody(bodyText?: string) {}
  addButtonUrl(index: number, urlParam?: any[]) {}
  addQuickReply(index: number, data?: any[]) {}
  processButtons(buttons: any[]) {}
  generateScopedPayload(templateData: IRawTemplateData): ITemplatePayload {
    this.setTemplateName(templateData.name, templateData.language);
    return this.payload;
  }
}

export const payloadBuilder = new PositionalPayloadBuilder();
