/**
 * Luckysheet Crdt Server Configuration
 */

// server port
const SERVER_PORT = 3000;

// 数据库配置对象 - sequelize
const SQL_CONFIG = {
    port: 3306,
    host: "127.0.0.1", // localhost or 127.0.0.1
    database: "luckysheet_crdt",
    user: "root",
    password: "root",
};

export const CONFIG = {
    SERVER_PORT,
    SQL_CONFIG,
};