export interface IRawButtons {
  type: "BUTTONS";
  buttons: object[];
}

export interface IQuickReply {
  type: "button";
  sub_type: "quick_reply";
  index: number;
  parameters: [];
}

export interface IPhoneNumber {
  type: "button";
  sub_type: "VOICE_CALL";
  index: number;
}

export interface IRawUrl {
  type: "URL";
  text: string;
  url: string;
  example?: string[];
}
export interface IUrl {
  type: "button";
  sub_type: "url";
  index: number;
  parameters?: IUrlParams[];
}

export interface IUrlParams {
  type: "text";
  text: string;
}
