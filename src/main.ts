import { WS_SERVER_URL } from "./config";
import "./style/index.css";

window.onload = initLuckysheet;

/**
 * 初始化前台 Luckysheet
 */
function initLuckysheet() {
  const luckysheet = Reflect.get(window, "luckysheet");
  const id = Math.random().toString(16).slice(2, 8);
  const username = `user_${id}`;

  const options = {
    lang: "zh",
    showinfobar: false, // 隐藏顶部的信息栏
    allowUpdate: true, // 配置协同功能
    /**
     * 初始化 celldata 数据
     * 请注意，目前前台仅为展示，并无其他能力，因此加载的是默认协同演示 worker books 数据，gridkey = gridkey_demo
     */
    loadUrl: "/api/loadLuckysheet?gridkey=gridkey_demo",
    updateUrl: `${WS_SERVER_URL}?type=luckysheet&userid=${id}&username=${username}&gridkey=gridkey`, // 协同服务转发服务
    container: "luckysheetContainer",
  };

  luckysheet.create(options);

  console.group("协同客户端用户信息");
  console.log("==> userid", id);
  console.log("==> username", username);
  console.groupEnd();
}
