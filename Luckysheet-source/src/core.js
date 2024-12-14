
import defaultSetting from './config.js';
import { common_extend } from './utils/util';
import Store from './store';
import { locales } from './locale/locale';
import server from './controllers/server';
import luckysheetConfigsetting from './controllers/luckysheetConfigsetting';
import sheetmanage from './controllers/sheetmanage';
import luckysheetsizeauto from './controllers/resize';
import luckysheetHandler from './controllers/handler';
import { initialFilterHandler } from './controllers/filter';
import { initialMatrixOperation } from './controllers/matrixOperation';
import { initialSheetBar } from './controllers/sheetBar';
import { formulaBarInitial } from './controllers/formulaBar';
import { rowColumnOperationInitial } from './controllers/rowColumnOperation';
import { keyboardInitial } from './controllers/keyboard';
import { orderByInitial } from './controllers/orderBy';
import { initPlugins } from './controllers/expendPlugins';
import {
    getluckysheetfile,
    getluckysheet_select_save,
    getconfig,
} from './methods/get';
import {
    setluckysheet_select_save
} from './methods/set';
import { luckysheetrefreshgrid, jfrefreshgrid } from './global/refresh';
import functionlist from './function/functionlist';
import { luckysheetlodingHTML } from './controllers/constant';
import { getcellvalue, getdatabyselection } from './global/getdata';
import { setcellvalue } from './global/setdata';
import { selectHightlightShow } from './controllers/select';
import { zoomInitial } from './controllers/zoom';
import { printInitial } from './controllers/print';
import method from './global/method';

import * as api from './global/api';

import flatpickr from 'flatpickr'
import Mandarin from 'flatpickr/dist/l10n/zh.js'
import { initListener } from './controllers/listener';
import { hideloading, showloading, setloadingcolor } from './global/loading.js';
import { luckysheetextendData } from './global/extend.js';
import { insertChartTosheet, restoreChart, deleteChart } from './controllers/chart.js'

let luckysheet = {};



luckysheet = common_extend(api, luckysheet);



//创建luckysheet表格
luckysheet.create = function (setting) {
    method.destroy()
    // Store original parameters for api: toJson
    Store.toJsonOptions = {}
    for (let c in setting) {
        if (c !== 'data') {
            Store.toJsonOptions[c] = setting[c];
        }
    }

    let extendsetting = common_extend(defaultSetting, setting);

    let loadurl = extendsetting.loadUrl,
        menu = extendsetting.menu,
        title = extendsetting.title;

    let container = extendsetting.container;
    Store.container = container;
    Store.luckysheetfile = extendsetting.data;
    Store.defaultcolumnNum = extendsetting.column;
    Store.defaultrowNum = extendsetting.row;
    Store.defaultFontSize = extendsetting.defaultFontSize;
    Store.fullscreenmode = extendsetting.fullscreenmode;
    Store.lang = extendsetting.lang; //language
    Store.allowEdit = extendsetting.allowEdit;
    Store.limitSheetNameLength = extendsetting.limitSheetNameLength;
    Store.defaultSheetNameMaxLength = extendsetting.defaultSheetNameMaxLength;
    Store.fontList = extendsetting.fontList;
    server.gridKey = extendsetting.gridKey;
    server.loadUrl = extendsetting.loadUrl;
    server.updateUrl = extendsetting.updateUrl;
    server.updateImageUrl = extendsetting.updateImageUrl;
    server.title = extendsetting.title;
    server.loadSheetUrl = extendsetting.loadSheetUrl;
    server.allowUpdate = extendsetting.allowUpdate;

    luckysheetConfigsetting.autoFormatw = extendsetting.autoFormatw;
    luckysheetConfigsetting.accuracy = extendsetting.accuracy;
    luckysheetConfigsetting.total = extendsetting.data[0].total;

    luckysheetConfigsetting.loading = extendsetting.loading;
    luckysheetConfigsetting.allowCopy = extendsetting.allowCopy;
    luckysheetConfigsetting.showtoolbar = extendsetting.showtoolbar;
    luckysheetConfigsetting.showtoolbarConfig = extendsetting.showtoolbarConfig;
    luckysheetConfigsetting.showinfobar = extendsetting.showinfobar;
    luckysheetConfigsetting.showsheetbar = extendsetting.showsheetbar;
    luckysheetConfigsetting.showsheetbarConfig = extendsetting.showsheetbarConfig;
    luckysheetConfigsetting.showstatisticBar = extendsetting.showstatisticBar;
    luckysheetConfigsetting.showstatisticBarConfig = extendsetting.showstatisticBarConfig;
    luckysheetConfigsetting.sheetFormulaBar = extendsetting.sheetFormulaBar;
    luckysheetConfigsetting.cellRightClickConfig = extendsetting.cellRightClickConfig;
    luckysheetConfigsetting.sheetRightClickConfig = extendsetting.sheetRightClickConfig;
    luckysheetConfigsetting.pointEdit = extendsetting.pointEdit;
    luckysheetConfigsetting.pointEditUpdate = extendsetting.pointEditUpdate;
    luckysheetConfigsetting.pointEditZoom = extendsetting.pointEditZoom;

    luckysheetConfigsetting.userInfo = extendsetting.userInfo;
    luckysheetConfigsetting.userMenuItem = extendsetting.userMenuItem;
    luckysheetConfigsetting.myFolderUrl = extendsetting.myFolderUrl;
    luckysheetConfigsetting.functionButton = extendsetting.functionButton;

    luckysheetConfigsetting.showConfigWindowResize = extendsetting.showConfigWindowResize;
    luckysheetConfigsetting.enableAddRow = extendsetting.enableAddRow;
    luckysheetConfigsetting.enableAddBackTop = extendsetting.enableAddBackTop;
    luckysheetConfigsetting.addRowCount = extendsetting.addRowCount;
    luckysheetConfigsetting.enablePage = extendsetting.enablePage;
    luckysheetConfigsetting.pageInfo = extendsetting.pageInfo;

    luckysheetConfigsetting.editMode = extendsetting.editMode;
    luckysheetConfigsetting.beforeCreateDom = extendsetting.beforeCreateDom;
    luckysheetConfigsetting.workbookCreateBefore = extendsetting.workbookCreateBefore;
    luckysheetConfigsetting.workbookCreateAfter = extendsetting.workbookCreateAfter;
    luckysheetConfigsetting.remoteFunction = extendsetting.remoteFunction;
    luckysheetConfigsetting.customFunctions = extendsetting.customFunctions;

    luckysheetConfigsetting.fireMousedown = extendsetting.fireMousedown;
    luckysheetConfigsetting.forceCalculation = extendsetting.forceCalculation;
    luckysheetConfigsetting.plugins = extendsetting.plugins;

    luckysheetConfigsetting.rowHeaderWidth = extendsetting.rowHeaderWidth;
    luckysheetConfigsetting.columnHeaderHeight = extendsetting.columnHeaderHeight;

    luckysheetConfigsetting.defaultColWidth = extendsetting.defaultColWidth;
    luckysheetConfigsetting.defaultRowHeight = extendsetting.defaultRowHeight;

    luckysheetConfigsetting.title = extendsetting.title;
    luckysheetConfigsetting.container = extendsetting.container;
    luckysheetConfigsetting.hook = extendsetting.hook;

    luckysheetConfigsetting.pager = extendsetting.pager;

    luckysheetConfigsetting.initShowsheetbarConfig = false;

    luckysheetConfigsetting.imageUpdateMethodConfig = extendsetting.imageUpdateMethodConfig;

    if (Store.lang === 'zh') flatpickr.localize(Mandarin.zh);

    // Store the currently used plugins for monitoring asynchronous loading
    Store.asyncLoad.push(...luckysheetConfigsetting.plugins);

    // Register plugins
    initPlugins(extendsetting.plugins, extendsetting.data);

    // Store formula information, including internationalization
    functionlist(extendsetting.customFunctions);

    let devicePixelRatio = extendsetting.devicePixelRatio;
    if (devicePixelRatio == null) {
        devicePixelRatio = 1;
    }
    Store.devicePixelRatio = Math.ceil(devicePixelRatio);

    //loading
    const loadingObj = luckysheetlodingHTML("#" + container)
    Store.loadingObj = loadingObj

    if (loadurl == "") {
        sheetmanage.initialjfFile(menu, title);
        // luckysheetsizeauto();
        initialWorkBook();
    }
    else {
        $.post(loadurl, { "gridKey": server.gridKey }, function (d) {
            let data = new Function("return " + d)();
            Store.luckysheetfile = data;

            sheetmanage.initialjfFile(menu, title);
            // luckysheetsizeauto();
            initialWorkBook();

            //需要更新数据给后台时，建立WebSocket连接
            if (server.allowUpdate) {
                server.openWebSocket();
            }
        }).error(error => {
            // 向上暴露错误 error 不能阻塞渲染
            console.error('协同服务异常，请检查后重试！', error);
            loadingObj.close()
            sheetmanage.initialjfFile(menu, title);
            // luckysheetsizeauto();
            initialWorkBook();
            showloading('协同服务异常，请检查后重试！')
            setloadingcolor('#F56C6C')
        });
    }
}

function initialWorkBook() {
    luckysheetHandler();//Overall dom initialization
    initialFilterHandler();//Filter initialization
    initialMatrixOperation();//Right click matrix initialization
    initialSheetBar();//bottom sheet bar initialization
    formulaBarInitial();//top formula bar initialization
    rowColumnOperationInitial();//row and coloumn operate initialization
    keyboardInitial();//Keyboard operate initialization
    orderByInitial();//menu bar orderby function initialization
    zoomInitial();//zoom method initialization
    printInitial();//print initialization
    initListener();
}

//获取所有表格数据
luckysheet.getluckysheetfile = getluckysheetfile;

//获取当前表格 选区
luckysheet.getluckysheet_select_save = getluckysheet_select_save;

//设置当前表格 选区
luckysheet.setluckysheet_select_save = setluckysheet_select_save;

//获取当前表格 config配置
luckysheet.getconfig = getconfig;

//二维数组数据 转化成 {r, c, v}格式 一维数组 (传入参数为二维数据data)
luckysheet.getGridData = sheetmanage.getGridData;

//生成表格所需二维数组 （传入参数为表格数据对象file）
luckysheet.buildGridData = sheetmanage.buildGridData;

// Refresh the canvas display data according to scrollHeight and scrollWidth
luckysheet.luckysheetrefreshgrid = luckysheetrefreshgrid;

// Refresh canvas
luckysheet.jfrefreshgrid = jfrefreshgrid;

// Get the value of the cell
luckysheet.getcellvalue = getcellvalue;

// Set cell value
luckysheet.setcellvalue = setcellvalue;

// Get selection range value
luckysheet.getdatabyselection = getdatabyselection;

luckysheet.sheetmanage = sheetmanage;

// Data of the current table
luckysheet.flowdata = function () {
    return Store.flowdata;
}

// Set selection highlight
luckysheet.selectHightlightShow = selectHightlightShow;

// Reset parameters after destroying the table
luckysheet.destroy = method.destroy;

luckysheet.showLoadingProgress = showloading;
luckysheet.hideLoadingProgress = hideloading;
luckysheet.luckysheetextendData = luckysheetextendData;

luckysheet.locales = locales;

// 统计图
window.data = {
    "chart_id": "chart_00la0naeiAoi_1734158370019",
    "width": 400,
    "height": 250,
    "left": 0,
    "top": 0,
    "sheetIndex": "89357e56-c6bc-4de0-bfd1-0e00b3086da4",
    "needRangeShow": false,
    "chartOptions": {
        "chart_id": "chart_00la0naeiAoi_1734158370019",
        "chartAllType": "echarts|line|default",
        "chartPro": "echarts",
        "chartType": "line",
        "chartStyle": "default",
        "chartData": [
            [
                {
                    "ct": {
                        "fa": "General",
                        "t": "g"
                    },
                    "v": "A",
                    "m": "A",
                    "bg": "#FFFFFF",
                    "ff": "5",
                    "fc": "#000000",
                    "bl": false,
                    "it": false,
                    "fs": 10,
                    "cl": false,
                    "ht": 0,
                    "vt": 0,
                    "f": "",
                    "un": false
                },
                {
                    "ct": {
                        "fa": "General",
                        "t": "n"
                    },
                    "v": 2,
                    "m": "2",
                    "bg": "#FFFFFF",
                    "ff": "5",
                    "fc": "#000000",
                    "bl": false,
                    "it": false,
                    "fs": 10,
                    "cl": false,
                    "ht": 0,
                    "vt": 0,
                    "f": "",
                    "un": false
                }
            ],
            [
                {
                    "ct": {
                        "fa": "General",
                        "t": "g"
                    },
                    "v": "B",
                    "m": "B",
                    "bg": "#FFFFFF",
                    "ff": "5",
                    "fc": "#000000",
                    "bl": false,
                    "it": false,
                    "fs": 10,
                    "cl": false,
                    "ht": 0,
                    "vt": 0,
                    "f": "",
                    "un": false
                },
                {
                    "ct": {
                        "fa": "General",
                        "t": "n"
                    },
                    "v": 2,
                    "m": "2",
                    "bg": "#FFFFFF",
                    "ff": "5",
                    "fc": "#000000",
                    "bl": false,
                    "it": false,
                    "fs": 10,
                    "cl": false,
                    "ht": 0,
                    "vt": 0,
                    "f": "",
                    "un": false
                }
            ]
        ],
        "rangeArray": [
            {
                "left": 0,
                "width": 73,
                "top": 0,
                "height": 19,
                "left_move": 0,
                "width_move": 147,
                "top_move": 0,
                "height_move": 39,
                "row": [
                    0,
                    1
                ],
                "column": [
                    0,
                    1
                ],
                "row_focus": 0,
                "column_focus": 0
            }
        ],
        "rangeTxt": "A1:B2",
        "rangeColCheck": {
            "exits": true,
            "range": [
                0,
                0
            ]
        },
        "rangeRowCheck": {
            "exits": false,
            "range": [
                0,
                0
            ]
        },
        "rangeConfigCheck": false,
        "rangeSplitArray": {
            "title": null,
            "rowtitle": null,
            "coltitle": {
                "row": [
                    0,
                    1
                ],
                "column": [
                    0,
                    0
                ]
            },
            "content": {
                "row": [
                    0,
                    1
                ],
                "column": [
                    1,
                    1
                ]
            },
            "type": "leftright",
            "range": {
                "left": 0,
                "width": 73,
                "top": 0,
                "height": 19,
                "left_move": 0,
                "width_move": 147,
                "top_move": 0,
                "height_move": 39,
                "row": [
                    0,
                    1
                ],
                "column": [
                    0,
                    1
                ],
                "row_focus": 0,
                "column_focus": 0
            }
        },
        "chartDataCache": {
            "xAxis": [
                "A",
                "B"
            ],
            "series": [
                [
                    2
                ],
                [
                    2
                ]
            ],
            "series_tpye": {
                "0": "num"
            },
            "title": {
                "text": "图表标题"
            },
            "label": [
                "系列1"
            ]
        },
        "chartDataSeriesOrder": {
            "0": 0,
            "length": 1
        },
        "defaultOption": {
            "title": {
                "show": false,
                "text": "默认标题",
                "label": {
                    "fontSize": 12,
                    "color": "#333",
                    "fontFamily": "sans-serif",
                    "fontGroup": [],
                    "cusFontSize": 12
                },
                "position": {
                    "value": "left-top",
                    "offsetX": 40,
                    "offsetY": 50
                }
            },
            "subtitle": {
                "show": false,
                "text": "",
                "label": {
                    "fontSize": 12,
                    "color": "#333",
                    "fontFamily": "sans-serif",
                    "fontGroup": [],
                    "cusFontSize": 12
                },
                "distance": {
                    "value": "auto",
                    "cusGap": 40
                }
            },
            "config": {
                "color": "transparent",
                "fontFamily": "Sans-serif",
                "grid": {
                    "value": "normal",
                    "top": 5,
                    "left": 10,
                    "right": 20,
                    "bottom": 10
                }
            },
            "legend": {
                "show": true,
                "selectMode": "multiple",
                "selected": [
                    {
                        "seriesName": "衣服",
                        "isShow": true
                    },
                    {
                        "seriesName": "食材",
                        "isShow": true
                    },
                    {
                        "seriesName": "图书",
                        "isShow": true
                    }
                ],
                "label": {
                    "fontSize": 12,
                    "color": "#333",
                    "fontFamily": "sans-serif",
                    "fontGroup": [],
                    "cusFontSize": 12
                },
                "position": {
                    "value": "left-top",
                    "offsetX": 40,
                    "offsetY": 50,
                    "direction": "horizontal"
                },
                "width": {
                    "value": "auto",
                    "cusSize": 25
                },
                "height": {
                    "value": "auto",
                    "cusSize": 14
                },
                "distance": {
                    "value": "auto",
                    "cusGap": 10
                },
                "itemGap": 10,
                "data": [
                    "系列1"
                ]
            },
            "tooltip": {
                "show": true,
                "label": {
                    "fontSize": 12,
                    "color": "#333",
                    "fontFamily": "sans-serif",
                    "fontGroup": [],
                    "cusFontSize": 12
                },
                "backgroundColor": "rgba(50,50,50,0.7)",
                "triggerOn": "mousemove",
                "triggerType": "item",
                "axisPointer": {
                    "type": "line",
                    "style": {
                        "color": "#555",
                        "width": "normal",
                        "type": "solid"
                    }
                },
                "format": [
                    {
                        "seriesName": "衣服",
                        "prefix": "",
                        "suffix": "",
                        "ratio": 1,
                        "digit": "auto"
                    },
                    {
                        "seriesName": "食材",
                        "prefix": "",
                        "suffix": "",
                        "ratio": 1,
                        "digit": "auto"
                    },
                    {
                        "seriesName": "图书",
                        "prefix": "",
                        "suffix": "",
                        "ratio": 1,
                        "digit": "auto"
                    }
                ],
                "position": "auto"
            },
            "axis": {
                "axisType": "xAxisDown",
                "xAxisUp": {
                    "show": false,
                    "title": {
                        "showTitle": false,
                        "text": "",
                        "nameGap": 15,
                        "rotate": 0,
                        "label": {
                            "fontSize": 12,
                            "color": "#333",
                            "fontFamily": "sans-serif",
                            "fontGroup": [],
                            "cusFontSize": 12
                        },
                        "fzPosition": "end"
                    },
                    "name": "显示X轴",
                    "inverse": false,
                    "tickLine": {
                        "show": true,
                        "width": 1,
                        "color": "auto"
                    },
                    "tick": {
                        "show": true,
                        "position": "outside",
                        "length": 5,
                        "width": 1,
                        "color": "auto"
                    },
                    "tickLabel": {
                        "show": true,
                        "label": {
                            "fontSize": 12,
                            "color": "#333",
                            "fontFamily": "sans-serif",
                            "fontGroup": [],
                            "cusFontSize": 12
                        },
                        "rotate": 0,
                        "prefix": "",
                        "suffix": "",
                        "optimize": 0,
                        "distance": 0,
                        "min": "auto",
                        "max": "auto",
                        "ratio": 1,
                        "digit": "auto"
                    },
                    "netLine": {
                        "show": false,
                        "width": 1,
                        "type": "solid",
                        "color": "auto",
                        "interval": {
                            "value": "auto",
                            "cusNumber": 0
                        }
                    },
                    "netArea": {
                        "show": false,
                        "interval": {
                            "value": "auto",
                            "cusNumber": 0
                        },
                        "colorOne": "auto",
                        "colorTwo": "auto"
                    },
                    "axisLine": {
                        "onZero": false
                    }
                },
                "xAxisDown": {
                    "show": true,
                    "title": {
                        "showTitle": false,
                        "text": "",
                        "nameGap": 15,
                        "rotate": 0,
                        "label": {
                            "fontSize": 12,
                            "color": "#333",
                            "fontFamily": "sans-serif",
                            "fontGroup": [],
                            "cusFontSize": 12
                        },
                        "fzPosition": "end"
                    },
                    "name": "显示X轴",
                    "inverse": false,
                    "tickLine": {
                        "show": true,
                        "width": 1,
                        "color": "auto"
                    },
                    "tick": {
                        "show": true,
                        "position": "outside",
                        "length": 5,
                        "width": 1,
                        "color": "auto"
                    },
                    "tickLabel": {
                        "show": true,
                        "label": {
                            "fontSize": 12,
                            "color": "#333",
                            "fontFamily": "sans-serif",
                            "fontGroup": [],
                            "cusFontSize": 12
                        },
                        "rotate": 0,
                        "prefix": "",
                        "suffix": "",
                        "optimize": 0,
                        "distance": 0,
                        "min": null,
                        "max": null,
                        "ratio": 1,
                        "digit": "auto"
                    },
                    "netLine": {
                        "show": false,
                        "width": 1,
                        "type": "solid",
                        "color": "auto",
                        "interval": {
                            "value": "auto",
                            "cusNumber": 0
                        }
                    },
                    "netArea": {
                        "show": false,
                        "interval": {
                            "value": "auto",
                            "cusNumber": 0
                        },
                        "colorOne": "auto",
                        "colorTwo": "auto"
                    },
                    "data": [
                        "A",
                        "B"
                    ],
                    "type": "category"
                },
                "yAxisLeft": {
                    "show": true,
                    "title": {
                        "showTitle": false,
                        "text": "",
                        "nameGap": 15,
                        "rotate": 0,
                        "label": {
                            "fontSize": 12,
                            "color": "#333",
                            "fontFamily": "sans-serif",
                            "fontGroup": [],
                            "cusFontSize": 12
                        },
                        "fzPosition": "end"
                    },
                    "name": "显示Y轴",
                    "inverse": false,
                    "tickLine": {
                        "show": true,
                        "width": 1,
                        "color": "auto"
                    },
                    "tick": {
                        "show": true,
                        "position": "outside",
                        "length": 5,
                        "width": 1,
                        "color": "auto"
                    },
                    "tickLabel": {
                        "show": true,
                        "label": {
                            "fontSize": 12,
                            "color": "#333",
                            "fontFamily": "sans-serif",
                            "fontGroup": [],
                            "cusFontSize": 12
                        },
                        "rotate": 0,
                        "formatter": {
                            "prefix": "",
                            "suffix": "",
                            "ratio": 1,
                            "digit": "auto"
                        },
                        "split": 5,
                        "min": null,
                        "max": null,
                        "prefix": "",
                        "suffix": "",
                        "ratio": 1,
                        "digit": "auto",
                        "distance": 0
                    },
                    "netLine": {
                        "show": false,
                        "width": 1,
                        "type": "solid",
                        "color": "auto",
                        "interval": {
                            "value": "auto",
                            "cusNumber": 0
                        }
                    },
                    "netArea": {
                        "show": false,
                        "interval": {
                            "value": "auto",
                            "cusNumber": 0
                        },
                        "colorOne": "auto",
                        "colorTwo": "auto"
                    },
                    "type": "value"
                },
                "yAxisRight": {
                    "show": false,
                    "title": {
                        "showTitle": false,
                        "text": "",
                        "nameGap": 15,
                        "rotate": 0,
                        "label": {
                            "fontSize": 12,
                            "color": "#333",
                            "fontFamily": "sans-serif",
                            "fontGroup": [],
                            "cusFontSize": 12
                        },
                        "fzPosition": "end"
                    },
                    "name": "显示Y轴",
                    "inverse": false,
                    "tickLine": {
                        "show": true,
                        "width": 1,
                        "color": "auto"
                    },
                    "tick": {
                        "show": true,
                        "position": "outside",
                        "length": 5,
                        "width": 1,
                        "color": "auto"
                    },
                    "tickLabel": {
                        "show": true,
                        "label": {
                            "fontSize": 12,
                            "color": "#333",
                            "fontFamily": "sans-serif",
                            "fontGroup": [],
                            "cusFontSize": 12
                        },
                        "rotate": 0,
                        "formatter": {
                            "prefix": "",
                            "suffix": "",
                            "ratio": 1,
                            "digit": "auto"
                        },
                        "split": 5,
                        "min": null,
                        "max": null,
                        "prefix": "",
                        "suffix": "",
                        "ratio": 1,
                        "digit": "auto",
                        "distance": 0
                    },
                    "netLine": {
                        "show": false,
                        "width": 1,
                        "type": "solid",
                        "color": "auto",
                        "interval": {
                            "value": "auto",
                            "cusNumber": 0
                        }
                    },
                    "netArea": {
                        "show": false,
                        "interval": {
                            "value": "auto",
                            "cusNumber": 0
                        },
                        "colorOne": "auto",
                        "colorTwo": "auto"
                    }
                }
            },
            "series": [
                {
                    "itemStyle": {
                        "color": null,
                        "borderColor": "#000",
                        "borderType": "solid",
                        "borderWidth": 1
                    },
                    "lineStyle": {
                        "color": null,
                        "width": 1,
                        "type": "solid"
                    },
                    "data": [
                        2,
                        2
                    ],
                    "type": "line",
                    "name": "系列1",
                    "markPoint": {
                        "data": []
                    },
                    "markLine": {
                        "data": []
                    },
                    "markArea": {
                        "data": []
                    }
                }
            ],
            "seriesData": [
                [
                    2,
                    2
                ]
            ]
        }
    },
    "chartData": [
        [
            {
                "ct": {
                    "fa": "General",
                    "t": "g"
                },
                "v": "A",
                "m": "A",
                "bg": "#FFFFFF",
                "ff": "5",
                "fc": "#000000",
                "bl": false,
                "it": false,
                "fs": 10,
                "cl": false,
                "ht": 0,
                "vt": 0,
                "f": "",
                "un": false
            },
            {
                "ct": {
                    "fa": "General",
                    "t": "n"
                },
                "v": 2,
                "m": "2",
                "bg": "#FFFFFF",
                "ff": "5",
                "fc": "#000000",
                "bl": false,
                "it": false,
                "fs": 10,
                "cl": false,
                "ht": 0,
                "vt": 0,
                "f": "",
                "un": false
            }
        ],
        [
            {
                "ct": {
                    "fa": "General",
                    "t": "g"
                },
                "v": "B",
                "m": "B",
                "bg": "#FFFFFF",
                "ff": "5",
                "fc": "#000000",
                "bl": false,
                "it": false,
                "fs": 10,
                "cl": false,
                "ht": 0,
                "vt": 0,
                "f": "",
                "un": false
            },
            {
                "ct": {
                    "fa": "General",
                    "t": "n"
                },
                "v": 2,
                "m": "2",
                "bg": "#FFFFFF",
                "ff": "5",
                "fc": "#000000",
                "bl": false,
                "it": false,
                "fs": 10,
                "cl": false,
                "ht": 0,
                "vt": 0,
                "f": "",
                "un": false
            }
        ]
    ]
}
luckysheet.insertChartTosheet = insertChartTosheet
luckysheet.deleteChart = deleteChart
luckysheet.restoreChart = restoreChart

setTimeout(() => {
    // insertChartTosheet(window.data)
}, 1000);
export {
    luckysheet
}
