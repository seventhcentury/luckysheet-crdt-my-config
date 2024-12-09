/**
 * Worker Books Service
 */

import { logger } from "../Utils/Logger";
import {
  WorkerBookModel,
  WorkerBookModelType,
} from "../Sequelize/Models/WorkerBook";

/**
 * 新增 workerBooks 记录
 * @param info WorkerBookModelType
 * @returns
 */
async function create(info: WorkerBookModelType) {
  try {
    return await WorkerBookModel.create(info);
  } catch (error) {
    logger.error(error);
    return null;
  }
}

/**
 * 更新 workerBooks 记录
 */
async function update(info: WorkerBookModelType) {
  const { gridKey, title, lang } = info;
  try {
    return await WorkerBookModel.update(
      { title, lang },
      { where: { gridKey } }
    );
  } catch (error) {
    logger.error(error);
  }
}

/**
 * 删除 workerBooks 记录 - 注意：该表有外键关联，如果删除记录可能会导致其他业务表有问题，因此，提供 stage 参数，标记记录是否可用
 */
async function del() {}

/**
 * 查询 workerBooks 记录
 */
async function findOne(gridKey: string) {
  try {
    return await WorkerBookModel.findOne({ where: { gridKey } });
  } catch (error) {
    console.error(error);
  }
}

/**
 * 查询 workerBooks 记录列表
 */
async function findAll() {
  try {
    return await WorkerBookModel.findAll();
  } catch (error) {
    console.error(error);
  }
}

export const WorkerBookService = {
  create,
  update,
  delete: del,
  findOne,
  findAll,
};
