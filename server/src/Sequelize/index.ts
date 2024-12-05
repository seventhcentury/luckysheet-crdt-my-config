/**
 * 使用 sequelzie 操作数据库
 *  导出唯一实例，需要提供判断数据库连接是否正常的方法
 */


import { Sequelize } from 'sequelize';
import { CONFIG } from "../Config/index";

class MySQL {
    private _connected: boolean = false; // 连接状态
    private _connectStatus: number = 0; /** 目前的连接状态： 0 待连接，1 连接中，2 连接成功，3 连接失败 */
    private _sequelize: Sequelize | null = null; // 连接对象
    private static timeout: number = 1000 * 10; // 超时时间 10s

    constructor() {
        this._connected = false;
        this._connectStatus = 0;
    }

    /**
     * 初始化数据库
     */
    public init() {
        this._connectStatus = 1;

        const { port, host, database, user, password } = CONFIG.SQL_CONFIG;

        // 创建连接
        const URL = `mysql://${user}:${password}@${host}:${port}/${database}`;
        this._sequelize = new Sequelize(URL, { logging: this.logging });

        // 测试连接
        this._sequelize
            .authenticate()
            .then(() => {
                console.log("Connection has been established successfully.");
                this._connected = true;
                this._connectStatus = 2;
            })
            .catch((err: Error) => {
                console.error("Unable to connect to the database:", err);
                this._connected = false;
                this._connectStatus = 3;
            });

        /**
         * 判断是否超时
         */
        const TIMER = setTimeout(() => {
            if (!this._connected && this._connectStatus === 1) {
                console.log("连接超时，请检查数据库连接配置");
                this._connectStatus = 3;
            }
            clearTimeout(TIMER);
        }, MySQL.timeout);
    }

    /**
     * 关闭数据库连接
     */
    public close() {
        if (this._sequelize) {
            this._sequelize.close();
        }
    }

    /**
     * 获取连接状态
     */
    public getConnected(): boolean {
        return this._connected && this._connectStatus === 2;
    }

    /**
     * 日志记录功能
     */
    private logging(sql: string) {
        console.log(sql);
    }
}

export const DB = new MySQL();
