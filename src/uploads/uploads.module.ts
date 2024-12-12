import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, callback) => {
          console.log(file);
          let ext = '';
          switch (file.mimetype) {
            case 'application/pdf':
              ext = 'pdf';
              break;
            case 'image/jpeg':
              ext = 'jpg';
              break;
            case 'image/png':
              ext = 'png';
              break;
            case 'image/webp':
              ext = 'webp';
              break;
            case 'application/octet-stream':
              ext = 'bin';
              break;

            default:
              break;
          }
          const timestamp = Date.now(); // Add a timestamp to avoid overwrites
          callback(null, `${timestamp}.${ext}`); // Construct the new filename
        },
      }),
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}
