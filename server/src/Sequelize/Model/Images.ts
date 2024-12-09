/**
 * Image 图片
 */

import { Model, Sequelize } from "sequelize";

class ImageModel extends Model {}

function Register(sequelize: Sequelize) {
  console.log("==> ", sequelize);
}

export const imageModel = { Register, getModel: () => ImageModel };
