/**
 * Image 图片
 */

import { Model, Sequelize, DataTypes } from "sequelize";

export class ImageModel extends Model {
  registerModule(sequelize: Sequelize) {
    ImageModel.init(
      {
        image_id: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
          comment: "图片ID",
        },
      },
      {
        sequelize,
        tableName: "images",
      }
    );
  }
}
