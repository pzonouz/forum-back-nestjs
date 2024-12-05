import {
  Controller,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { AuthGuard } from 'src/auth/guards/auth-guard';

@Controller('uploads')
export class UploadsController {
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return { filename: file?.filename };
  }
  // @UseGuards(AuthGuard)
  // @Delete(':filename')
  // remove(
  //   @Param('filename') filename: string,
  //   @Res() response: Response,
  //   @Req() request: any,
  // ) {
  //   // WARN:Sesuiry issue
  //   // if (!request?.user?.is_admin && request?.user?.id !== ) {
  //   //   return response.status(401).send();
  //   // }
  //   const filePath = path.join(process.cwd(), './upload', filename);
  //   try {
  //     fs.unlinkSync(filePath);
  //     return response.status(200).send();
  //   } catch (e) {
  //     return response.status(404).send();
  //   }
  // }
}
