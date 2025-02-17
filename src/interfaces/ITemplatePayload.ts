export interface ITemplatePayload {
  messaging_product: string;
  to: string;
  type: string;
  template: {
    name: string;
    language: { code: string };
    components: Array<{ type: string; parameters?: any[] }>;
  };
}
