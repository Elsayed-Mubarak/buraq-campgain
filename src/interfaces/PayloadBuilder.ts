import { IRawTemplateData } from "./IRawTemplateData";
import { ITemplatePayload } from "./ITemplatePayload";
import {
  IPhoneNumber,
  IQuickReply,
  IRawUrl,
  IUrl,
  IUrlParams,
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

  addButtonUrl(index: number, urlParams?: IUrlParams[]): void {
    let btn: IUrl = {
      type: "button",
      sub_type: "url",
      index: index,
      parameters: urlParams,
    };
    this.payload.template.components.push(btn);
  }

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
  processButtons(buttons: any[], urlParams?: string[]): void {
    for (let i = 0; i < buttons.length; i++) {
      let btn = buttons[i];
      const type = btn.type;
      switch (type) {
        case "QUICK_REPLY":
          this.addQuickReply(i);
          break;
        case "PHONE_NUMBER":
          this.addPhoneNumber(i);
          break;
        case "URL":
          btn = btn as IRawUrl | undefined;
          let finalParams: IUrlParams[] = [];
          if (btn && btn.example && urlParams) {
            urlParams.forEach((param) => {
              finalParams.push({ type: "text", text: `{{${param}}}` });
            });
            this.addButtonUrl(i, finalParams);
          }
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
