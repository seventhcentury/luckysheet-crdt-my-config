/**
 * Worker Books 工作簿模型表
 */

import { DataTypes, Model, Sequelize } from "sequelize";

class WorkerBooksModel extends Model {}

// 都需要导出一个 register 方法，用于注册模型
function register(sequelize: Sequelize) {
  WorkerBooksModel.init(
    {
      gridKey: {
        type: DataTypes.STRING, // 类型
        allowNull: false, // 非空
        comment: "gridKey", // 描述
        primaryKey: true, // 主键
        defaultValue: DataTypes.UUIDV4, // 默认使用 uuid 作为 gridKey
      },
      title: {
        type: DataTypes.STRING, // 类型
        allowNull: false, // 非空
        comment: "工作簿名称", // 描述
        defaultValue: "未命名工作簿", // 默认值
      },
      lang: {
        type: DataTypes.STRING(10), // 类型
        allowNull: false, // 非空
        comment: "语言", // 描述
        defaultValue: "zh", // zh en
      },
      fileid: {
        type: DataTypes.STRING, // 类型
        allowNull: false, // 非空
        comment: "语言", // 描述
      },
      column: {
        type: DataTypes.INTEGER, // 类型
        allowNull: false, // 非空
        comment: "列数", // 描述
        defaultValue: 20, // 默认值
      },
      row: {
        type: DataTypes.INTEGER, // 类型
        allowNull: false, // 非空
        comment: "行数", // 描述
        defaultValue: 15, // 默认值
      },
      // ... 更多字段，根据项目实际情况添加
    },
    {
      sequelize, // 将模型与 Sequelize 实例关联
      tableName: "WorkerBooks", // 直接式提供数据库表名
    }
  );
}

// 都需要导出一个 init 方法，用于初始化模型
async function init() {
  await WorkerBooksModel.sync({ force: true });
}

// 都需要导出一个 delete 方法，用于删除模型
async function del() {
  await WorkerBooksModel.drop();
}

export default { register, init, del, WorkerBooksModel };
