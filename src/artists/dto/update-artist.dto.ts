import { AutoMap } from '@automapper/classes';
import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist.dto';
import { ArtistsStatusEnum } from '@prisma/client';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {
  @AutoMap()
  id: string;

  @AutoMap()
  PackageName: string;

  @AutoMap()
  ArtistName: string;

  @AutoMap()
  ImageURL: string;

  @AutoMap()
  SampleURL: string;

  @AutoMap()
  ReleaseDate: Date;

  @AutoMap()
  Status: ArtistsStatusEnum;
}
