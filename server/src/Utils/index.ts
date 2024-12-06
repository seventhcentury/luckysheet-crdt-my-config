import pako from "pako";

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
 *  /?type=luckysheet&userid=1&username=userA&t=111&g=
 * ==> type => luckysheet
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
