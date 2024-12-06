import express from "express";
import routes from "./Router";
import { DB } from "./Sequelize/index"; // 导入 DB
import { logger } from "./Meddlewear/Logger";
import { SERVER_PORT } from "./Config/index";
import { createWebSocketServer } from "./WebSocket/index"; // 导入 ws

logger.info("Waiting for start Server... ");

/** 创建http服务 */
const app = express();

/** 初始化路由 */
app.use(routes);

// 连接数据库 DB
DB.connect();

/** 监听端口 */
const server = app.listen(SERVER_PORT, () => {
  logger.info(`http server is running at: http://localhost:${SERVER_PORT}`);
});

/** 初始化 WebSocket - 传入端口 */
createWebSocketServer(server);
