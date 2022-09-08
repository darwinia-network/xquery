import { Module, Global, DynamicModule } from '@nestjs/common';
import fs from 'fs';
import { UserProjectConifg } from './user.projec.config';
@Global()
@Module({})
export class EntranceModule {
  /**
   * Fetching target handlers from Developer project then dispache  them into
   * entry and queue service.
   * @param appFile Developer project name
   * @returns
   */
  public static register(appFile: string): DynamicModule {
    var stat = fs.statSync(appFile);
    if (stat.isDirectory() == false) {
      process.exit(1);
    }

    const h = async () => {
      return await UserProjectConifg.parse(appFile);
    };

    return {
      module: EntranceModule,
      providers: [
        {
          provide: UserProjectConifg,
          useFactory: h,
        },
      ],
      exports: [UserProjectConifg],
    };
  }
}
