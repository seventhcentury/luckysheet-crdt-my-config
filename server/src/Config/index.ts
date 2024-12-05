/**
 * Luckysheet Crdt Server Configuration
 */

import dayjs from "dayjs";
import path from "path";

// server port
export const SERVER_PORT = 9000;

// ws server port
export const WS_SERVER_PORT = 9090;

// 数据库配置对象 - sequelize
export const SQL_CONFIG = {
  port: 3306,
  host: "127.0.0.1", // localhost or 127.0.0.1
  database: "luckysheet_crdt",
  user: "root",
  password: "root",
};

// 日志配置对象
export const LOGGER_CONFIG = {
  filepath: path.resolve(__dirname, "../../logs"),
  filename: `luckysheet.${dayjs().format("YYYY-MM-DD")}.log`,
};
