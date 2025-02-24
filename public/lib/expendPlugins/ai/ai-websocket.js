import pako from "pako";
import locale from "../../locale/locale";
import { refreshChatbox } from "./plugin";
import { getAllSheets } from "../../global/api";
import { AI_getAllSheet } from "./utils";

export class AIWebSocket {
	constructor(name, model, url, messageMode) {
		this.name = name;
		this.model = model;
		this.url = url;
		this.messageMode = messageMode;
		this.websocket = null;
		this.wxErrorCount = 0;

		/**
		 * 聊天内容
		 * role assistant | user
		 * content
		 * uuid
		 */
		this.chatContent = [];

		this.getPrompt()
	}

	getChatContent() {
		return this.chatContent;
	}

	pushChatContent(data) {
		// 解析 uuid
		if (data.uuid) {
			// 找到uuid 拼接 content
			const item = this.chatContent.find(
				(item) => item.uuid === data.uuid
			);
			if (item) {
				item.content += data.content || "\n";
			} else this.chatContent.push(data);
		} else this.chatContent.push(data);
		refreshChatbox(this.chatContent);
	}

	openWebSocket() {
		let _this = this;
		if ("WebSocket" in window) {
			let wxUrl = this.url + "?type=ai&model=" + this.model;
			if (this.url.indexOf("?") > -1) {
				wxUrl = this.url + "&type=ai&model=" + this.model;
			}

			this.websocket = new WebSocket(wxUrl);

			//连接建立时触发
			this.websocket.onopen = () => {
				console.info(locale().websocket.success);

				// 添加一条 AI 提示
				_this.pushChatContent({
					role: "assistant",
					content: `你好，我是你的个人AI助手 - ${this.name} ，你可以向我提问任何问题，或者描述你想要的操作...`,
				});

				_this.wxErrorCount = 0;

				//防止websocket长时间不发送消息导致断连
				_this.retryTimer = setInterval(() => {
					_this.websocket.send("rub");
				}, 60000);
			};

			//客户端接收服务端数据时触发
			this.websocket.onmessage = this.messageHandler.bind(this);

			//通信发生错误时触发
			this.websocket.onerror = () => {
				this.websocket = null;
				this.wxErrorCount++;

				if (this.wxErrorCount > 3) {
					console.error(locale().websocket.refresh);
				} else {
					console.info(locale().websocket.wait);
					// 判断当前的链接状态
					if (this.websocket) return;
					this.openWebSocket();
				}
			};

			//连接关闭时触发
			this.websocket.onclose = (e) => {
				console.info(locale().websocket.close);
				if (e.code === 1000) {
					clearInterval(this.retryTimer);
					this.retryTimer = null;
				} else {
					// 异常关闭连接，需要提供重连机制
					this.wxErrorCount++;

					if (this.wxErrorCount > 3) {
						console.error(locale().websocket.contact);
					} else {
						console.info("连接关闭，正在重试...");
						this.openWebSocket();
					}
				}
			};
		} else {
			console.error(locale().websocket.support);
		}
	}

	closeWebSocket() {
		if (this.websocket == null) return;
		this.websocket.close(1000);
	}

	getPrompt(d) {
		// 获取当前的 所有数据
		const allData = AI_getAllSheet(getAllSheets());
		const prompt = `目前表格的所有数据如下：\n${JSON.stringify(allData)},
		备注：
		1. 行列号均从0开始；
		2. 结果以 markdown 格式返回；
		3. A、B、C... 表示列号；
		4. 1、2、3... 表示行号；
		5. 省去思考过程，请直接给出答案即可
`;
		console.log("==> prompt", prompt);
		return prompt + d
	}

	sendMessage(d) {
		if (!d) return
		if (this.websocket) {
			// message 需要经过压缩
			let msg = pako.gzip(encodeURIComponent(JSON.stringify(this.getPrompt(d))), {
				to: "string",
			});
			this.websocket.send(msg);
		} else {
			console.error("websocket is not open");
		}
	}

	messageHandler(result) {
		// 这里有流式响应需要注意的点 uuid 拼接成完成的语句
		let data = new Function("return " + result.data)();
		const { response, uuid } = data;
		this.pushChatContent({
			role: response.message.role,
			content: response.message.content,
			uuid,
		});
	}
}
