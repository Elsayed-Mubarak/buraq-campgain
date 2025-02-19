import { IRawNamedParam } from "./INamedParameter";

export interface IRawHeader {
  type: "HEADER";
  format: "TEXT" | "IMAGE" | "VIDEO";
  text?: string;
  example: {
    header_text_named_params?: IRawNamedParam[];
    header_handle?: string[];
  };
}

export interface IPayloadHeader {
  type: "header";
  parameters: {
    type: string;
    text?: string;
    parameter_name?: string;
    image?: { link: string };
    document?: { link: string };
    video?: { link: string };
  }[];
}
