<p align="center">
<img src='/public/logo.svg' />
</p>
<h1 align="center">Luckysheet CRDT</h1>

项目为 Luckysheet 协同增强版（全功能实现），意在提供协同实现思路、数据存储服务、协同演示等。


## 项目说明
1. 本项目基于 [Luckysheet](https://github.com/mengshukeji/Luckysheet) 实现，感谢原作者开源。
2. 本项目主要实现协同功能模块，对其他内容无影响，基于源码修改的部分，均体现在`Luckysheet-source` 文件夹下。
3. 项目支持 **可选数据库服务**，没有数据库的用户数据无法持久化存储，协同功能并不受影响。
4. 项目使用 **[Sequelize](https://www.sequelize.cn/)** 作为ORM数据服务技术，支持mysql、sqlite、postgres、mssql等数据库，方便用户快速迁移。
5. 项目使用 **Typescript** 作为主要开发语言，提供完整的类型提示，规范代码，提高开发效率。


## 命令说明
```bash
"scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    ## Eslint 校验
    "lint": "eslint --fix", 

    ## 启动服务端
    "server": "cd server && npm run start",
    ## 启动服务端开发环境(这个的核心是开发时使用 nodemon 监听文件变化)
    "server:dev": "cd server && npm run dev",
    ## 创建数据库表 - 项目首次执行即可
    "db": "cd server && npm run db",

    ## 安装依赖：安装主项目及服务端项目依赖
    "install": "npm install && cd server && npm install"
}
```


## 项目启动
1. 克隆项目：`git clone https://gitee.com/wfeng0/luckysheet-crdt`
2. 下载依赖: `npm run install`
3. 配置数据库参数，~~如果无数据库服务，请跳过此步骤~~：
```ts
// server/src/Config/index.ts
export const SQL_CONFIG = {
  port: 3306,
  host: "127.0.0.1", // localhost or 127.0.0.1
  database: "luckysheet_crdt",
  user: "root",
  password: "root",
};
```
4. 同步数据库表，~~如果无数据库服务，请跳过此步骤~~：`npm run db`
```ts
1. ⛔️ 请确保数据库配置正确可用
2. ⛔️ 请确保项目执行同步数据库命令 `npm run db`
3. ⛔️ 项目周期只需要执行一次，确保数据库内存在表结构即可。
```
5. 启动服务: 
    - 前台服务：`npm run dev`
    - 后台服务：`npm run server`
6. 打开网址：`http://localhost:5000`


## 项目结构说明

```js
// 原作者开源项目源码
// 修改了源码打包路径，指向项目根路径 public/libs/luckysheet
- Luckysheet-source 

- server // 本项目后台服务
    + public // 静态资源
    + src // 项目源码
        + Config // 项目配置文件：端口、SQL、LOG 等配置
        + Interface // 接口类型文件
        + Meddleware // 中间件
        + Router // 路由文件
        + Sequelize // 数据库服务
            + Models // 数据模型
            + index.ts // 数据库连接
            + synchronization.ts // 数据库表同步脚本
        + Service // 业务逻辑
        + Utils // 工具类
        + WebSocket // websocket服务
            + broadcast.ts // 处理广播消息
            + database.ts // 数据库操作
            + index.ts // websocket服务入口文件
        + main.ts // 项目入口文件

- src // 前台服务
    + axios // axios 网络请求
    + config // 前台项目配置文件
    + style // 前台项目样式文件
    + main.ts // 前台项目主程序
```

## WebSocketServer 参数说明

```ts
import { createServer } from 'https';
import { WebSocketServer } from 'ws';

// 1. 使用 HTTP Server 创建 websocket 服务
const server = createServer(...)
const wss = new WebSocketServer({ server });

// express 框架中，获取 http server 的形式如下：

import express from "express";
const app = express();
const server = app.listen(...);
const wss = new WebSocketServer({ server });

/**
 * app.listen(...) 的实现原理：
 */
 const http = require('http');
 app.listen = function listen() {
   const server = http.createServer(this);
   return server.listen.apply(server, arguments);
 };
```

## 服务端口说明
1. 前台服务端口：`5000`
2. 后台服务端口：`9000`
3. 数据库服务端口：`3306`

```js
// 1. 后台服务端口配置：server/src/Config/index.ts
export const SERVER_PORT = 9000;

// 2. 数据库服务端口配置：server/src/Config/index.ts
export const SQL_CONFIG = {
  port: 3306,
  host: "127.0.0.1", // localhost or 127.0.0.1
  database: "luckysheet_crdt",
  user: "root",
  password: "root",
};

// 3. 前台服务端口配置：src/config/index.ts
// 导出后台服务地址
export const SERVER_URL = "http://localhost:9000";

// 导出协同服务地址
export const WS_SERVER_URL = "ws://127.0.0.1:9000";
```

## 模型修改及同步说明
1. 数据库模型
```ts
// 请规范书写模型文件，规范如下

import { Model, Sequelize, DataTypes, InferAttributes } from "sequelize";

export class XxxModel extends Model {
  // 举例哈，不推荐使用 id 作为字段名
  declare 模型字段: 类型;

  // 初始化模型 - 需要提供静态注册模型方法
  static registerModule(sequelize: Sequelize) {
    XxxModel.init(
      {
        chart_id: { ... 属性定义},
      },
      {
        sequelize,
        tableName: "xxx", // 请显示定义数据库表名
      }
    );
  }
}

// 导出类型
export type XxxModelType = InferAttributes<XxxModel>;

```
1. 同步模型

```ts
// 方式一:
XxxModel.sync(); // 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)

// 方式二:
XxxModel.sync({ force: true }); // 将创建表,如果表已经存在,则将其首先删除

// 方式三:
XxxModel.sync({ alter: true }); // 这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配.
```

## 数据库表模型结构


~~将不再提供 fileid 作为关联文件字段，详细介绍请查阅下列说明：~~

1. luckysheet 数据结构中，并无fileid字段，而是通过 gridKey 关联文件；
2. fileid 字段，是为了用户在系统中关联 excel 文件，实现自定义文件标记；
3. gridkey 字段，是作为官方文件标识，可以自定义文件标识，方便用户查找；
4. 因此，本表设计中，将不再提供 fileid 字段，而是使用 gridKey 字段，实现文件标识关联。

... 请查阅 [WorkerBookModel](/server/src/Sequelize/Models/WorkerBook.ts)

... 请查阅 [WorkerSheetModel](/server/src/Sequelize/Models/WorkerSheet.ts)


... 请查阅 [CellDataModel](/server/src/Sequelize/Models/CellData.ts)

... 请查阅 [ConfigMergeModel](/server/src/Sequelize/Models/ConfigMerge.ts)

... 请查阅 [ConfigBorderModel](/server/src/Sequelize/Models/ConfigBorderInfos.ts)

... 请查阅 [ConfigHiddenModel](/server/src/Sequelize/Models/ConfigHidden.ts)

