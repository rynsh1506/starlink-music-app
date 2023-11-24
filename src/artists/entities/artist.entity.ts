import { AutoMap } from '@automapper/classes';

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
  CreatedAt: Date;

  @AutoMap()
  UpdatedAt: Date;
}
