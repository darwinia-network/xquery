import { start } from "./worker"
import * as path from 'path';
import * as fs from 'fs';
var normalizedPath = path.join(__dirname, "handlers");

fs.readdirSync(normalizedPath).forEach(function(file: string) {
  const handler = require("./handlers/" + file);
  const handlerName = file.split(".")[0]
  start(handlerName, handler)
});
