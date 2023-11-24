import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import config from './common/configs/config';
import { loggingMiddleware } from './common/middleware/logging.middleware';
import { ArtistsModule } from './artists/artists.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware(new Logger('PrismaMiddleware'))], // configure your prisma middleware
      },
    }),

    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),

    ArtistsModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
