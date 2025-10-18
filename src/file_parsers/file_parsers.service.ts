import { Injectable, BadRequestException } from '@nestjs/common';
import { parseCsv } from './parsers/parserCsv';
import { parseXml } from './parsers/parserXml';
import { parsePdf } from './parsers/parserPdf';
import { parseDocx } from './parsers/parserDocx';
import { parseTxt } from './parsers/parserTxt';

@Injectable()
export class FileParsersService {
  async parseFile(file: any) {
    if (!file || !file.originalname) {
      throw new BadRequestException('Archivo inválido o sin nombre');
    }

    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (!ext) {
      throw new BadRequestException('No se pudo determinar la extensión del archivo');
    }

    switch (ext) {
      case 'csv':
        return parseCsv(file); 
      case 'xml':
        return parseXml(file);
      case 'pdf':
        return parsePdf(file); 
      case 'docx':
      case 'doc':
        return parseDocx(file); 
      case 'txt':
        return parseTxt(file);
      default:
        throw new BadRequestException('Tipo de archivo no soportado');
    }
  }
}
