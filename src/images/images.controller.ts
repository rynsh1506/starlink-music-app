import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { createReadStream } from 'fs';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private configService: ConfigService,
  ) {}

  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination(req, file, callback) {
          const config = new ConfigService();
          callback(null, config.get<string>('FILE_DEST'));
        },
        filename(req, file, callback) {
          const orgName = file.originalname.split('.');
          const fileExt = orgName[orgName.length - 1];
          const randomizer = Math.round(Math.random() * 1e9).toString(16);
          callback(null, Date.now() + randomizer + '.' + fileExt);
        },
      }),
      fileFilter(req, file, callback) {
        const allowedFile = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
        ];
        if (!allowedFile.includes(file.mimetype)) {
          return callback(
            new BadRequestException('File Type not supported'),
            false,
          );
        }
        return callback(null, true);
      },
    }),
  )
  create(@UploadedFiles() files: Array<Express.Multer.File>) {
    const filename = files.map((file) => {
      const field = file.fieldname;
      const name = file.filename;
      return { field, name };
    });
    return filename;
  }

  @Get(':name')
  @Header('Content-Type', 'Image/Jpeg')
  findOne(@Param('name') name: string) {
    const filepath = join(this.configService.get<string>('FILE_DEST'), name);
    const file = createReadStream(filepath);
    return new StreamableFile(file);
  }
}
