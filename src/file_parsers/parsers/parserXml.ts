import { XMLParser } from "fast-xml-parser";

export const parseXml = async (file: any): Promise<Record<string, any>> => {
  if (!file.buffer) throw new Error("Archivo vacío");

  const text = file.buffer.toString("utf-8");

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_", 
  });

  const json = parser.parse(text);

  return json;
};
