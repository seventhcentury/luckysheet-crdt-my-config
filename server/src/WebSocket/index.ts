import { Server } from "http";
import { WebSocketServer } from "ws";
import { SERVER_PORT } from "../Config";

export function createWebSocketServer(server: Server) {
  const wsServer = new WebSocketServer({ server });
  console.log(`ws server is running at: ws://localhost:${SERVER_PORT}\n`);

  wsServer.on("connection", (client) => {
    client.on("error", console.error);

    client.on("close", () => {});

    client.on("message", (data) => {
      console.log("received: %s", data);
    });
  });
}
