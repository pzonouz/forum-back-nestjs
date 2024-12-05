import { HttpException, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadsService {
  delete(filename: string) {
    const filePath = path.join(process.cwd(), './upload', filename);
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      throw new HttpException('File not found', 404);
    }
  }
}
