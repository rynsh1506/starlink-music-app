import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { GetArtistDto } from './dto/get-artist.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly prisma: PrismaService,
  ) {}
  async findAll(skip?: number, take?: number) {
    const artist = await this.prisma.artist.findMany({});

    const mapArtists = this.mapper.mapArray(artist, Artist, GetArtistDto);

    const countData = await this.prisma.artist.count();
    // const page = Math.floor(skip / take) + 1;
    // const totalPage = Math.ceil(countData / take);
    return {
      total_data: countData,
      // limit: take,
      // page: page,
      // page_total: totalPage,
      data: mapArtists,
    };
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findFirst({
      where: { id },
    });
    return this.mapper.map(artist, Artist, GetArtistDto);
  }

  async create(createArtistDto: CreateArtistDto) {
    console.log(createArtistDto);
    const input = this.mapper.map(createArtistDto, CreateArtistDto, Artist);

    const inputData: Prisma.ArtistCreateInput = {
      PackageName: input.PackageName,
      ArtistName: input.ArtistName,
      ImageURL: input.ImageURL,
      ReleaseDate: input.ReleaseDate,
      SampleURL: input.SampleURL,
    };

    const createRes = await this.prisma.artist.create({
      data: inputData,
    });

    return this.mapper.map(createRes, Artist, GetArtistDto);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const input = this.mapper.map(updateArtistDto, UpdateArtistDto, Artist);

    const inputData: Prisma.ArtistCreateInput = {
      PackageName: input.ArtistName,
      ArtistName: input.PackageName,
      ImageURL: input.ImageURL,
      ReleaseDate: input.ReleaseDate,
      SampleURL: input.SampleURL,
    };

    const createRes = await this.prisma.artist.update({
      where: { id },
      data: inputData,
    });

    return this.mapper.map(createRes, Artist, GetArtistDto);
  }

  async delete(id: string) {
    const artist = await this.prisma.artist.delete({
      where: { id },
    });

    return this.mapper.map(artist, Artist, GetArtistDto);
  }
}
