import { Module, Global, DynamicModule } from '@nestjs/common';
import fs from 'fs';
import { Handlers } from './handlers';
@Global()
@Module({})
export class EntranceModule {
  // use logger todo
  /**
   * Fetching target handlers from Developer project then dispache  them into
   * entry and queue service.
   * @param appFile Developer project name
   * @returns
   */
  public static register(appFile: string): DynamicModule {
    var stat = fs.statSync(appFile);
    if (stat.isDirectory() == false) {
      console.log('invalidate path');
      process.exit(1);
    }

    const h = async () => {
      return await Handlers.config(appFile);
    };

    return {
      module: EntranceModule,
      providers: [
        {
          provide: Handlers,
          useFactory: h,
        },
      ],
      exports: [Handlers],
    };
  }
}
