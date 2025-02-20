/**
 * DeepSeek AI 模型训练平台
 *  1. 提供模型训练服务
 *  2. 提供问询服务
 *  3. 提供模型管理服务
 *  4. 提供模型部署服务
 *  5. 提供应答服务
 */

import { Ollama } from "ollama";
import { DEEPSEEKAI_URL } from "../Config";

class DeepSeekAI {
	private ollama: Ollama;
	constructor(host: string) {
		this.ollama = new Ollama({ host });
	}

	// 问询
	async ask(prompt: string) {
		return await this.ollama.chat({
			model: "llama3.1",
			messages: [{ role: "user", content: prompt }],
		});
	}
}

export const deepseekAI = new DeepSeekAI(DEEPSEEKAI_URL);
