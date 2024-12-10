import { getURLQuery } from "../Utils";
import { Request, Response } from "express";
import { WORKER_BOOK_INFO } from "../Config";
import { WorkerSheetService } from "../Service/WorkerSheet";
import { CellDataService } from "../Service/CellData";
import { CellDataModelType } from "../Sequelize/Models/CellData";

/**
 * 测试用例
 * @param req
 * @param res
 */
async function demo(req: Request, res: Response) {
  res.json({ code: 200, message: "success" });
}

/**
 * loadLuckysheet 加载数据 - 协同第一步
 * @param req
 * @param res
 * @returns
 */
async function loadLuckysheet(req: Request, res: Response) {
  try {
    const result = [];
    // 1. 解析用户 URL gridkey 参数 || WORKER_BOOK_INFO gridkey
    const gridKey = getURLQuery(req.url, "gridkey") || WORKER_BOOK_INFO.gridKey;

    // 2. 根据 gridKey 查询相关数据，拼接生成 luckysheet 初始数据，进行 luckysheet 初始化
    const sheets = await WorkerSheetService.findAllByGridKey(gridKey);
    if (!sheets || !sheets.length) return;

    // 一个工作簿可能有多个工作表
    for (let i = 0; i < sheets.length; i++) {
      const item = sheets[i].dataValues;
      // 生成基础数据
      const temp = {
        name: item.name,
        index: item.worker_sheet_id, // 注意此字段
        status: item.status,
        order: item.order,
        celldata: <unknown[]>[],
        config: {
          merge: {}, //合并单元格
          rowhidden: {}, //隐藏行
          colhidden: {}, //隐藏列
          borderInfo: {}, //边框
        },
        image: [], //图片
        chart: [], //图表配置
      };

      // 3. 拿到当前 worker sheet id 后，通过查询 celldata 数据，生成 luckysheet 初始数据
      const worker_sheet_id = item.worker_sheet_id;
      const cellDatas = await CellDataService.getCellData(worker_sheet_id);
      cellDatas?.forEach((item) => {
        const data = <CellDataModelType>item.dataValues;
        // 解析 cellData 生成 luckysheet 初始数据
        temp.celldata.push({
          r: data.r,
          c: data.c,
          v: data,
        });
      });

      result.push(temp);
    }

    res.json(JSON.stringify(result));
  } catch (error) {
    console.error(error);
  }
}

export const Controller = { loadLuckysheet, demo };
