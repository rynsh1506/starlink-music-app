import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { ArtistProfile } from './profile/artist.profile';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService, ArtistProfile],
  exports: [ArtistsService],
})
export class ArtistsModule {}
