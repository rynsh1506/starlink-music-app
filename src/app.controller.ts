import { Controller, Get, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ArtistsService } from './artists/artists.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly artistService: ArtistsService,
  ) {}

  @Get()
  @Render('index')
  home(@Query('skip') skip, @Query('take') take = 10) {
    return this.artistService.findAll(+skip, +take);
  }
}
