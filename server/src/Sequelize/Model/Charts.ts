/**
 * 统计图
 */

import { Model, Sequelize } from "sequelize";

class ChartModel extends Model {}

function Register(sequelize: Sequelize) {
  console.log("==> ", sequelize);
}

export const chartModel = { Register, getModel: () => ChartModel };
