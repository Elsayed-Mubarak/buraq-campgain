export interface IRawBody {
  type: "Body";
  text?: string;
  example: {
    body_text?: string[][];
  };
}

export interface IPayloadBody {
  type: "body";
  parameters: {
    type: "text";
    text?: string;
  }[];
}
