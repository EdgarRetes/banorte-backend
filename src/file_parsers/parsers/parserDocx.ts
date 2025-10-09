import mammoth from "mammoth";

export const parseDocx = async (file: any): Promise<string[]> => {
  if (!file.buffer) throw new Error("Archivo vacío");

  const result = await mammoth.extractRawText({ buffer: file.buffer });
  return result.value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};
