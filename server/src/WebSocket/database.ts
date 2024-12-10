/**
 * 处理协同数据存储: 更多操作请参考：  https://dream-num.github.io/LuckysheetDocs/zh/guide/operate.html
 *  1. 单个单元格刷新 "t": "v",
 *  2. 范围单元格刷新 "t": "rv"
 *  3. config操作 "t": "cg",
 *  4. 通用保存 "t": "all",
 *  5. 函数链操作 "t": "fc",
 *  6. 行列操作
 *      - 删除行或列  "t": "drc",
 *      - 增加行或列  "t": "arc",
 *  7. 筛选操作
 *      - 清除筛选 "t": "fsc",
 *      - 恢复筛选 "t": "fsr",
 *  8. sheet操作
 *      - 新建sheet  "t": "sha",
 *      - 复制sheet  "t": "shc",
 *      - 删除sheet  "t": "shd",
 *      - 删除sheet后恢复操作  "t": "shre",
 *      - 调整sheet位置  "t": "shr",
 *      - 切换到指定sheet  "t": "shs",
 * 9. sheet属性(隐藏或显示)  "t": "sh", ==> "op": "show" / "hide"
 * 10. 表格信息更改
 *      - 修改工作簿名称  "t": "na",
 * 11. 图表(TODO)
 *
 * 注意一点，对象中的i为当前sheet的index值，而不是order
 */

import { CellDataModelType } from "../Sequelize/Models/CellData";
import { CellDataService } from "../Service/CellData";
import { isEmpty } from "../Utils";
import { logger } from "../Utils/Logger";

// 定义协同操作数据类型
type OperateData = {
  t: string; // 操作类型
  i: string; // 当前sheet的index值，而不是order
  r?: number; // 行号
  c?: number; // 列号
  rc?: string; // 行列号
  op?: string; // 操作类型
  name?: string; // 工作簿名称
  order?: number; // sheet的order值
  v?: {
    ct: {
      //单元格值格式
      fa: string; //格式名称为自动格式
      t: string; //格式类型为数字类型
    };
    v: string | number; //内容的原始值为 233
    m: string | number; //内容的显示值为 233
    bg: string; //背景为 "#f6b26b"
    ff: string | number; // 字体为 "Arial"
    fc: string; //字体颜色为 "#990000"
    bl: number | boolean; //字体加粗
    it: number | boolean; //字体斜体
    fs: number | string; //字体大小为 9px
    cl: number | boolean; //启用删除线
    ht: number; //水平居中
    vt: number; //垂直居中
    tr: number; //文字旋转 -45°
    tb: number; //文本自动换行
    ps: {
      //批注
      left: number; //批注框左边距
      top: number; //批注框上边距
      width: number; //批注框宽度
      height: number; //批注框高度
      value: string; //批注内容
      isshow: boolean; //批注框为显示状态
    };
  }; // 单元格数据
};

/**
 * 数据库操作
 * @param data
 */
export function databaseHandler(data: string) {
  const { t } = JSON.parse(data);
  if (t === "v") v(data);
  // if (t === "rv") rv(item);
  // if (t === "cg") cg(item);
  // if (t === "all") all(item);
  // if (t === "fc") fc(item);
  // if (t === "drc") drc(item);
  // if (t === "arc") arc(item);
  // if (t === "fsc") fsc(item);
  // if (t === "fsr") fsr(item);
  // if (t === "sha") sha(item);
  // if (t === "shc") shc(item);
  // if (t === "shd") shd(item);
  // if (t === "shre") shre(item);
  // if (t === "shr") shr(item);
  //   if (t === "shs") shs(data: OperateData); // 切换到指定 sheet 是前台操作，可不存储数据库
  // if (t === "sh") sh(item);
  // if (t === "na") na(item);
}

/**
 * 单个单元格刷新
 * "t": "v",
 * "i": "Sheet_0554kKiKl4M7_1597974810804",
 * "v": {
 *     "v": 233,
 *     "ct": { "fa": "General", "t": "n" },
 *     "m": "233"
 * },
 * "r": 0,
 * "c": 1
 */
async function v(data: string) {
  // 1. 解析 rc 单元格
  const { t, r, c, v, i } = <OperateData>JSON.parse(data);
  logger.info("[CRDT DATA]:", data);

  // 纠错判断
  if (t !== "v") return logger.error("t is not v.");
  if (isEmpty(i)) return logger.error("i is undefined.");
  if (isEmpty(r) || isEmpty(c)) return logger.error("r or c is undefined.");

  // 场景一：单个单元格插入值
  if (v && v.v && v.m) {
    // 取 v m
    const value = <string>v.v;
    const monitor = <string>v.m;
    const ctfa = v.ct.fa;
    const ctt = v.ct.t;

    // 判断表内是否存在当前记录
    const exist = await CellDataService.hasCellData(i, r, c);
    const info: CellDataModelType = {
      worker_sheet_id: i,
      r,
      c,
      ctfa,
      ctt,
      v: value,
      m: monitor,
    };

    if (exist) {
      // 如果存在则更新
      await CellDataService.updateCellData({
        cell_data_id: exist.cell_data_id,
        ...info,
      });
    } else {
      await CellDataService.createCellData(info); // 如果不存在则创建
    }
  }

  // 场景二：剪切/粘贴到某个单元格 - 会触发两次广播
  // {"t":"v","i":"e73f971d-60....","v":null,"r":10,"c":1}
  // {"t":"v","i":"e73f971d-60....",v":{"r":10,"v":"444","m":"444","f":null,"ct":{"fa":"General","t":"n"}},"r":12,"c":2}
  if (v === null) {
    // 删除该记录
    await CellDataService.deleteCellData(i, r, c);
  }

  // 场景三： 删除单元格内容
  // {"t":"v","i":"e73f971d-606f-4b04-bcf1-98550940e8e3","v":{"cell_data_id":"9e189f9a-cfc3-4208-9849-1563aeccb9c6","r":7,"c":1,},"r":7,"c":1}
  if (v && !v.v && !v.m) {
    // 删除记录
    await CellDataService.deleteCellData(i, r, c);
  }
}

// 范围单元格刷新
async function rv(data: string) {
  console.log("==> rv", data);
}

// config操作
async function cg(data: string) {
  console.log("==> cg", data);
}

// 通用保存
async function all(data: string) {
  console.log("==> all", data);
}

// 函数链操作
async function fc(data: string) {
  console.log("==> fc", data);
}

// 删除行或列
async function drc(data: string) {
  console.log("==> drc", data);
}

// 增加行或列
async function arc(data: string) {
  console.log("==> arc", data);
}

// 清除筛选
async function fsc(data: string) {
  console.log("==> fsc", data);
}

// 恢复筛选
async function fsr(data: string) {
  console.log("==> fsr", data);
}

// 新建sheet
async function sha(data: string) {
  console.log("==> sha", data);
}

// 复制sheet
async function shc(data: string) {
  console.log("==> shc", data);
}

// 删除sheet
async function shd(data: string) {
  console.log("==> shd", data);
}

// 删除sheet后恢复操作
async function shre(data: string) {
  console.log("==> shre", data);
}

// 调整sheet位置
async function shr(data: string) {
  console.log("==> shr", data);
}

// sheet属性(隐藏或显示)
async function sh(data: string) {
  console.log("==> sh", data);
}

// 修改工作簿名称
async function na(data: string) {
  console.log("==> na", data);
}
