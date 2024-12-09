import express from "express";
import routes from "./Router";
import { DB } from "./Sequelize/index"; // 导入 DB
import { logger } from "./Utils/Logger";
import { SERVER_PORT } from "./Config";
import { createWebSocketServer } from "./WebSocket/index"; // 导入 ws
import { WorkerBookService } from "./Service/WorkerBooks";

(async () => {
  logger.info("✨ ");
  logger.info("✨ Server is starting, wait a moment please... ");
  logger.info("✨ ");

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
  WorkerBookService.update({ gridKey: "222", title: "测试修改888" });
  /** 启动测试用例 */
})();
