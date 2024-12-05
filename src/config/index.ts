// 导出后台服务地址
export const SERVER_URL = "http://localhost:9000";

// 导出协同服务地址
export const WS_SERVER_URL = "ws://127.0.0.1:9090";

// 导出默认的配置对象
export const BASE_LUCKYSHEET_OPTIONS = {
  showinfobar: false,
  allowUpdate: true,
  loadUrl: "/api/loadLuckysheet", // 初始化 celldata 数据
  updateUrl: WS_SERVER_URL, // 协同服务转发服务
};
