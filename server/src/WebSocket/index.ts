import { Server } from "http";
import { WebSocketServer } from "ws";
import { SERVER_PORT } from "../Config";
import { logger } from "../Meddlewear/Logger";

/**
 * 创建 Web Socket 服务
 * @param server http server
 */
export function createWebSocketServer(server: Server) {
  const wsServer = new WebSocketServer({ server });

  logger.info(`ws server is running at: ws://localhost:${SERVER_PORT}`);

  wsServer.on("connection", (client) => {
    console.log("==> user connected");

    client.on("error", console.error);

    client.on("close", () => {});

    client.on("message", (data) => {
      console.log("received: %s", data);
    });
  });
}
