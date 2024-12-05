// 导入 DB
// import { DB } from "./Sequelize/index";

import { SERVER_PORT } from "./Config/index";

// 导入 ws
import { createWebSocketServer } from "./WebSocket/index";

// 初始化 DB
// DB.init();

import { createServer } from "http";

/** 创建http服务 */
const httpServer = createServer();

/** 初始化 WebSocket */
createWebSocketServer(httpServer);

/** 监听端口 */
httpServer.listen(SERVER_PORT, () => {
  console.log(`\nhttp server is running at: http://localhost:${SERVER_PORT}`);
});
