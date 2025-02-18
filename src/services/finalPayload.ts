export function replaceTemplateValues(
  template: any,
  data: Record<string, string>
): any {
  let jsonString = JSON.stringify(template);

  jsonString = jsonString.replace(/{{(.*?)}}/g, (_, key) => {
    return data[key] !== undefined ? data[key] : `{{${key}}}`;
  });

  return JSON.parse(jsonString);
}
