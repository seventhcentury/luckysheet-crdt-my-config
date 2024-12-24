/**
 * 拓展 VChart 统计图
 */
import { seriesLoadScripts, loadLinks, } from '../../utils/util'
import { generateRandomKey, replaceHtml, parseDataToPX } from '../../utils/chartUtil'
import chartInfo from '../../store'
import { getSheetIndex, getRangetxt, getvisibledatacolumn, getvisibledatarow } from '../../methods/get'
import { chart_selection } from '../chart/plugin'
import { setluckysheet_scroll_status } from '../../methods/set'
import { getdatabyselection, getcellvalue } from '../../global/getdata';
import {
    luckysheetMoveHighlightCell,
    luckysheetMoveHighlightCell2,
    luckysheetMoveHighlightRange,
    luckysheetMoveHighlightRange2,
    luckysheetMoveEndCell
} from '../../controllers/sheetMove';
import { rowLocation, colLocation, mouseposition } from '../../global/location'
import locale from '../../locale/locale';


const dependScripts = [
    'expendPlugins/libs/vchart.min.js',
]
const dependLinks = [
    'expendPlugins/vchart/vchart.css',
]

/**
 * 注册 vchart
 * @param {*} data 整个 worker books data 
 * @param {*} isDemo 
 */
function vchart(data, isDemo) {
    // setTimeout(() => {
    //     openVChartSetting()
    // }, 100);
    // 加载 css
    loadLinks(dependLinks);

    // 加载 js 依赖
    seriesLoadScripts(dependScripts, null, () => {
        console.group("vchart 加载完成");
        console.groupEnd();

        chartInfo.chart_selection = chart_selection()


        // Initialize the rendering vchart
        for (let i = 0; i < data.length; i++) {
            renderVCharts(data[i].vchart, isDemo)
        }

        // for (let i = 0; i < data.length; i++) {
        //     if (data[i].status == '1') {
        //         renderChartShow(data[i].index)
        //     }
        // }
    })
}

/**
 * 渲染图表
 */
function renderVCharts(vchartList, isDemo) {
    // no chart
    if (vchartList == undefined) return

    for (let i = 0; i < vchartList.length; i++) {
        let vchartItem = vchartList[i]

        let chart_id = vchartItem.chart_id
        let chart_id_c = chart_id + '_c'

        let modelChartShowHTML =
            '<div id="${id}"class="luckysheet-modal-dialog luckysheet-modal-dialog-chart ${addclass}"tabindex="0"role="dialog"aria-labelledby=":41e"dir="ltr"><div class="luckysheet-modal-dialog-resize"><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-lt"data-type="lt"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-mt"data-type="mt"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-lm"data-type="lm"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-rm"data-type="rm"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-rt"data-type="rt"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-lb"data-type="lb"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-mb"data-type="mb"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-rb"data-type="rb"></div></div><div class="luckysheet-modal-dialog-controll"><span class="luckysheet-modal-controll-btn luckysheet-modal-controll-update"role="button"tabindex="0"aria-label="修改图表"title="修改图表"><i class="fa fa-pencil"aria-hidden="true"></i></span><span class="luckysheet-modal-controll-btn luckysheet-modal-controll-max"role="butluckysheet_chartIns_indexton"tabindex="0"aria-label="最大化"title="最大化"><i class="fa fa-window-maximize"aria-hidden="true"></i></span><span class="luckysheet-modal-controll-btn luckysheet-modal-controll-del"role="button"tabindex="0"aria-label="删除"title="删除"><i class="fa fa-trash"aria-hidden="true"></i></span></div><div class="luckysheet-modal-dialog-content">${content}</div></div>'

        let $t = $(
            replaceHtml(modelChartShowHTML, {
                id: chart_id_c,
                addclass: 'luckysheet-data-visualization-chart',
                title: '图表生成',
                content: ''
            })
        ).appendTo($('.luckysheet-cell-main'))

        // 设置移动效果
        setChartMoveableEffect($t);

        // 定义 VChart DOM
        const dom = $(`#${chart_id_c}`).children('.luckysheet-modal-dialog-content')[0]
        dom.id = chart_id

        let container = document.getElementById(chart_id_c)

        // 创建 vchart 图表
        const vchart = new VChart.default(vchartItem.chartOptions, { dom });
        vchart.renderSync()

        //处理区域高亮框参数，当前页中，只有当前的图表的needRangShow为true,其他为false
        showNeedRangeShow(chart_id);

        // delete current chart
        $(`#${chart_id}_c .luckysheet-modal-controll-del`).click(function (e) {
            delChart(chart_id)
        })

        // edit current chart
        $(`#${chart_id}_c .luckysheet-modal-controll-update`).click(function (e) {
            openVChartSetting()
        })

        // 实现点击图标高亮
        $t.children('.luckysheet-modal-dialog-content').mousedown(function (e) {
            if (!chartInfo.chartparam.luckysheetCurrentChartMaxState) {
                //当前图表显示区域高亮
                showNeedRangeShow(chart_id);
            }
            e.stopPropagation()
        })


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
                    chartInfo.chartparam.luckysheetCurrentChartMoveTimeout = setTimeout(
                        function () {
                            chartInfo.chartparam.luckysheetCurrentChartMove = true;
                        },
                        100
                    );
                }

                var toffset = chartInfo.chartparam.luckysheetCurrentChartMoveObj.offset();
                var tpsition = chartInfo.chartparam.luckysheetCurrentChartMoveObj.position();
                //luckysheetCurrentChartMoveXy: [鼠标点相对chart框的距离X方向，鼠标点相对chart框的距离Y方向，chart框相对cell-main的距离X方向，chart框相对cell-main的距离Y方向，水平滚动条的位置，垂直滚动条的位置]
                chartInfo.chartparam.luckysheetCurrentChartMoveXy = [
                    e.pageX - toffset.left,
                    e.pageY - toffset.top,
                    tpsition.left,
                    tpsition.top,
                    $("#luckysheet-scrollbar-x").scrollLeft(),
                    $("#luckysheet-scrollbar-y").scrollTop()
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
                    chartInfo.chartparam.luckysheetCurrentChartResize = $(this).data("type"); //开始状态resize

                    var mouse = mouseposition(e.pageX, e.pageY),
                        scrollLeft = $("#luckysheet-scrollbar-x").scrollLeft(),
                        scrollTop = $("#luckysheet-scrollbar-y").scrollTop();
                    var x = mouse[0] + scrollLeft;
                    var y = mouse[1] + scrollTop;
                    var position = chartInfo.chartparam.luckysheetCurrentChartResizeObj.position();
                    //参数：x,y:鼠标位置，$t.width(), $t.height(): chart框宽高， position.left + scrollLeft, position.top + scrollTop ：chart框位置 ，scrollLeft, scrollTop：滚动条位置
                    chartInfo.chartparam.luckysheetCurrentChartResizeXy = [
                        x,
                        y,
                        $t.width(),
                        $t.height(),
                        position.left + scrollLeft,
                        position.top + scrollTop,
                        scrollLeft,
                        scrollTop
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
            })

        // 这里要兼容带单位的宽度和高度，不然会出现位置异常BUG
        let width = parseDataToPX(vchartItem.width)
        let height = parseDataToPX(vchartItem.height)
        let left = parseDataToPX(vchartItem.left)
        let top = parseDataToPX(vchartItem.top)

        container.style.width = width
        container.style.height = height
        container.style.position = 'absolute'
        container.style.background = '#fff'
        container.style.left = left
        container.style.top = top
        container.style.zIndex = chartInfo.zIndex ? chartInfo.zIndex : 15
        chartInfo.zIndex++

    }
}

/**
 * 创建图表
 */
function createVChart(width, height, left, top,) {

    // 需要解析生成 vchart 特有的配置对象

    // 获取用户选区
    var jfgird_select_save = luckysheet.getluckysheet_select_save();

    // 如果只选中一个选区，则直接返回
    if (
        jfgird_select_save.length == 1 &&
        jfgird_select_save[0].row[0] == jfgird_select_save[0].row[1] &&
        jfgird_select_save[0].column[0] == jfgird_select_save[0].column[1]
    ) return

    // ------------- start -------------
    var shiftpositon_row = -1;

    var row_ed =
        jfgird_select_save[0]["row"][1] - jfgird_select_save[0]["row"][0];

    // row getcellvalue
    for (
        var r = jfgird_select_save[0]["row"][0];
        r <= jfgird_select_save[0]["row"][1];
        r++
    ) {
        for (
            var c = jfgird_select_save[0]["column"][0];
            c <= jfgird_select_save[0]["column"][1];
            c++
        ) {
            var value = getcellvalue(r, c, luckysheet.flowdata());
            //console.log("value,r,c",value,r,c);
            if (value != null && value.toString().length > 0) {
                shiftpositon_row = r;
                break;
            }
        }

        if (shiftpositon_row !== -1) {
            break;
        }
    }
    if (shiftpositon_row == -1) {
        shiftpositon_row = 0;
    }

    jfgird_select_save[0]["row"] = [shiftpositon_row, shiftpositon_row];
    jfgird_select_save[0].row_focus = shiftpositon_row;
    luckysheet.setluckysheet_select_save(jfgird_select_save);

    chartInfo.luckysheet_shiftpositon = $.extend(true, {}, jfgird_select_save[0]);
    luckysheetMoveEndCell("down", "range", false, row_ed);
    jfgird_select_save = luckysheet.getluckysheet_select_save();

    // col getcellvalue

    var shiftpositon_col = -1;
    var column_ed =
        jfgird_select_save[0]["column"][1] - jfgird_select_save[0]["column"][0];

    for (
        var c = jfgird_select_save[0]["column"][0];
        c <= jfgird_select_save[0]["column"][1];
        c++
    ) {
        for (
            var r = jfgird_select_save[0]["row"][0];
            r <= jfgird_select_save[0]["row"][1];
            r++
        ) {
            var value = getcellvalue(r, c, luckysheet.flowdata());
            if (value != null && value.toString().length > 0) {
                shiftpositon_col = c;
                break;
            }
        }

        if (shiftpositon_col !== -1) {
            break;
        }
    }

    if (shiftpositon_col == -1) {
        shiftpositon_col = 0;
    }

    jfgird_select_save[0]["column"] = [shiftpositon_col, shiftpositon_col];
    jfgird_select_save[0].column_focus = shiftpositon_col;
    luckysheet.setluckysheet_select_save(jfgird_select_save);
    chartInfo.luckysheet_shiftpositon = $.extend(true, {}, jfgird_select_save[0]);
    luckysheetMoveEndCell("right", "range", false, column_ed);
    jfgird_select_save = luckysheet.getluckysheet_select_save()

    //   获取 rangeArray
    var rangeArray = $.extend(true, [], jfgird_select_save);
    var rangeTxt = getRangetxt(chartInfo.currentSheetIndex, rangeArray[0], chartInfo.currentSheetIndex)
    let chartData = getdatabyselection()

    // 数据处理完成，准备创建统计图
    let chart_id = generateRandomKey('chart')
    let chart_id_c = chart_id + '_c'
    let modelChartShowHTML =
        '<div id="${id}"class="luckysheet-modal-dialog luckysheet-modal-dialog-chart ${addclass}"tabindex="0"role="dialog"aria-labelledby=":41e"dir="ltr"><div class="luckysheet-modal-dialog-resize"><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-lt"data-type="lt"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-mt"data-type="mt"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-lm"data-type="lm"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-rm"data-type="rm"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-rt"data-type="rt"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-lb"data-type="lb"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-mb"data-type="mb"></div><div class="luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-rb"data-type="rb"></div></div><div class="luckysheet-modal-dialog-controll"><span class="luckysheet-modal-controll-btn luckysheet-modal-controll-update"role="button"tabindex="0"aria-label="修改图表"title="修改图表"><i class="fa fa-pencil"aria-hidden="true"></i></span><span class="luckysheet-modal-controll-btn luckysheet-modal-controll-max"role="butluckysheet_chartIns_indexton"tabindex="0"aria-label="最大化"title="最大化"><i class="fa fa-window-maximize"aria-hidden="true"></i></span><span class="luckysheet-modal-controll-btn luckysheet-modal-controll-del"role="button"tabindex="0"aria-label="删除"title="删除"><i class="fa fa-trash"aria-hidden="true"></i></span></div><div class="luckysheet-modal-dialog-content">${content}</div></div>'

    let $t = $(
        replaceHtml(modelChartShowHTML, {
            id: chart_id_c,
            addclass: 'luckysheet-data-visualization-chart',
            title: '图表生成',
            content: ''
        })
    ).appendTo($('.luckysheet-cell-main'))

    // 定义 VChart DOM
    const dom = $(`#${chart_id_c}`).children('.luckysheet-modal-dialog-content')[0]
    dom.id = chart_id

    let container = document.getElementById(chart_id_c)

    /**
     * ⛔️⛔️⛔️⛔️⛔️⛔️⛔️⛔️
     * **** 请注意  ****
     *  图表中的 rangeSplitArray、 rangeRowCheck、 rangeColCheck 这三个数据项，均来之 chartmix.createChart() 方法中生成
     *  会返回 { chart_json } 数据，内部包含了 三项重要的数据，用于处理高亮显示单元格
     * ⛔️⛔️⛔️⛔️⛔️⛔️⛔️⛔️
     */
    const { chart_json } = chartmix.default.createChart(dom, chartData, chart_id, rangeArray, rangeTxt)
    const { rangeColCheck, rangeConfigCheck, rangeRowCheck, rangeSplitArray } = chart_json.chartOptions

    // 清空容器，重新渲染
    dom.innerHTML = ''

    // 获取 vchart 的配置项
    const vchartOption = getVChartOption(rangeSplitArray)

    /**
     * 合并配置项
     */
    const chartOptions = {
        ...vchartOption, rangeColCheck, rangeConfigCheck, rangeRowCheck,
        chart_id, rangeSplitArray, rangeArray, rangeTxt
    }

    const vchart = new VChart.default(chartOptions, { dom });
    vchart.renderSync()


    width = parseDataToPX(width || 400)
    height = parseDataToPX(height || 250)
    left = parseDataToPX(left || 0)
    top = parseDataToPX(top || 0)

    container.style.width = width
    container.style.height = height
    container.style.position = 'absolute'
    container.style.background = '#fff'
    container.style.left = left
    container.style.top = top
    container.style.zIndex = chartInfo.zIndex ? chartInfo.zIndex : 15
    chartInfo.zIndex++

    // insert chartinfo
    let sheetFile = chartInfo.luckysheetfile[getSheetIndex(chartInfo.currentSheetIndex)];

    if (!sheetFile.vchart) {
        sheetFile.vchart = [];
    }
    sheetFile.vchart.push({
        chart_id,
        width,
        height,
        left,
        top,
        sheetIndex: sheetFile.index,
        chartOptions
    })

    setChartMoveableEffect($t);

    // delete current chart
    $(`#${chart_id}_c .luckysheet-modal-controll-del`).click(function (e) {
        delChart(chart_id)
    })

    // edit current chart
    $(`#${chart_id}_c .luckysheet-modal-controll-update`).click(function (e) {
        openVChartSetting()
    })

    // 实现点击图标高亮
    $t.children('.luckysheet-modal-dialog-content').mousedown(function (e) {
        if (!chartInfo.chartparam.luckysheetCurrentChartMaxState) {
            //当前图表显示区域高亮
            showNeedRangeShow(chart_id);
        }
        e.stopPropagation()
    })


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
                chartInfo.chartparam.luckysheetCurrentChartMoveTimeout = setTimeout(
                    function () {
                        chartInfo.chartparam.luckysheetCurrentChartMove = true;
                    },
                    100
                );
            }

            var toffset = chartInfo.chartparam.luckysheetCurrentChartMoveObj.offset();
            var tpsition = chartInfo.chartparam.luckysheetCurrentChartMoveObj.position();
            //luckysheetCurrentChartMoveXy: [鼠标点相对chart框的距离X方向，鼠标点相对chart框的距离Y方向，chart框相对cell-main的距离X方向，chart框相对cell-main的距离Y方向，水平滚动条的位置，垂直滚动条的位置]
            chartInfo.chartparam.luckysheetCurrentChartMoveXy = [
                e.pageX - toffset.left,
                e.pageY - toffset.top,
                tpsition.left,
                tpsition.top,
                $("#luckysheet-scrollbar-x").scrollLeft(),
                $("#luckysheet-scrollbar-y").scrollTop()
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
                chartInfo.chartparam.luckysheetCurrentChartResize = $(this).data("type"); //开始状态resize

                var mouse = mouseposition(e.pageX, e.pageY),
                    scrollLeft = $("#luckysheet-scrollbar-x").scrollLeft(),
                    scrollTop = $("#luckysheet-scrollbar-y").scrollTop();
                var x = mouse[0] + scrollLeft;
                var y = mouse[1] + scrollTop;
                var position = chartInfo.chartparam.luckysheetCurrentChartResizeObj.position();
                //参数：x,y:鼠标位置，$t.width(), $t.height(): chart框宽高， position.left + scrollLeft, position.top + scrollTop ：chart框位置 ，scrollLeft, scrollTop：滚动条位置
                chartInfo.chartparam.luckysheetCurrentChartResizeXy = [
                    x,
                    y,
                    $t.width(),
                    $t.height(),
                    position.left + scrollLeft,
                    position.top + scrollTop,
                    scrollLeft,
                    scrollTop
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
        })

    console.groupEnd();


}


/**
 * 删除图表
 */
function delChart(chart_id,) {
    // delete container
    $(`.luckysheet-cell-main #${chart_id}_c`).remove()

    // Hide selected range
    hideAllNeedRangeShow()

    // delete storage
    let sheetFile = chartInfo.luckysheetfile[getSheetIndex(chartInfo.currentSheetIndex)]
    let index = sheetFile.vchart.findIndex(item => item.chart_id == chart_id)
    sheetFile.vchart.splice(index, 1)
}


/**
 * 根据传入的 rangeArray 创建 VChart 配置项
 */
function getVChartOption(rangeArray,) {
    const { coltitle, rowtitle, title, content, range } = rangeArray

    // 根据真实用户选取数据生成 data
    // 多个系列是通过 x 轴进行循环
    const options = {
        title: {
            // text: title
        },
        data: [{ values: [] }],
        type: ['line', 'bar'][Math.floor(Math.random() * 2)],
        xField: 'key',
        yField: 'value',
    }

    /**
     * 下列所有的索引都是基于 range 的索引，因此，还需要处理索引
     */
    if (rangeArray.type === "contentonly") {
        console.log("==> contentonly 异常");
    }
    else if (rangeArray.type === "topbottom") {
        // 上下数据结构，则 rowtitle 为x轴，content 即为y轴，也为值
        // 不需要判断，就是固定了 row 相同
        if (rowtitle && content) {
            // 1. 取行
            const rowtitle_row = rowtitle.row[0]
            const content_row = content.row[0]
            const len = rowtitle.column[1] - rowtitle.column[0]
            // 2. 循环
            for (let i = 0; i <= len; i++) {
                // 此时，需要处理轴线与值类型
                const xvalue = getcellvalue(range.row[0] + rowtitle_row, range.column[0] + i, luckysheet.flowdata());
                const yvalue = getcellvalue(range.row[0] + content_row, range.column[0] + i, luckysheet.flowdata());
                options.data[0].values.push({ key: xvalue, value: yvalue })
            }
        }
    }
    else if (rangeArray.type === "leftright") {
        // 左右数据结构，则 coltitle 为x轴，content 即为y轴，也为值
        if (coltitle && content) {
            // 1. 取列
            const coltitle_col = coltitle.column[0]
            const content_col = content.column[0]
            const len = coltitle.row[1] - coltitle.row[0]
            // 2. 循环
            for (let i = 0; i <= len; i++) {
                // 此时，需要处理轴线与值类型
                const xvalue = getcellvalue(range.row[0] + i, range.column[0] + coltitle_col, luckysheet.flowdata());
                const yvalue = getcellvalue(range.row[0] + i, range.column[0] + content_col, luckysheet.flowdata());
                options.data[0].values.push({ key: xvalue, value: yvalue })
            }

        }
    }
    else if (rangeArray.type === "normal") {
        // 定义数据项
        // 上下左右数据结构，则 rowtitle 为x轴，coltitle 为y轴，content 即为值
        const rowtitle_row = rowtitle.row[0]
        const coltitle_col = coltitle.column[0]

        // 使用数据集即可处理多系列问题
        // { type: 'Autocracies', year: '1930', value: 129 },
        // { type: 'Autocracies', year: '1940', value: 133 },
        const rclen = rowtitle.column[1] - rowtitle.column[0]
        const cclen = coltitle.row[1] - coltitle.row[0]
        for (let i = 1; i <= rclen + 1; i++) { // 0-7 此时可以确认 Mon	Tues	Wed	    Thur	Fri	Sat	Sun
            // 此时可以唯一确定 type year value 三个值

            // 1. xAxis 固定 col = coltitle_col
            const xAxis = getcellvalue(range.row[0] + rowtitle_row, range.column[0] + i, luckysheet.flowdata());
            for (let j = 1; j <= cclen + 1; j++) {
                // 循环列
                // 2. series 固定 row = rowtitle_row
                const series = getcellvalue(range.row[0] + j, range.column[0] + coltitle_col, luckysheet.flowdata());
                // 3. value
                const value = getcellvalue(range.row[0] + j, range.column[0] + i, luckysheet.flowdata());
                options.data[0].values.push({ xAxis, series, value })
            }
        }
        // 修正 xField yField
        options.xField = ['series', 'xAxis',];
        options.yField = 'value';
        options.seriesField = 'xAxis';
    }




    return options
}

/**
 * 设置图表可拖动区域高亮效果，鼠标经过可拖动区域时鼠标显示“十字”，不可拖动区域显示箭头
 */
function setChartMoveableEffect($container) {
    $container.find('.luckysheet-modal-dialog-content').hover(function () {
        $container.removeClass("chart-moveable");
    }, function () {
        $container.addClass("chart-moveable");
    });

    $container.hover(function () {
        $container.addClass("chart-moveable");
    }, function () {
        $container.removeClass("chart-moveable");
    });
}

/**
 * 设置某个图表的高亮区域状态为显示,处理当前页的所有图表，只取一个图表设置为显示，其他隐藏，其他页不管
 */
function showNeedRangeShow(chart_id) {
    let chartLists = chartInfo.luckysheetfile[getSheetIndex(chartInfo.currentSheetIndex)].vchart;
    for (let chartId in chartLists) {
        //当前sheet的图表先设置为false
        chartLists[chartId].needRangeShow = false
        if (chartLists[chartId].chart_id == chart_id) {
            chartLists[chartId].needRangeShow = true;
            const vchart = chartLists.find(i => i.chart_id === chart_id)
            chartInfo.currentChart = vchart.chartOptions
        }

    }

    //操作DOM当前图表选择区域高亮
    selectRangeBorderShow(chart_id)
}

/**
 * 操作DOM当前图表选择区域高亮
 */
function selectRangeBorderShow(chart_id) {
    let $t = $('#' + chart_id + '_c')
    // TODO: 高亮数据区域
    // Highlight of data range
    chartInfo.chart_selection.create()


    chartInfo.chartparam.luckysheetCurrentChartActive = true
    chartInfo.chartparam.luckysheetCurrentChartMoveObj = $t
    chartInfo.chartparam.luckysheetCurrentChartResizeObj = $t
    chartInfo.chartparam.luckysheetCurrentChart = chart_id

    //luckysheet取cell-main，后续扩展到其他的用户自定义元素
    $('#luckysheet-cell-main')
        .find('.luckysheet-modal-dialog-chart .luckysheet-modal-dialog-resize')
        .hide()
    $('#luckysheet-cell-main')
        .find('.luckysheet-modal-dialog-chart .luckysheet-modal-dialog-controll')
        .hide()

    $t.css('z-index', chartInfo.chartparam.luckysheetCurrentChartZIndexRank++)
    $t.find('.luckysheet-modal-dialog-resize').show()
    $t.find('.luckysheet-modal-dialog-controll').show()

    if (
        ($('.chartSetting').is(':visible') || chartInfo.chartparam.luckysheet_chart_redo_click) &&
        chart_id != chartInfo.chartparam.luckysheetCurrentChart
    ) {
        // TODO: 第一次创建图表时候需要初始化数据选择框 qkSelection
        // generator.ini(chartMixConfig)
        $('body .luckysheet-cols-menu').hide()
    }

}

/**
 * 隐藏当前sheet所有的图表高亮区域
 */
function hideAllNeedRangeShow() {
    let chartLists = chartInfo.luckysheetfile[getSheetIndex(chartInfo.currentSheetIndex)].vchart;
    for (let chartId in chartLists) {
        //当前sheet的图表设置为false
        chartLists[chartId].needRangeShow = false

    }

    //操作DOM 当前图表选择区域隐藏
    selectRangeBorderHide()
}

/**
 * 选择区域高亮隐藏
 */
function selectRangeBorderHide() {

    $('#luckysheet-cell-main .luckysheet-modal-dialog-chart .luckysheet-modal-dialog-resize, #luckysheet-cell-main .luckysheet-modal-dialog-chart .luckysheet-modal-dialog-controll').hide()
    $('#luckysheet-cell-main').find('.luckysheet-datavisual-selection-set div').remove()
    chartInfo.chartparam.luckysheetCurrentChartActive = false

    $('#luckysheet-chart-rangeShow').empty()
}

/**
 * 打开图表属性面板
 */
function openVChartSetting(chart_id) {
    const $dialogMask = $('#luckysheet-modal-dialog-mask')

    // 1. 打开蒙版 
    $dialogMask.show()
    // 2. 设置背景
    $dialogMask.css('background', 'rgba(0, 0, 0, 0.15)')


    let drawer = document.querySelector('#luckysheet-vchart-setting-dialog')
    if (drawer) {
        $(drawer).show()
    } else {
        // 创建 vchart 属性面板
        drawer = document.createElement('div')
        drawer.id = 'luckysheet-vchart-setting-dialog'
        // 添加到 body 上
        $('body').append(drawer)
    }

    // 创建内容
    const $content =
        `<div class="luckysheet-vchart-setting-dialog-title">
            <span class="title">${locale().vChart.title}</span>
            <span id="luckysheet-vchart-setting-dialog-close" title="${locale().vChart.close}"">
                <i class="fa fa-close" aria-hidden="true" /></i>
            </span>
        </div>
        <div class="luckysheet-vchart-setting-dialog-body"></div>
        <div class="luckysheet-vchart-setting-dialog-footer">
            <span class="cancel">${locale().vChart.cancel}</span>
            <span class="confirm">${locale().vChart.confirm}</span>
        </div>`

    $(drawer).html($content)

    // 初始化内容
    const dialogBody = $(".luckysheet-vchart-setting-dialog-body")
    $(dialogBody).html(`
        <div class="luckysheet-vchart-setting-dialog-body-tabs">
            <span class="tab active">图表类型</span>
            <span class="tab">图表样式</span>
        </div>

        <div class="luckysheet-vchart-setting-dialog-body-content">
            div class="tips">折线图</div>
            <div class="vchart-type-item" title="" data-type="">
                <img src="../../assets/vchart/basic-line.png" alt="base-line" />
                <div class="vchart-type-item-name">基础折线图</div>
            </div>
            <div class="luckysheet-menuseparator luckysheet-mousedown-cancel" role="separator"></div>
        </div>  
        <div class="luckysheet-vchart-setting-dialog-body-content" style="display:none;">
                图表样式
        </div>
    `)

    // 实现 tab 切换
    $(dialogBody).on("click", ".tab", function () {
        const index = $(this).index()

        $(".tab").removeClass("active")
        $(this).addClass("active")

        $(".luckysheet-vchart-setting-dialog-body-content").hide()
        $(".luckysheet-vchart-setting-dialog-body-content").eq(index).show()
    })



    // 监听close 事件
    $('#luckysheet-vchart-setting-dialog-close').off('click').on('click', closeVChartSetting)
    $('.luckysheet-vchart-setting-dialog-footer .cancel').off('click').on('click', closeVChartSetting)
    $('.luckysheet-vchart-setting-dialog-footer .confirm').off('click').on('click', confirm)

    // 监听点击事件
    $($dialogMask).off('click').on('click', closeVChartSetting)


    // 确认事件
    function confirm() {
    }

}

/**
 * 关闭属性面板
 */
function closeVChartSetting() {
    const $dialogMask = $('#luckysheet-modal-dialog-mask')
    const $drawer = $('#luckysheet-vchart-setting-dialog')

    $dialogMask.hide()
    $drawer.hide()
}

export { vchart, createVChart, renderVCharts }