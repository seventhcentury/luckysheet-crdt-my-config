import path from "path";
import express from "express";

/**
 * 初始化静态资源
 */
function initStaticSource(app: express.Application) {
  app.use(express.static(path.resolve(__dirname, "../../public")));
  app.use(express.static(path.resolve(__dirname, "../../public/dist")));
  app.use(express.static(path.resolve(__dirname, "../../public/uploads")));
  app.use(express.static(path.resolve(__dirname, "../../public/dist/assets")));
}

export { initStaticSource };
