import { createServer } from "http";
import { DB } from "./Sequelize/index"; // 导入 DB
import { SERVER_PORT } from "./Config/index";
import { logger } from "./Meddlewear/Logger";
import { createWebSocketServer } from "./WebSocket/index"; // 导入 ws

logger.info("Waiting for start Server... ");

// 初始化 DB
DB.connect();

/** 创建http服务 */
const httpServer = createServer();

/** 初始化 WebSocket */
createWebSocketServer(httpServer);

/** 监听端口 */
httpServer.listen(SERVER_PORT, () => {
  logger.info(`http server is running at: http://localhost:${SERVER_PORT}`);
});
