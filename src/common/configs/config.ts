import type { Config } from './config.interface';

const config: Config = {
  nest: {
    port: 3035,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'Nestjs FTW',
    description: 'The nestjs API description',
    version: '1.5',
    path: 'api',
  },
};

export default (): Config => config;
