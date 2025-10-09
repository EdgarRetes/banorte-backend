import Papa from "papaparse";

export const parseCsv = async (file: any): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    if (!file.buffer) return reject(new Error("Archivo vacío"));

    Papa.parse(file.buffer.toString("utf-8"), {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data as Record<string, any>[]),
      error: (err) => reject(err),
    });
  });
};
