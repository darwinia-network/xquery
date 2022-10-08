# XSCAN

#### 描述

为开发者提供跨链消息关联功能和 graphql 访问存储数据的组件

#### 代码概述

1 package/node
实现核心的业务逻辑功能. 在 src 目录里有如下文件，实现不同功能

```json
 configure :  解析开发者的projec.yaml配置文件，读取需要迁移数据库版本和需要执行的文件
 database:   获取postgres数据库的schema里的表结构，提供给graphql处理
 entrance:  从configure获取开发者定义的数据入口文件，执行文件里handle函数
 graphql:   把postgres数据库里表转为graphql shema类型, 然后加载appollo-server对外提供graphq访问接口。
 queue: 从configure获取开发者定义的队列处理文件，根据文件名创建队列。执行文件里的handler函数
```

2 package/types
定义业务逻辑需要的数据结构，以及提供给开发者使用的数据结构

#### 开发者使用

开发者项目目录结构

```

prisma
   - schema.prisma
src
  - entrance (入口数据)
      - entrance1.ts  // 具体文件名字开发者指定, 可以添加多个entrance文件
  - handler (队列数据)
     - handler1.ts  // 具体文件名字开发者指定, 可以添加多个handler文件
     - handler2.ts
tsconfig.json
package.json
.gitignore
.env  // DATABASE_URL 值
project.yaml  // 组件解析该配置识别prisma迁移的表，获取entrance入口文件里handle函数和队列handler文件里handler函数来执行。
docker-compose.yaml // 包含postgres和redis和xquery-node镜像，使用docker运行时，开发者项目拷贝到xquery-node镜像里，xquery-node启动服务后执行开发者项目配置的入口和队列里的handles函数

```

##### 1 安装 xuqery 包

package.json 里安装 xquery-type 包

```
@darwinia/xquery-type: "^0.1.11"
```

开发者使用其中 IntoQueueCallback 和 QueueHandler 数据类型

QueueHandler 类型 用于队列文件里的 handle 函数作为返回类型，指定数据要传入下一个队列。如下所示:

```typescript

import { QueueHandler } from "@darwinia/xquery-type";


export async function handle(data: unknown): Promise<QueueHandler>{

// ... 业务逻辑
return
		{
                  queueName: "队列名字",  // 传递的队列名字应为project.yaml里queueHandlers字段下配置的文件名字
                  data: msg, // 自定义数据
            };
}
```

IntoQueueCallback 使用在入口文件里的 handle 函数，作为回调参数。指定数据传入某个队列

```typescript

export async function handle(done: IntoQueueCallback) {
// ... 业务逻辑
done("队列名字", msg))
}

```

##### 2 prisma 读写数据库表

组件目前只支持 prisma 来创建数据库和迁移表字段。需要开发者使用 prisma 来读写数据表。首先开发者在 package.json 安装 prisma 相关包

```json
@prisma/client:"^4.2.0"
prisma:"^4.2.0"
```

在项目根目录里定义数据库表 shema.prisma，文件路径在如下所示

```json
/prisma/schema.prisma
```

项目根目录下.env 文件设置 DATABASE_UR 环境变量，注意需要填写开发者实际用到的 postgres 数据库连接地址

```
DATABASE_URL=<connection>
```

执行 prisma 建表命令，后面修改 shema.prisma 里表结构字段，在执行这个命令会自动更新数据库表的结构

```
npx prisma migrate dev --name init
```

##### 3 开发者 project.yaml 配置

配置模板参考如下

```json
name:  demo   # 项目名字
version: 0.0.1   # 版本号,  填固定值0.0.1
dbSchema:     #  prisma
   kind: Prisma
   file: ./prisma/schema.prisma
   migrateVersionName: init   #  迁移数据库表版本名称, 默认是init

entrance:   # 指定入口文件路径
  handlers:
    - file: ./src/entrance/entrance1.ts
queueHandlers: # 指定队列文件路径
   handlers:
    - file: ./src/handlers/handler1.ts  // 文件名字默认为队列名字
    - file: ./src/handlers/handler2.ts
```

##### 4 docker-compose.yml 配置

docker-compose.yml 文件配置如下

```json
version: '3'

services:
  postgres:
   image: postgres:14.1-alpine
   ports:
     - 5432:5432
   environment:
     - POSTGRES_USER=postgres
     - POSTGRES_PASSWORD=postgres
   volumes:
     - .data/postgres:/var/lib/postgresql/data
   healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 1s
      timeout: 3s
      retries: 10
  redis:
    image: redis:alpine
    volumes:
      - .data/redis:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 1s
      timeout: 3s
      retries: 30

  xquery-node:
      image: quay.io/darwinia-network/xquery:sha-47014b1
      ports:
        - 8001:8001
      restart: always
      depends_on:
        postgres:
          condition: service_healthy
        redis:
          condition: service_healthy
      environment:
        REDIS_PORT: 6379
        REDIS_HOST: redis
        REDIS_DB: 0
        DB_USER: postgres
        DB_PASSWORD: postgres
        DB_DATABASE: postgres
        DB_HOST: postgres
        DB_PORT: 5432
        DATABASE_URL: "postgresql://postgres:postgres@postgres/postgres?schema=public"
      volumes:
        - ./:/app
      command:
        - --app=/app
        - --port=8001
        - --monitor=true
```

开发者需要注意环境变量设置，关于 DATABASE_URL 的指定，连接到 postgres 容器。

xquery-node 端口映射 ports 可以修改同时需要修改 command 命令里的 port 值。

运行 docker-compose

```
docker-compose pull && docker-compose up

```

#### xquery 发布

需要发布 xquery-node 镜像和对应的@darwinia/xquery-node 和@darwinia/xquery-type 包。

每次提交代码合并到 framework 分支（该分支还未合并到 master, 但是需要测试修改后的代码功能，在该分支进行发布), 如果需要发布则执行

```shell
yarn  lernaversion
```

更新每个子 packages，就是 node 和 type 的版本.
更新完成后在提交到 framework 分支，然后 git tag <version>加上 tag， 把 tag 推送到 framework 分支，会触发 github 的 work-flow 自动发布镜像和对应的 npm 包。
