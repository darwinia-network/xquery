import { start, localHandeNameSet } from "./worker";
import * as path from "path";
import * as fs from "fs";
import { time } from "console";
import { resolve } from "path";
import { sleep } from "../utils";
import { Worker, workerData } from "worker_threads";
var normalizedPath = path.join(__dirname, "handlers");

fs.readdirSync(normalizedPath).forEach(async function (file: string) {
      const handlers = require("./handlers/" + file);
      const handlerFileName = file.split(".")[0];
      localHandeNameSet.add(handlerFileName);
      start(handlerFileName, handlers);

      // 变量handelrs导出的函数 分析不同函数特征(函数注解) 管理执行，或注入参数等?
      // for (var funName in handlers) {
      //       if (typeof handlers[funName] === "function") {
      //             // 源链消息生成数据的固定函数
      //             // if (funName === "sourcMessage") {
      //             //       handlers[funName]();
      //             // }
      //             start(handlerFileName, funName, handlers);
      //       }
      // }
});
