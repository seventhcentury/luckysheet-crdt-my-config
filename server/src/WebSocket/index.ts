import { WebSocketServer } from "ws";
import { WS_SERVER_PORT } from "../Config";
import { logger } from "../Meddlewear/Logger";

/**
 * 创建 Web Socket 服务
 */
export function createWebSocketServer() {
  const wsServer = new WebSocketServer({ port: WS_SERVER_PORT });

  logger.info(`ws server is running at: ws://localhost:${WS_SERVER_PORT}`);

  wsServer.on("connection", (client) => {
    console.log("==> user connected");

    client.on("error", console.error);

    client.on("close", () => {});

    client.on("message", (data) => {
      console.log("received: %s", data);
    });
  });
}
