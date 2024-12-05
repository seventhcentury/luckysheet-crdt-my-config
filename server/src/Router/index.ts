import express from "express";
const routes = express.Router();

routes.post("/loadLuckysheet", (req, res) => {
  const sheetData = [
    // 重点是需要提供初始化的数据celldata
    {
      name: "Cell",
      index: "sheet_01",
      order: 0,
      status: 1,
      celldata: [
        {
          r: 0,
          c: 0,
          v: { v: "默认数据", m: "111", ct: { fa: "General", t: "n" } },
        },
      ],
    },
  ];
  res.json(JSON.stringify(sheetData));
});

// 模块化的路由，直接调用 routes.use() 即可

export default routes;
