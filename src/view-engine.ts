import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as exphbs from 'express-handlebars';

export const setViewEngine = (app: NestExpressApplication) => {
  app.useStaticAssets(path.resolve(__dirname, '..', 'public'));
  app.setBaseViewsDir(path.resolve(__dirname, '..', 'views'));

  const hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: path.resolve(__dirname, '..', 'views', 'layouts'),
    helpers,
  });

  app.engine('handlebars', hbs.engine);
  app.setViewEngine('handlebars');
};

const helpers = {
  inc: (val: string) => parseInt(val + 1),
  tts: (val: Date) => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const day = val?.getDate();
    const month = months[val?.getMonth()];
    const year = val?.getFullYear();

    return `${day} ${month} ${year}`;
  },
};
