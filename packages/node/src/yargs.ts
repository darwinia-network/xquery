import { boolean } from 'yargs';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

export const yargsOption = yargs(hideBin(process.argv)).options({
  port: {
    demandOption: false,
    describe: 'service port',
    type: 'number',
    default: 5005,
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
  monitor: {
    demandOption: false,
    describe: 'monitor queue',
    type: 'boolean',
    default: false,
  },
}).argv;