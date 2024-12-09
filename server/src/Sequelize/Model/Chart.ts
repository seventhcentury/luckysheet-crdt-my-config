/**
 * 统计图
 */

import { Model, Sequelize, DataTypes } from "sequelize";

export class ChartModel extends Model {
  declare chart_id: string;

  static registerModule(sequelize: Sequelize) {
    ChartModel.init(
      {
        chart_id: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
          comment: "表ID",
        },
      },
      {
        sequelize,
        tableName: "charts",
      }
    );
  }
}
