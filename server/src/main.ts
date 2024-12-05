import express from "express";
import routes from "./Router";
import { DB } from "./Sequelize/index"; // 导入 DB
import { SERVER_PORT } from "./Config/index";
import { logger } from "./Meddlewear/Logger";
import { createWebSocketServer } from "./WebSocket/index"; // 导入 ws

logger.info("Waiting for start Server... ");

/** 创建http服务 */
const app = express();

/** 初始化路由 */
app.use(routes);

// 连接数据库 DB
DB.connect();

/** 初始化 WebSocket */
createWebSocketServer();

/** 监听端口 */
app.listen(SERVER_PORT, () => {
  logger.info(`http server is running at: http://localhost:${SERVER_PORT}`);
});
