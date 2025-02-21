import WebSocket from "ws";
import { RawData } from "ws";
import { unzip } from "../../Utils";
import { logger } from "../../Utils/Logger";
import { deepseekAI } from "../../DeepSeek";
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
	try {
		// 1. 进行 pako 解压，将 buffer 转成 可识别 json 字符串
		const data_str = unzip(data.toString());

		// 此处 deepseek 是单例模式，如果为一个单例重复 on 事件，则会触发多次事件，请在 deepseek done 的时候，off 掉事件
		deepseekAI.ask({ prompt: data_str, stream: true });

		deepseekAI.on("deepseek-ai-response", (response) => {
			client.send(JSON.stringify(response));

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			if (response.response.done) {
				deepseekAI.off("deepseek-ai-response");
			}
		});
	} catch (error) {
		// 4. 捕获异常 判断是否为心跳包消息,心跳不处理，异常信息则记录日志
		if (data.toString() !== "rub") logger.error(error);
	}
}

// 发送消息给当前客户端
export function sendMessageToCurrentClient(
	client: CustomWebSocket,
	message: string
) {
	client.send(message);
}
