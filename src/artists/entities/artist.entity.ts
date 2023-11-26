import { AutoMap } from '@automapper/classes';
import { ArtistsStatusEnum } from '@prisma/client';

export class Artist {
  @AutoMap()
  id: string;

  @AutoMap()
  ArtistName: string;

  @AutoMap()
  PackageName: string;

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
