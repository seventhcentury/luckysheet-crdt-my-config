/**
 * Worker Books 工作簿模型表
 */

import { DataTypes, Model, Sequelize } from "sequelize";
import WorkerBooks from "./WorkerBooks";

class WorkSheetsModel extends Model {}

// 都需要导出一个 register 方法，用于注册模型
function register(sequelize: Sequelize) {
  WorkSheetsModel.init(
    {
      worker_sheet_id: {
        type: DataTypes.STRING, // 类型
        allowNull: false, // 非空
        comment: "worker sheet id", // 描述
        primaryKey: true, // 主键
        defaultValue: DataTypes.UUIDV4, // 默认使用 uuid 作为 gridKey
      },
      gridKey: {
        type: DataTypes.STRING, // 类型
        allowNull: false, // 非空
        comment: "外键：关联 workerbooks 的 gridKey", // 描述
        // 外键
        references: {
          model: WorkerBooks.WorkerBooksModel,
          key: "gridKey",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "工作表名称",
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "工作表下标序号",
      },
      status: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: "工作表激活状态，仅有一个激活状态的工作表，其他工作表为 0",
      },
      hide: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: "是否隐藏，0为不隐藏，1为隐藏",
        defaultValue: false,
      },
      row: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "行数", // 描述
        defaultValue: 30, // 默认值
      },
      column: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "列数", // 描述
        defaultValue: 24, // 默认值
      },
      defaultRowHeight: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "默认行高",
        defaultValue: 20,
      },
      defaultColWidth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "默认列宽",
        defaultValue: 80,
      },

      // ... 更多字段，根据项目实际情况添加
    },
    {
      sequelize, // 将模型与 Sequelize 实例关联
      tableName: "workersheets", // 直接式提供数据库表名
    }
  );
}

// 都需要导出一个 init 方法，用于初始化模型
async function init() {
  await WorkSheetsModel.sync({ force: true });
}

// 都需要导出一个 delete 方法，用于删除模型
async function del() {
  await WorkSheetsModel.drop();
}

export default { register, init, del, WorkSheetsModel };
