export const parseTxt = async (file: any): Promise<Record<string, any>> => {
  if (!file || !file.buffer) {
    throw new Error("Archivo TXT vacío o inválido");
  }

  // Convertimos el buffer a string
  const text = file.buffer.toString("utf-8");

  // Puedes devolver el texto crudo o un objeto con la clave 'content'
  return { content: text };
};
