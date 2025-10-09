import { Injectable } from '@nestjs/common';
import { FileStore } from './file-store';

@Injectable()
export class FilesService {
    getFiles() {
        return FileStore.getFiles();
    }

    addFile(file: Express.Multer.File, execution?: any) {
        FileStore.addFile(file, execution);
    }

    removeFile(id: string) {
        FileStore.removeFile(id);
    }
}
