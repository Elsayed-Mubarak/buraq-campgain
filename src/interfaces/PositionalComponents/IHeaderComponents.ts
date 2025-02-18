export interface IRawHeader {
  type: "HEADER";
  format: "TEXT" | "IMAGE" | "VIDEO";
  text?: string;
  example: {
    header_text?: string[];
    header_handle?: string[];
  };
}

export interface IPayloadHeader {
  type: "header";
  parameters: {
    type: string;
    text?: string;
    image?: { link: string };
    document?: { link: string };
    video?: { link: string };
  }[];
}
