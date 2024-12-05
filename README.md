<h1 align="center">Luckysheet CRDT</h1>
项目为 Luckysheet 协同增强版（全功能实现），意在提供协同实现思路、数据存储服务、后台服务等。

## 启动
1. 下载依赖: `pnpm install`
2. 启动服务: 
    - 前台服务：`npm run dev`
    - 后台服务：`npm run server`
3. 打开网址：`http://localhost:3000`

## 说明
1. 本项目基于 [Luckysheet](https://github.com/mengshukeji/Luckysheet) 实现，感谢原作者开源。
2. 本项目主要实现协同功能模块，对其他内容无影响。
3. 项目支持 **可选数据库服务**，对没有数据库的用户同样适用。
4. 项目使用 **[Sequelize](https://www.sequelize.cn/)** 作为ORM数据服务技术，支持mysql、sqlite、postgres、mssql等数据库，方便用户快速迁移。
5. 项目使用typescript作为主要开发语言，使用vite作为构建工具，使用pnpm作为依赖管理工具。

## 项目结构说明

```js
- Luckysheet-source-code // 原作者开源项目源码，有些需要二开的功能，都是基于这个打包实现的

- server // 本项目后台服务
    + build // 打包后的文件
    + public // 静态资源
    + src // 项目源码
        + Config // 项目配置文件
        + Meddleware // 中间件
        + Sequelize // 数据库服务
        + Service // 业务逻辑
        + Utils // 工具类
        + WebSocket // websocket服务
        + main.ts // 项目入口文件

- src // 前台服务
    + main.ts // 项目入口文件
```
