import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class ImagesService {
  constructor(private configService: ConfigService) {}

  getImageLink(name: string) {
    return this.configService.get<string>('IMG_URL') + name;
  }

  getFile(name: string) {
    const filePath = this.configService.get<string>('FILE_DEST');
    const fullPath = join(filePath, name);
    const fileStream = createReadStream(fullPath);

    return fileStream;
  }
}
