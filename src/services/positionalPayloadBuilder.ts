import { CampaignMessage } from "../interfaces/IIncomingMessage";
import {
  IRawTemplateData,
  ITemplateComponent,
} from "../interfaces/IRawTemplateData";
import { ITemplatePayload } from "../interfaces/ITemplatePayload";
import PayloadBuilder from "../interfaces/PayloadBuilder";
import {
  IPayloadBody,
  IRawBody,
} from "../interfaces/PositionalComponents/IBodyComponents";
import {
  IPayloadHeader,
  IRawHeader,
} from "../interfaces/PositionalComponents/IHeaderComponents";
import { IRawButtons } from "../interfaces/SharedComponents/IButtonComponents";
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
  addHeader(headerInput?: IRawHeader, parametersValues?: string[]) {
    try {
      let parameters: IPayloadHeader = { type: "header", parameters: [] };

      if (headerInput?.format === "TEXT" && headerInput?.example.header_text) {
        // Handle text-based headers
        parameters.parameters = headerInput.example.header_text.map(
          (_, index) => ({
            type: "text",
            text: `{{${parametersValues ? parametersValues[index] : "value"}}}`,
          })
        );
      } else if (
        headerInput?.example.header_handle &&
        ["IMAGE", "DOCUMENT", "VIDEO"].includes(headerInput.format)
      ) {
        // Handle media-based headers (image, document, video)
        parameters.parameters = headerInput.example.header_handle.map(
          (_, index) => ({
            type: headerInput.format.toLowerCase(),
            [headerInput.format.toLowerCase()]: {
              link: `{{${
                parametersValues ? parametersValues[index] : "value"
              }}}`,
            },
          })
        );
      }

      this.payload.template.components.push(parameters);
    } catch (error) {}
  }

  addBody(bodyInput?: IRawBody, parametersValues?: string[]) {
    try {
      let parameters: IPayloadBody = { type: "body", parameters: [] };

      if (bodyInput?.text && bodyInput?.example.body_text) {
        // Extract placeholders from the example body text
        parameters.parameters = bodyInput.example.body_text[0].map(
          (_, index) => ({
            type: "text",
            text: `{{${parametersValues ? parametersValues[index] : "value"}}}`,
          })
        );
      }

      this.payload.template.components.push(parameters);
    } catch (error) {
      console.error("Error in addBody:", error);
    }
  }
  generateScopedPayload(templateData: IRawTemplateData): ITemplatePayload {
    this.setRecipient("PhoneNumber");
    this.setTemplateName(templateData.name, templateData.language);
    const header = templateData?.components?.find(
      (c) => c.type === "HEADER"
    ) as IRawHeader | undefined;

    const body = templateData.components.find((c) => c.type === "BODY") as
      | IRawBody
      | undefined;
    const buttons = templateData.components.find(
      (c) => c.type === "BUTTONS"
    ) as IRawButtons | undefined;
    if (header) {
      console.log("header");
      this.addHeader(header, ["OrderNumber"]);
    }
    if (body) {
      console.log("body");
      this.addBody(body, ["Name", "OrderNumber", "deliveryMan"]);
    }

    if (buttons) {
      console.log("buttons", buttons.buttons);
      this.processButtons(buttons.buttons);
    }
    console.log("current payload", JSON.stringify(this.payload, null, 2));

    return this.payload;
  }
}

export const positonalPayloadBuilder = new PositionalPayloadBuilder();
