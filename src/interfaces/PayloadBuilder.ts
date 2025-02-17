import { IRawTemplateData } from "./IRawTemplateData";
import { ITemplatePayload } from "./ITemplatePayload";

abstract class PayloadBuilder {
  protected payload: ITemplatePayload;

  constructor() {
    this.payload = this.createInitialPayload();
  }

  private createInitialPayload(): ITemplatePayload {
    return {
      to: "",
      messaging_product: "whatsapp",
      type: "template",
      template: {
        name: "",
        language: { code: "" },
        components: [],
      },
    };
  }

  setRecipient(recipientParameter: string): void {
    this.payload.to = `{{${recipientParameter}}}`;
  }

  setTemplateName(templateName: string, language: string): void {
    this.payload.template.name = templateName;
    this.payload.template.language.code = language;
  }

  addHeader(headerText?: string): void {}
  addBody(bodyText?: string): void {}
  addButtonUrl(index: number, urlParam?: any[]): void {}
  addQuickReply(index: number, data?: any[]): void {}
  processButtons(buttons: any[]): void {}

  generateScopedPayload(templateData: IRawTemplateData): ITemplatePayload {
    return { ...this.payload };
  }

  resetPayload(): void {
    this.payload = this.createInitialPayload();
  }
}

export default PayloadBuilder;
