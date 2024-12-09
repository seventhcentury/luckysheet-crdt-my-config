import express from "express";
import routes from "./Router";
import { DB } from "./Sequelize/index"; // 导入 DB
import { logger } from "./Utils/Logger";
import { SERVER_PORT } from "./Config";
import { createWebSocketServer } from "./WebSocket/index"; // 导入 ws

(async () => {
  logger.info("✨ Server is starting, wait a moment please... ");

  /** 创建http服务 */
  const app = express();

  // 连接数据库 DB
  await DB.connect();

  /** 初始化路由 */
  app.use(routes);

  /** 监听端口 https://emoji6.com/emojiall/ */
  const server = app.listen(SERVER_PORT);
  logger.info(`✅️ Server is started at http://localhost:${SERVER_PORT} !`);

  /** 初始化 WebSocket - 传入 server 对象 */
  createWebSocketServer(server);

  /** 启动测试用例 */

  /** 启动测试用例 */
})();
