import { IRawTemplateData } from "../interfaces/IRawTemplateData";
import { ITemplatePayload } from "../interfaces/ITemplatePayload";
import PayloadBuilder from "../interfaces/PayloadBuilder";
import { IRawHeader } from "../interfaces/PositionalComponents/IHeaderComponents";

export class NamedPayloadBuilder extends PayloadBuilder {
  addHeader(headerInput?: IRawHeader, parameters?: string[]) {}
  addBody(bodyInput?: IRawHeader, parametersValues?: string[]) {}
  addButtonUrl(index: number, urlParam?: any[]) {}
  addQuickReply(index: number, data?: any[]) {}
  processButtons(buttons: any[]) {}
  generateScopedPayload(templateData: IRawTemplateData): ITemplatePayload {
    this.setTemplateName(templateData.name, templateData.language);
    return this.payload;
  }
}

export const payloadBuilder = new NamedPayloadBuilder();
