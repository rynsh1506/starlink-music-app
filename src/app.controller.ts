import { Controller, Get, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ArtistsService } from './artists/artists.service';
import { ArtistsStatusEnum } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly artistService: ArtistsService,
  ) {}

  @Get()
  @Render('index')
  async home(@Query() query: any) {
    let where = query.where;
    where = {
      ...where,
      Status: ArtistsStatusEnum.LISTED,
    };
    query = {
      limit: -1,
      ...where,
    };

    const filter = this.artistService.createFilter(query);
    return this.artistService.findAll(filter);
  }

  @Get('deleted')
  @Render('deleted')
  async deletedItemsList(@Query() query: any) {
    let where = query.where;
    where = {
      ...where,
      Status: ArtistsStatusEnum.DELETED,
    };
    query = {
      limit: -1,
      ...where,
    };

    const filter = this.artistService.createFilter(query);
    return this.artistService.findAll(filter);
  }
}
