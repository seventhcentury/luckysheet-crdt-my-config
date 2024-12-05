/**
 * 初始化前台 Luckysheet
 */

import { BASE_LUCKYSHEET_OPTIONS } from "./config";

window.onload = initLuckysheet;

function initLuckysheet() {
    const luckysheet = Reflect.get(window, "luckysheet");

    const options = {
        ...BASE_LUCKYSHEET_OPTIONS,
        container: "luckysheetContainer",
    };

    luckysheet.create(options);
}
