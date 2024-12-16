import { logger } from "../Utils/Logger";
import {
  WorkerSheetModel,
  WorkerSheetModelType,
} from "../Sequelize/Models/WorkerSheet";

/**
 * @description: 工作表服务
 */
async function findAll() {
  try {
    return await WorkerSheetModel.findAll();
  } catch (error) {
    logger.error(error);
  }
}

/**
 * 更新相关配置
 */
async function updateName(worker_sheet_id: string, name: string) {
  try {
    return await WorkerSheetModel.update(
      { name },
      {
        where: { worker_sheet_id },
      }
    );
  } catch (error) {
    logger.error(error);
  }
}

/**
 * 通过 gridkey 查找记录
 */
async function findAllByGridKey(gridKey: string) {
  try {
    return await WorkerSheetModel.findAll({ where: { gridKey } });
  } catch (error) {
    logger.error(error);
  }
}

/**
 * 新建 sheet
 */
async function createSheet(data: WorkerSheetModelType) {
  try {
    return await WorkerSheetModel.create(data);
  } catch (error) {
    logger.error(error);
  }
}

export const WorkerSheetService = {
  findAll,
  findAllByGridKey,
  updateName,
  createSheet,
};
