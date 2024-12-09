/**
 * config row/col hiddens model 配置行列隐藏
 */

import { DataTypes, Model, Sequelize } from "sequelize";
import WorkerSheets from "./WorkerSheets";

class ConfigHiddensModel extends Model {}

// 都需要导出一个 register 方法，用于注册模型
function register(sequelize: Sequelize) {
  ConfigHiddensModel.init(
    {
      config_hidden_id: {
        type: DataTypes.STRING, // 类型
        allowNull: false, // 非空
        comment: "config_hidden_id", // 描述
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // 默认使用 uuid 作为 gridKey
      },
      worker_sheet_id: {
        type: DataTypes.STRING, // 类型
        allowNull: false, // 非空
        comment: "外键：关联 workersheet 的 worker_sheet_id", // 描述
        // 外键
        references: {
          model: WorkerSheets.WorkSheetsModel,
          key: "worker_sheet_id",
        },
      },
      hidden_type: {
        type: DataTypes.STRING, // 类型
        allowNull: false, // 非空
        comment: "隐藏类型 row/col", // 描述
      },
      /**
     * 根据下列字段，生成 下列配置对象
     * "rowhidden": {
            "30": 0,
            "31": 0
        }
     */
      row_hidden: {
        type: DataTypes.STRING, // 类型
        allowNull: false, // 非空
        comment: "隐藏的行号", // 描述
      },
    },
    {
      sequelize, // 将模型与 Sequelize 实例关联
      tableName: "ConfigHiddens", // 直接式提供数据库表名
    }
  );
}

// 都需要导出一个 init 方法，用于初始化模型
async function init() {
  await ConfigHiddensModel.sync({ force: true });
}

// 都需要导出一个 delete 方法，用于删除模型
async function del() {
  await ConfigHiddensModel.drop();
}

export default { register, init, del, ConfigHiddensModel };
