import { Controller, Post } from '@nestjs/common';
import { ImportService } from './import.service';
import * as path from 'path';

@Controller('import')
export class ImportController {
  constructor(private readonly dataImportService: ImportService) {}

  @Post('csv')
  async importCsv(): Promise<string> {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'src',
      'data',
      'questions.csv',
      // 'users.csv',
    );
    await this.dataImportService.importDataFromCsv(filePath);
    return 'CSV data imported successfully!';
  }
}
