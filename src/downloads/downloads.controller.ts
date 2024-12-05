import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('downloads')
export class DownloadsController {
  @Get(':filename')
  getFile(@Param('filename') filename: string): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'upload', filename));
    return new StreamableFile(file);
  }
}
