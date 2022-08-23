import Pino from "pino";

declare global {
      const logger: Pino.Logger;
      let handerFiles: Set<string>;
}
