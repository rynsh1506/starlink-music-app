import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { ArtistProfile } from './profile/artist.profile';
import { PrismaService } from 'nestjs-prisma';
import { PrismaFunction } from 'src/prisma/prisma-function';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService, ArtistProfile, PrismaService, PrismaFunction],
  exports: [ArtistsService],
})
export class ArtistsModule {}
