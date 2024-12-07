/**
 * 所有的模型，都需要统一导出管理
 */

import { Sequelize } from "sequelize";
import WorkerBooks from "./WorkerBooks";
import WorkSheets from "./WorkSheets";
import { logger } from "../../Meddlewear/Logger";

// 导出注册模型方法
function registerModel(sequelize: Sequelize) {
  WorkerBooks.register(sequelize);
  WorkSheets.register(sequelize);
}

/**
 * 注意，这里的方法同步表，使用的是强制同步(force: true)，如果表不存在，则创建该表，如果表存在，则先删除，再创建
 *  这种方式同步的模型表，会导致表数据清空，请谨慎使用！！
 */
function initModel() {
  // WorkerBooks.init();
  // WorkSheets.init();
}

/**
 * 模型同步
 *  User.sync() - 如果表不存在,则创建该表(如果已经存在,则不执行任何操作)
 *  User.sync({ force: true }) - 将创建表,如果表已经存在,则将其首先删除
 *  User.sync({ alter: true }) - 这将检查数据库中表的当前状态(它具有哪些列,它们的数据类型等),然后在表中进行必要的更改以使其与模型匹配.
 */
async function syncModel(sequelize: Sequelize) {
  // 1. 初始化模型
  registerModel(sequelize);

  // 2. 同步模型 (非强制同步)
  await sequelize.sync({ alter: true });

  logger.success("所有模型均已成功同步至最新状态.");

  // 注意： 每次执行完系统级模型同步后，都会执行一次自定义初始化模型表方法，如果用户想自定义初始化模型表，请将自定义初始化模型表方法写在自定义初始化模型表方法内部
  initModel();
}

export default { syncModel };
