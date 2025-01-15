import { DB } from "../../Sequelize";
import { Request, Response } from "express";
import { WorkerBookService } from "../../Service/WorkerBook";
export async function getWorkerBook(req: Request, res: Response) {
	const gridKey = req.body.gridKey;
	if (!gridKey) {
		res.json({ code: 400, msg: "gridKey 参数缺失" });
		return;
	}

	if (!DB.getConnectState()) {
		res.json({ code: 500, msg: "数据库未连接" });
		return;
	}

	// 根据 gridKey 请求 workerbooks 数据
	const book = await WorkerBookService.findOne(gridKey, {
		attributes: ["gridKey", "title", "lang"],
	});
	res.json({ code: 200, msg: "ok", data: book });
}
