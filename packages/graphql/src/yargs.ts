import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

export const yargsOption = yargs(hideBin(process.argv)).options({
  port: {
    demandOption: false,
    describe: 'service port',
    type: 'number',
    default: 5004,
  },
  schema: {
    demandOption: false,
    describe: 'postgres schema',
    type: 'string',
    default: 'public',
  },
}).argv;
