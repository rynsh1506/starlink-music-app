import { createMap, Mapper, typeConverter } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { Artist } from '../entities/artist.entity';
import { GetArtistDto } from '../dto/get-artist.dto';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { UpdateArtistDto } from '../dto/update-artist.dto';

@Injectable()
export class ArtistProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        Artist,
        GetArtistDto,
        typeConverter(Date, String, (date) =>
          date != null ? date.toISOString() : null,
        ),
      );
      createMap(
        mapper,
        CreateArtistDto,
        Artist,
        typeConverter(Date, String, (date) =>
          date != null ? date.toISOString() : null,
        ),
      );
      createMap(
        mapper,
        UpdateArtistDto,
        Artist,
        typeConverter(Date, String, (date) =>
          date != null ? date.toISOString() : null,
        ),
      );
    };
  }
}
