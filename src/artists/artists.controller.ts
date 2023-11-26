import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  async findAll(@Query() query: any) {
    const filter = this.artistsService.createFilter(query);
    return this.artistsService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.artistsService.findOne(id);
  }

  @Post()
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistsService.create(createArtistDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtisDto: UpdateArtistDto) {
    return this.artistsService.update(id, updateArtisDto);
  }

  @Delete(':id/:mode?')
  remove(@Param('id') id: string, @Param('mode') mode?: string) {
    return this.artistsService.remove(id, mode);
  }
}
