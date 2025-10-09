import pdfParse from "pdf-parse";

export const parsePdf = async (file: any): Promise<string[]> => {
  if (!file.buffer) throw new Error("Archivo vacío");

  const data = await pdfParse(file.buffer);

  return data.text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};
