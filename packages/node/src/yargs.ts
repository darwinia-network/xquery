import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

export const yargsOption = yargs(hideBin(process.argv)).options({
  port: {
    demandOption: false,
    describe: 'service port',
    type: 'number',
    default: 6000,
  },
  app: {
    demandOption: true,
    describe: 'developer project',
    type: 'string',
    default: '/app',
  },
  schema: {
    demandOption: false,
    describe: 'postgres schema',
    type: 'string',
    default: 'public',
  },
}).argv;
