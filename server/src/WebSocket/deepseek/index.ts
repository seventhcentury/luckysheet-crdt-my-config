import WebSocket from "ws";
import { RawData } from "ws";
import { CustomWebSocket } from "../../Interface/WebSocket";

/**
 * 处理 DeepSeek AI WebSocket 消息
 * @param wss 连接池
 * @param client 当前连接对象
 * @param data 发送的数据
 */
export function deepSeekHandler(
	wss: WebSocket.Server,
	client: CustomWebSocket,
	data: RawData
) {
	
}
