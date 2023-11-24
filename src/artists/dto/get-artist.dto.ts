import { AutoMap } from '@automapper/classes';

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
  CreatedAt: Date;

  @AutoMap()
  UpdatedAt: Date;
}
