import { v4 as uuidv4 } from 'uuid';
import RuleExecution from './dto/RuleExecutionDto';

export type StoredFile = {
  id: string;
  file: Express.Multer.File;
  execution?: RuleExecution;
};

let uploadedFiles: StoredFile[] = [];

export const FileStore = {
  getFiles: () => uploadedFiles,

  addFile: (file: Express.Multer.File, execution?: RuleExecution) => {
    const storedFile: StoredFile = { id: uuidv4(), file, execution };
    uploadedFiles.push(storedFile);
    return storedFile; 
  },

  removeFile: (id: string) => {
    uploadedFiles = uploadedFiles.filter(f => f.id !== id);
  },
};
