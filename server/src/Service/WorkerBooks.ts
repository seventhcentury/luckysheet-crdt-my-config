/**
 * Worker Books Service
 */

import { logger } from "../Utils/Logger";
import {
  WorkerBookModel,
  WorkerBookModelType,
} from "../Sequelize/Models/WorkerBook";

// 提供 增删改查接口
async function create(info: WorkerBookModelType) {
  try {
    WorkerBookModel.create(info);
  } catch (error) {
    logger.error(error);
    return null;
  }
}

function update() {}

function del() {}

function findOne() {}

function findAll() {}

export const WorkerBookService = {
  create,
  update,
  delete: del,
  findOne,
  findAll,
};
