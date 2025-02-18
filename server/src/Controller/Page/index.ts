import path from "path";
import { Request, Response } from "express";

export function initPages(req: Request, res: Response) {
	res.setHeader("Content-Type", "text/html; charset=utf-8").sendFile(
		path.join(__dirname, "../../../public/dist/entry.html")
	);
}
