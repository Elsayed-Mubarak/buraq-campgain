import { IRawTemplateData } from "../interfaces/IRawTemplateData";
import { ITemplatePayload } from "../interfaces/ITemplatePayload";
import PayloadBuilder from "../interfaces/PayloadBuilder";

export class NamedPayloadBuilder extends PayloadBuilder {
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

export const payloadBuilder = new NamedPayloadBuilder();
