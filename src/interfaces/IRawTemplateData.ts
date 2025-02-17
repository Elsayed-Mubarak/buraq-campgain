export interface IRawTemplateData {
  name: string;
  parameter_format: "POSITIONAL" | "NAMED";
  components: ITemplateComponent[];
  language: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  category: string;
  sub_category?: string;
  id: string;
}

export interface ITemplateComponent {
  type: "HEADER" | "BODY" | "BUTTONS";
  format?: "TEXT" | "IMAGE" | "VIDEO";
  text?: string;
  example?: IComponentExample;
  buttons?: ITemplateButton[];
}

export interface IComponentExample {
  header_handle?: string[]; // For Image Headers
  header_text?: string[]; // For Text Headers
  header_text_named_params?: INamedParamExample[]; // Named parameters in headers
  body_text?: string[][]; // Positional placeholders in body
  body_text_named_params?: INamedParamExample[]; // Named placeholders in body
}

export interface INamedParamExample {
  param_name: string;
  example: string;
}

export interface ITemplateButton {
  type: "URL" | "PHONE_NUMBER" | "QUICK_REPLY";
  text: string;
  url?: string;
  example?: string[];
  phone_number?: string;
}
