import { AutoMap } from '@automapper/classes';
import { ArtistsStatusEnum } from '@prisma/client';

export class GetArtistDto {
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

  @AutoMap()
  CreatedAt: Date;

  @AutoMap()
  UpdatedAt: Date;

  @AutoMap()
  DeletedAt: Date;
}
