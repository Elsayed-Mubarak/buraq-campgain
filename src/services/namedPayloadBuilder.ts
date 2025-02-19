import { IRawTemplateData } from "../interfaces/IRawTemplateData";
import { ITemplatePayload } from "../interfaces/ITemplatePayload";
import {
  IPayloadBody,
  IRawBody,
} from "../interfaces/NamedComponents/IBodyComponents";
import {
  IPayloadHeader,
  IRawHeader,
} from "../interfaces/NamedComponents/IHeaderComponents";
import PayloadBuilder from "../interfaces/PayloadBuilder";
import { IRawButtons } from "../interfaces/SharedComponents/IButtonComponents";

export class NamedPayloadBuilder extends PayloadBuilder {
  addHeader(headerInput?: IRawHeader, parametersValues?: string[]) {
    try {
      let parameters: IPayloadHeader = { type: "header", parameters: [] };

      if (
        headerInput?.format === "TEXT" &&
        headerInput?.example.header_text_named_params
      ) {
        // Handle text-based headers
        parameters.parameters =
          headerInput.example.header_text_named_params.map((_, index) => ({
            type: "text",
            text: `{{${parametersValues ? parametersValues[index] : "value"}}}`,
            parameter_name: _.param_name,
          }));
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

      if (bodyInput?.text && bodyInput?.example.body_text_named_params) {
        // Extract placeholders from the example body text
        parameters.parameters = bodyInput.example.body_text_named_params.map(
          (_, index) => ({
            type: "text",
            text: `{{${parametersValues ? parametersValues[index] : "value"}}}`,
            parameter_name: _.param_name,
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
      this.addHeader(header, ["Name"]);
    }
    if (body) {
      console.log("body");
      this.addBody(body, ["Name", "deliveryTime", "deliveryMan"]);
    }
    if (buttons) {
      console.log("buttons", buttons.buttons);
      this.processButtons(buttons.buttons, ["link"]);
    }
    console.log("current payload is", JSON.stringify(this.payload, null, 2));
    return this.payload;
  }
}

export const namePayloadBuilder = new NamedPayloadBuilder();
