import { IRawTemplateData } from "./IRawTemplateData";
import { ITemplatePayload } from "./ITemplatePayload";
import { IRawHeader } from "./PositionalComponents/IHeaderComponents";
import {
  IPhoneNumber,
  IQuickReply,
} from "./SharedComponents/IButtonComponents";

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
    this.payload.to = `+{{${recipientParameter}}}`;
  }

  setTemplateName(templateName: string, language: string): void {
    this.payload.template.name = templateName;
    this.payload.template.language.code = language;
  }

  addHeader(headerInput?: object, parameters?: any[]): void {}
  addBody(bodyInput?: object, parametersValues?: any[]): void {}

  addButtonUrl(index: number, urlParam?: any[]): void {}
  addQuickReply(index: number): void {
    let btn: IQuickReply = {
      type: "button",
      sub_type: "quick_reply",
      index: index,
      parameters: [],
    };
    this.payload.template.components.push(btn);
  }

  addPhoneNumber(index: number): void {
    let btn: IPhoneNumber = {
      type: "button",
      sub_type: "VOICE_CALL",
      index: index,
    };
    this.payload.template.components.push(btn);
  }
  processButtons(buttons: any[]): void {
    for (let i = 0; i < buttons.length; i++) {
      const btn = buttons[i];
      const type = btn.type;
      switch (type) {
        case "QUICK_REPLY":
          this.addQuickReply(i);
          break;
        case "PHONE_NUMBER":
          this.addPhoneNumber(i);
          break;

        default:
          break;
      }
    }
  }

  generateScopedPayload(templateData: IRawTemplateData): ITemplatePayload {
    return { ...this.payload };
  }

  resetPayload(): void {
    this.payload = this.createInitialPayload();
  }
}

export default PayloadBuilder;
