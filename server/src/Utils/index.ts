import pako from "pako";
import { Express } from "express";
import { SERVER_PORT } from "../Config";
import { logger } from "../Meddlewear/Logger";

/**
 * Pako 数据解析
 */
export function unzip(str: string) {
  const chartData = str
    .toString()
    .split("")
    .map((i) => i.charCodeAt(0));

  const binData = new Uint8Array(chartData);

  const data = pako.inflate(binData);

  return decodeURIComponent(
    String.fromCharCode(...Array.from(new Uint16Array(data)))
  );
}

/**
 * 获取 url 的某个 query 值
 * @param { string } url /?type=luckysheet&userid=1&username=userA&t=111&g=
 * @param { string } key type
 * @example type => luckysheet
 * @return { string } query 值
 */
export function getURLQuery(url: string | undefined, key: string) {
  if (!url) return "";
  url = url.replace(/\\?/g, "");
  const queryArr = url.split("&");
  for (let i = 0; i < queryArr.length; i++) {
    const item = queryArr[i];
    const itemArr = item.split("=");
    if (itemArr[0] === key) {
      return itemArr[1];
    }
  }
  return "";
}

/**
 * 封装 app.listen 事件 https://emoji6.com/emojiall/
 */
export function listen(app: Express) {
  const message = `✅️ Server's running at: http://localhost:${SERVER_PORT}`;
  return app.listen(SERVER_PORT, () => logger.info(message));
}
