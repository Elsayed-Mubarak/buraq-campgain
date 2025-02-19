import { IRawNamedParam } from "./INamedParameter";

export interface IRawBody {
  type: "Body";
  text?: string;
  example: {
    body_text_named_params?: IRawNamedParam[];
  };
}

export interface IPayloadBody {
  type: "body";
  parameters: {
    type: "text";
    text?: string;
    parameter_name?: string;
  }[];
}
