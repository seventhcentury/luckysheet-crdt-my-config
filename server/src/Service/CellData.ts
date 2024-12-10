import { CellDataModel } from "../Sequelize/Models/CellData";

/**
 * 通过 sheetid 查找当前数据表的单元格数据
 */
async function getCellData(worker_sheet_id: string) {
  try {
    return await CellDataModel.findAll({ where: { worker_sheet_id } });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const CellDataService = {
  getCellData,
};
