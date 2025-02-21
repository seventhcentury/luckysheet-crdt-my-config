/**
 * DeepSeek AI 模型训练平台
 *  1. 提供模型训练服务
 *  2. 提供问询服务
 *  3. 提供模型管理服务
 *  4. 提供模型部署服务
 *  5. 提供应答服务
 */

import { AbortableAsyncIterator, ChatResponse, Ollama } from "ollama";
import { DEEPSEEKAI_URL } from "../Config";
import { EventBus } from "./EventBus";

type DeepSeekAIEventMap = {
	"deepseek-ai-response": (payload: {
		response: AbortableAsyncIterator<ChatResponse> | ChatResponse;
		uuid: string;
	}) => void;
};

class DeepSeekAI extends EventBus<DeepSeekAIEventMap> {
	private ollama: Ollama;
	constructor(host: string) {
		super();
		this.ollama = new Ollama({ host });
	}

	// 问询
	async ask(payload: { prompt: string; stream: boolean }) {
		// 每次问询，都会创建一个当前答案的唯一ID，为 流式响应 答案拼接做处理
		const uuid = Math.random().toString(36).substring(2, 15);
		// 流式读取 stream
		const response = await this.ollama.chat({
			model: "deepseek-r1",
			messages: [{ role: "user", content: payload.prompt }],
			stream: payload.stream || true,
		});

		// 普通响应
		if (!payload.stream) {
			return this.emit("deepseek-ai-response", { response, uuid });
		}

		// 流式响应
		for await (const part of response) {
			this.emit("deepseek-ai-response", { response: part, uuid });
		}
	}
}

export const deepseekAI = new DeepSeekAI(DEEPSEEKAI_URL);
