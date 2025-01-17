/** 增强 Lucky sheet 图表能力 - 拓展 VChart 插件实现 */
import chartInfo from "../store";
import { replaceHtml, parseDataToPX } from "../utils/chartUtil";
import { getSheetIndex } from "../methods/get";
import { setluckysheet_scroll_status } from "../methods/set";
import {
	showNeedRangeShow,
	setChartMoveableEffect,
	showChartSettingComponent,
	delChart,
	hideAllNeedRangeShow,
} from "../expendPlugins/chart/plugin";
import { mouseposition } from "../global/location";
import { getRangeSplitArray, getRowColCheck } from "../utils/vchart";
import { delVChart } from "../expendPlugins/vchart/plugin";
/**
 * 创建图表
 */
function createVChart(
	sheetIndex,
	chart_id,
	chartData,
	rangeArray,
	rangeTxt,
	width,
	height,
	top,
	left
) {
	let chart_id_c = chart_id + "_c";
	let modelChartShowHTML =
		'<div id="${id}"class="luckysheet-modal-dialog luckysheet-modal-dialog-chart ${addclass}"tabindex="0"role="dialog"aria-labelledby=":41e"dir="ltr"><div class="luckysheet-modal-dialog-resize"><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-lt"data-type="lt"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-mt"data-type="mt"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-lm"data-type="lm"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-rm"data-type="rm"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-rt"data-type="rt"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-lb"data-type="lb"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-mb"data-type="mb"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-rb"data-type="rb"></div></div><div class="luckysheet-modal-dialog-controll"><span class="luckysheet-modal-controll-btn luckysheet-modal-controll-update"role="button"tabindex="0"aria-label="修改图表"title="修改图表"><i class="fa fa-pencil"aria-hidden="true"></i></span><span class="luckysheet-modal-controll-btn luckysheet-modal-controll-max"role="butluckysheet_chartIns_indexton"tabindex="0"aria-label="最大化"title="最大化"><i class="fa fa-window-maximize"aria-hidden="true"></i></span><span class="luckysheet-modal-controll-btn luckysheet-modal-controll-del"role="button"tabindex="0"aria-label="删除"title="删除"><i class="fa fa-trash"aria-hidden="true"></i></span></div><div class="luckysheet-modal-dialog-content">${content}</div></div>';

	let $t = $(
		replaceHtml(modelChartShowHTML, {
			id: chart_id_c,
			addclass: "luckysheet-data-visualization-chart",
			title: "图表生成",
			content: "",
		})
	).appendTo($(".luckysheet-cell-main"));

	// 定义 VChart DOM
	const dom = $(`#${chart_id_c}`).children(
		".luckysheet-modal-dialog-content"
	)[0];

	dom.id = chart_id;

	let container = document.getElementById(chart_id_c);

	/**
	 * ⛔️⛔️⛔️⛔️⛔️⛔️⛔️⛔️
	 *  图表中的 rangeSplitArray  rangeRowCheck  rangeColCheck 这三个数据项，均来之 chartmix.createChart() 方法中生成
	 *  会返回 { chart_json } 数据，内部包含了 三项重要的数据，用于处理高亮显示单元格
	 *  目前的处理方法是通过引用 chartmix 工具类，实现数据获取
	 * ⛔️⛔️⛔️⛔️⛔️⛔️⛔️⛔️
	 */

	const rowColCheck = getRowColCheck(chartData);
	const rangeRowCheck = rowColCheck[0];
	const rangeColCheck = rowColCheck[1];

	// 按照数据范围文字得到具体数据范围
	const rangeSplitArray = getRangeSplitArray(
		chartData,
		rangeArray,
		rangeColCheck,
		rangeRowCheck
	);

	// 获取 vchart 的配置项
	const spec = getVChartOption(rangeSplitArray);

	/**
	 * 合并配置项，生成 sheet file vchart 配置
	 * item ={ width:xxx; chart_id:xxx; chartOptions:{ spec:{...}; rangeArray:[] } }
	 */
	const chartOptions = {
		spec,
		rangeColCheck,
		rangeRowCheck,
		chart_id,
		rangeSplitArray,
		rangeArray,
		rangeTxt,
	};

	const vchart = new VChart.default(spec, { dom });
	vchart.renderSync();

	width = parseDataToPX(width || 400);
	height = parseDataToPX(height || 250);
	left = parseDataToPX(left || 0);
	top = parseDataToPX(top || 0);

	container.style.width = width;
	container.style.height = height;
	container.style.position = "absolute";
	container.style.background = "#fff";
	container.style.left = left;
	container.style.top = top;
	container.style.zIndex = chartInfo.zIndex ? chartInfo.zIndex : 15;
	chartInfo.zIndex++;

	// insert chartinfo
	let sheetFile =
		chartInfo.luckysheetfile[getSheetIndex(chartInfo.currentSheetIndex)];

	if (!sheetFile.chart) sheetFile.chart = [];

	sheetFile.chart.push({
		chartType: "vchart",
		chart_id,
		width,
		height,
		left,
		top,
		sheetIndex: sheetFile.index,
		chartOptions,
	});

	setChartMoveableEffect($t);

	// delete current chart
	$(`#${chart_id}_c .luckysheet-modal-controll-del`).click(function (e) {
		delVChart(chart_id);
	});

	// edit current chart
	$(`#${chart_id}_c .luckysheet-modal-controll-update`).click(function (e) {
		openVChartSetting(vchart);
	});

	// 实现点击图标高亮
	$t.children(".luckysheet-modal-dialog-content").mousedown(function (e) {
		if (!chartInfo.chartparam.luckysheetCurrentChartMaxState) {
			//当前图表显示区域高亮
			showNeedRangeShow(chart_id);
		}
		e.stopPropagation();
	});

	// move chart
	$t.mousedown(function (e) {
		if (!chartInfo.chartparam.luckysheetCurrentChartMaxState) {
			//当前图表显示区域高亮
			showNeedRangeShow(chart_id);
			setluckysheet_scroll_status(true);

			//允许拖动渲染框
			if (
				!$(e.target).is(".luckysheet-modal-dialog-controll") &&
				!$(e.target).is(".luckysheet-modal-controll-btn") &&
				!$(e.target).is("i")
			) {
				// Debounce
				chartInfo.chartparam.luckysheetCurrentChartMoveTimeout =
					setTimeout(function () {
						chartInfo.chartparam.luckysheetCurrentChartMove = true;
					}, 100);
			}

			var toffset =
				chartInfo.chartparam.luckysheetCurrentChartMoveObj.offset();
			var tpsition =
				chartInfo.chartparam.luckysheetCurrentChartMoveObj.position();
			//luckysheetCurrentChartMoveXy: [鼠标点相对chart框的距离X方向，鼠标点相对chart框的距离Y方向，chart框相对cell-main的距离X方向，chart框相对cell-main的距离Y方向，水平滚动条的位置，垂直滚动条的位置]
			chartInfo.chartparam.luckysheetCurrentChartMoveXy = [
				e.pageX - toffset.left,
				e.pageY - toffset.top,
				tpsition.left,
				tpsition.top,
				$("#luckysheet-scrollbar-x").scrollLeft(),
				$("#luckysheet-scrollbar-y").scrollTop(),
			];
			chartInfo.chartparam.luckysheetCurrentChartMoveWinH = $(
				"#luckysheet-cell-main"
			)[0].scrollHeight;
			chartInfo.chartparam.luckysheetCurrentChartMoveWinW = $(
				"#luckysheet-cell-main"
			)[0].scrollWidth;

			if (
				!$(e.target).hasClass("luckysheet-mousedown-cancel") &&
				$(e.target).filter("[class*='sp-palette']").length == 0 &&
				$(e.target).filter("[class*='sp-thumb']").length == 0 &&
				$(e.target).filter("[class*='sp-']").length == 0
			) {
				$("#luckysheet-rightclick-menu").hide();
				$("#luckysheet-cols-h-hover").hide();
				$("#luckysheet-cols-menu-btn").hide();
				$("#luckysheet-rightclick-menu").hide();
				$(
					"#luckysheet-sheet-list, #luckysheet-rightclick-sheet-menu, #luckysheet-user-menu"
				).hide();
				$(
					"body > .luckysheet-filter-menu, body > .luckysheet-filter-submenu, body > .luckysheet-cols-menu"
				).hide();
			}

			e.stopPropagation();
		}
	})
		// resize chart
		.find(".luckysheet-modal-dialog-resize-item")
		.mousedown(function (e) {
			if (chartInfo.chartparam.luckysheetCurrentChartActive) {
				chartInfo.chartparam.luckysheetCurrentChartResize =
					$(this).data("type"); //开始状态resize

				var mouse = mouseposition(e.pageX, e.pageY),
					scrollLeft = $("#luckysheet-scrollbar-x").scrollLeft(),
					scrollTop = $("#luckysheet-scrollbar-y").scrollTop();
				var x = mouse[0] + scrollLeft;
				var y = mouse[1] + scrollTop;
				var position =
					chartInfo.chartparam.luckysheetCurrentChartResizeObj.position();
				//参数：x,y:鼠标位置，$t.width(), $t.height(): chart框宽高， position.left + scrollLeft, position.top + scrollTop ：chart框位置 ，scrollLeft, scrollTop：滚动条位置
				chartInfo.chartparam.luckysheetCurrentChartResizeXy = [
					x,
					y,
					$t.width(),
					$t.height(),
					position.left + scrollLeft,
					position.top + scrollTop,
					scrollLeft,
					scrollTop,
				];
				chartInfo.chartparam.luckysheetCurrentChartResizeWinH = $(
					"#luckysheet-cell-main"
				)[0].scrollHeight;
				chartInfo.chartparam.luckysheetCurrentChartResizeWinW = $(
					"#luckysheet-cell-main"
				)[0].scrollWidth;

				chartInfo.chartparam.luckysheetCurrentChart = chart_id;

				e.stopPropagation();
			}
		});
}

/**
 * 根据 options 创建统计图
 * @param {*} data
 */
function renderVChart(data) {
	const { chart_id, chartData, chartOptions } = data;

	let chart_id_c = chart_id + "_c";

	let modelChartShowHTML =
		'<div id="${id}"class="luckysheet-modal-dialog luckysheet-modal-dialog-chart ${addclass}"tabindex="0"role="dialog"aria-labelledby=":41e"dir="ltr"><div class="luckysheet-modal-dialog-resize"><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-lt"data-type="lt"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-mt"data-type="mt"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-lm"data-type="lm"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-rm"data-type="rm"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-rt"data-type="rt"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-lb"data-type="lb"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-mb"data-type="mb"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-rb"data-type="rb"></div></div><div class="luckysheet-modal-dialog-controll"><span class="luckysheet-modal-controll-btn luckysheet-modal-controll-update"role="button"tabindex="0"aria-label="修改图表"title="修改图表"><i class="fa fa-pencil"aria-hidden="true"></i></span><span class="luckysheet-modal-controll-btn luckysheet-modal-controll-max"role="butluckysheet_chartIns_indexton"tabindex="0"aria-label="最大化"title="最大化"><i class="fa fa-window-maximize"aria-hidden="true"></i></span><span class="luckysheet-modal-controll-btn luckysheet-modal-controll-del"role="button"tabindex="0"aria-label="删除"title="删除"><i class="fa fa-trash"aria-hidden="true"></i></span></div><div class="luckysheet-modal-dialog-content">${content}</div></div>';

	let $t = $(
		replaceHtml(modelChartShowHTML, {
			id: chart_id_c,
			addclass: "luckysheet-data-visualization-chart",
			title: "图表生成",
			content: "",
		})
	).appendTo($(".luckysheet-cell-main"));

	// 设置移动效果
	setChartMoveableEffect($t);

	// 定义 VChart DOM
	const dom = $(`#${chart_id_c}`).children(
		".luckysheet-modal-dialog-content"
	)[0];

	dom.id = chart_id;

	let container = document.getElementById(chart_id_c);

	/**
	 * 创建 vchart 图表 ：
	 * 定义 item ={ width:xxx; chart_id:xxx; chartOptions:{ spec:{...}; rangeArray:[] } }
	 * 后续的图表操作，需要基于创建对象 IVChart 及 ISpec 两个对象
	 */
	const vchart = new VChart.default(chartOptions.spec, {
		dom,
	});
	vchart.renderSync();

	chartInfo.currentChart = chartOptions;
	chartmix.default.insertToStore({ chart_id, chartOptions });

	//处理区域高亮框参数，当前页中，只有当前的图表的needRangShow为true,其他为false
	showNeedRangeShow(chart_id);

	// delete current chart
	$(`#${chart_id}_c .luckysheet-modal-controll-del`).click(function (e) {
		delVChart(chart_id);
	});

	// edit current chart
	$(`#${chart_id}_c .luckysheet-modal-controll-update`).click(function (e) {
		openVChartSetting(vchart);
	});

	// 实现点击图标高亮
	$t.children(".luckysheet-modal-dialog-content").mousedown(function (e) {
		if (!chartInfo.chartparam.luckysheetCurrentChartMaxState) {
			//当前图表显示区域高亮
			showNeedRangeShow(chart_id);
		}
		e.stopPropagation();
	});

	// move chart
	$t.mousedown(function (e) {
		if (!chartInfo.chartparam.luckysheetCurrentChartMaxState) {
			//当前图表显示区域高亮
			showNeedRangeShow(chart_id);
			setluckysheet_scroll_status(true);

			//允许拖动渲染框
			if (
				!$(e.target).is(".luckysheet-modal-dialog-controll") &&
				!$(e.target).is(".luckysheet-modal-controll-btn") &&
				!$(e.target).is("i")
			) {
				// Debounce
				chartInfo.chartparam.luckysheetCurrentChartMoveTimeout =
					setTimeout(function () {
						chartInfo.chartparam.luckysheetCurrentChartMove = true;
					}, 100);
			}

			var toffset =
				chartInfo.chartparam.luckysheetCurrentChartMoveObj.offset();
			var tpsition =
				chartInfo.chartparam.luckysheetCurrentChartMoveObj.position();
			//luckysheetCurrentChartMoveXy: [鼠标点相对chart框的距离X方向，鼠标点相对chart框的距离Y方向，chart框相对cell-main的距离X方向，chart框相对cell-main的距离Y方向，水平滚动条的位置，垂直滚动条的位置]
			chartInfo.chartparam.luckysheetCurrentChartMoveXy = [
				e.pageX - toffset.left,
				e.pageY - toffset.top,
				tpsition.left,
				tpsition.top,
				$("#luckysheet-scrollbar-x").scrollLeft(),
				$("#luckysheet-scrollbar-y").scrollTop(),
			];
			chartInfo.chartparam.luckysheetCurrentChartMoveWinH = $(
				"#luckysheet-cell-main"
			)[0].scrollHeight;
			chartInfo.chartparam.luckysheetCurrentChartMoveWinW = $(
				"#luckysheet-cell-main"
			)[0].scrollWidth;

			if (
				!$(e.target).hasClass("luckysheet-mousedown-cancel") &&
				$(e.target).filter("[class*='sp-palette']").length == 0 &&
				$(e.target).filter("[class*='sp-thumb']").length == 0 &&
				$(e.target).filter("[class*='sp-']").length == 0
			) {
				$("#luckysheet-rightclick-menu").hide();
				$("#luckysheet-cols-h-hover").hide();
				$("#luckysheet-cols-menu-btn").hide();
				$("#luckysheet-rightclick-menu").hide();
				$(
					"#luckysheet-sheet-list, #luckysheet-rightclick-sheet-menu, #luckysheet-user-menu"
				).hide();
				$(
					"body > .luckysheet-filter-menu, body > .luckysheet-filter-submenu, body > .luckysheet-cols-menu"
				).hide();
			}

			e.stopPropagation();
		}
	})
		// resize chart
		.find(".luckysheet-modal-dialog-resize-item")
		.mousedown(function (e) {
			if (chartInfo.chartparam.luckysheetCurrentChartActive) {
				chartInfo.chartparam.luckysheetCurrentChartResize =
					$(this).data("type"); //开始状态resize

				var mouse = mouseposition(e.pageX, e.pageY),
					scrollLeft = $("#luckysheet-scrollbar-x").scrollLeft(),
					scrollTop = $("#luckysheet-scrollbar-y").scrollTop();
				var x = mouse[0] + scrollLeft;
				var y = mouse[1] + scrollTop;
				var position =
					chartInfo.chartparam.luckysheetCurrentChartResizeObj.position();
				//参数：x,y:鼠标位置，$t.width(), $t.height(): chart框宽高， position.left + scrollLeft, position.top + scrollTop ：chart框位置 ，scrollLeft, scrollTop：滚动条位置
				chartInfo.chartparam.luckysheetCurrentChartResizeXy = [
					x,
					y,
					$t.width(),
					$t.height(),
					position.left + scrollLeft,
					position.top + scrollTop,
					scrollLeft,
					scrollTop,
				];
				chartInfo.chartparam.luckysheetCurrentChartResizeWinH = $(
					"#luckysheet-cell-main"
				)[0].scrollHeight;
				chartInfo.chartparam.luckysheetCurrentChartResizeWinW = $(
					"#luckysheet-cell-main"
				)[0].scrollWidth;

				chartInfo.chartparam.luckysheetCurrentChart = chart_id;

				e.stopPropagation();
			}
		});

	// 这里要兼容带单位的宽度和高度，不然会出现位置异常BUG
	let width = parseDataToPX(data.width);
	let height = parseDataToPX(data.height);
	let left = parseDataToPX(data.left);
	let top = parseDataToPX(data.top);

	container.style.width = width;
	container.style.height = height;
	container.style.position = "absolute";
	container.style.background = "#fff";
	container.style.left = left;
	container.style.top = top;
	container.style.zIndex = chartInfo.zIndex ? chartInfo.zIndex : 15;
	chartInfo.zIndex++;
}

/**
 * 更新图表
 */
function updateVChart(data) {
	const { chart_id, chartOptions } = data;
	let { left, top, width, height } = data;

	// 更新 dom 的位置即可
	let chart_id_c = chart_id + "_c";
	let container = document.getElementById(chart_id_c);

	if (left) {
		left = parseDataToPX(left);
		container.style.left = left;
	}
	if (top) {
		top = parseDataToPX(top);
		container.style.top = top;
	}
	if (width) {
		width = parseDataToPX(width);
		container.style.width = width;
	}

	if (height) {
		height = parseDataToPX(height);
		container.style.height = height;
	}

	if (chartOptions) {
		// 更新 options
		// chartInfo.chartparam.renderChart({ chart_id, chartOptions });
	}

	// 宽高变化后，需要重绘
	// chartInfo.resizeChart(chart_id);
}

/**
 * 删除图表
 */
function deleteVChart(chart_id) {
	// delete container
	$(`.luckysheet-cell-main #${chart_id}_c`).remove();

	// Hide selected range
	hideAllNeedRangeShow();

	// delete storage
	let sheetFile =
		chartInfo.luckysheetfile[getSheetIndex(chartInfo.currentSheetIndex)];

	let index = sheetFile.chart.findIndex((item) => item.chart_id == chart_id);
	sheetFile.chart.splice(index, 1);
}

export const vchartController = {
	createVChart,
	renderVChart,
	updateVChart,
	deleteVChart,
};
