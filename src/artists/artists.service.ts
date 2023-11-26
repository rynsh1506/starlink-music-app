import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { GetArtistDto } from './dto/get-artist.dto';
import { ArtistsStatusEnum, Prisma } from '@prisma/client';
import { PrismaFunction } from 'src/prisma/prisma-function';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly prisma: PrismaService,
    private readonly prismaFunction: PrismaFunction,
  ) {}

  createFilter(queryParam: any) {
    const filterOption = {
      enumField: ['Status'],
    };
    const query = this.prismaFunction.createFilter(queryParam, filterOption);
    return query;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ArtistWhereUniqueInput;
    where?: Prisma.ArtistWhereInput;
    orderBy?: Prisma.ArtistOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    const actualTake = take === -1 ? undefined : take;
    const artist = await this.prisma.artist.findMany({
      skip,
      take: actualTake,
      cursor,
      where,
      orderBy,
    });

    const mapArtists = this.mapper.mapArray(artist, Artist, GetArtistDto);

    const countData = await this.prisma.artist.count({
      where,
    });
    const page = Math.floor(skip / take) + 1;
    const totalPage = take === -1 ? 1 : Math.ceil(countData / take);
    return {
      total_data: countData,
      limit: take,
      page: page,
      page_total: totalPage,
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
      Status: ArtistsStatusEnum.LISTED,
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
      Status: input.Status as ArtistsStatusEnum,
    };

    const createRes = await this.prisma.artist.update({
      where: { id },
      data: inputData,
    });

    return this.mapper.map(createRes, Artist, GetArtistDto);
  }

  async remove(id: string, mode?: string) {
    switch (mode) {
      case 'force':
        await this.prisma.artist.delete({
          where: { id },
        });
        return {
          date: new Date(),
          messages: 'Deleted Successcfully',
        };
      default:
        const deleteRes = await this.prisma.artist.update({
          where: { id },
          data: {
            Status: ArtistsStatusEnum.DELETED,
            DeletedAt: new Date(),
          },
        });
        return this.mapper.map(deleteRes, Artist, GetArtistDto);
    }
  }
}
