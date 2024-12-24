import { deepCopy } from "../utils/chartUtil";

const vchartTypeContent = `
<h1 class="tips">折线图</h1>
<div class="vchart-type-item" title="基础折线图" data-type="basic-line">
    <img src="../../assets/vchart/basic-line.png" alt="基础折线图" />
    <div class="vchart-type-item-name">基础折线图</div>
</div>
<div class="vchart-type-item" title="平滑折线图" data-type="smoothed-line">
    <img src="../../assets/vchart/smoothed-line.png" alt="平滑折线图" />
    <div class="vchart-type-item-name">平滑折线图</div>
</div>
<div class="vchart-type-item" title="阶梯折线图" data-type="step-line">
    <img src="../../assets/vchart/step-line.png" alt="阶梯折线图" />
    <div class="vchart-type-item-name">阶梯折线图</div>
</div>
<div class="luckysheet-menuseparator luckysheet-mousedown-cancel" role="separator"></div>



<h1 class="tips">面积图</h1>
<div class="vchart-type-item" title="基础面积图" data-type="basic-area">
    <img src="../../assets/vchart/basic-area.png" alt="基础面积图" />
    <div class="vchart-type-item-name">基础面积图</div>
</div>
<div class="vchart-type-item" title="平滑面积图" data-type="smoothed-area">
    <img src="../../assets/vchart/smoothed-area.png" alt="平滑面积图" />
    <div class="vchart-type-item-name">平滑面积图</div>
</div>
<div class="vchart-type-item" title="阶梯面积图" data-type="step-area">
    <img src="../../assets/vchart/step-area.png" alt="阶梯面积图" />
    <div class="vchart-type-item-name">阶梯面积图</div>
</div>
<div class="luckysheet-menuseparator luckysheet-mousedown-cancel" role="separator"></div>



<h1 class="tips">柱状图</h1>
<div class="vchart-type-item" title="基础柱状图" data-type="basic-column">
    <img src="../../assets/vchart/basic-column.png" alt="基础柱状图" />
    <div class="vchart-type-item-name">基础柱状图</div>
</div>
<div class="vchart-type-item" title="分组柱状图" data-type="group-column">
    <img src="../../assets/vchart/group-column.png" alt="分组柱状图" />
    <div class="vchart-type-item-name">分组柱状图</div>
</div>
<div class="vchart-type-item" title="堆叠柱状图" data-type="stack-column">
    <img src="../../assets/vchart/stack-column.png" alt="堆叠柱状图" />
    <div class="vchart-type-item-name">堆叠柱状图</div>
</div>
<div class="vchart-type-item" title="百分比堆叠柱状图" data-type="stack-percentage-column">
    <img src="../../assets/vchart/stack-percentage-column.png" alt="百分比堆叠柱状图" />
    <div class="vchart-type-item-name">百分比堆叠柱状图</div>
</div>
<div class="luckysheet-menuseparator luckysheet-mousedown-cancel" role="separator"></div>



<h1 class="tips">饼图</h1>
<div class="vchart-type-item" title="基础饼图" data-type="basic-pie">
    <img src="../../assets/vchart/basic-pie.png" alt="基础饼图" />
    <div class="vchart-type-item-name">基础饼图</div>
</div>
<div class="vchart-type-item" title="环图" data-type="ring-pie">
    <img src="../../assets/vchart/ring-pie.png" alt="环图" />
    <div class="vchart-type-item-name">环图</div>
</div>
<div class="vchart-type-item" title="线性渐变饼图" data-type="linear-color-pie">
    <img src="../../assets/vchart/linear-color-pie.png" alt="线性渐变饼图" />
    <div class="vchart-type-item-name">线性渐变饼图</div>
</div>`;

/**
 * 初始化类型选择
 */
function initVChartType(root, vchart) {
  $(root).html(vchartTypeContent);

  const baseOption = deepCopy(vchart.getChart()._spec);
  delete baseOption.series;

  // 图表类型选择
  const $chartType = $(
    ".luckysheet-vchart-setting-dialog-body-content .vchart-type-item"
  );

  //   监听事件
  $chartType.off("click").on("click", function () {
    // 1. 获取当前图表类型
    const type = $(this).attr("data-type");
    console.warn("目前没找到合适的方法更新图表");

    // updateSpec 是 spec 更新，而不是数据替换
    switch (type) {
      case "basic-line":
        break;
      case "smoothed-line":
        break;
      case "step-line":
        break;
      case "basic-area":
        break;
      case "smoothed-area":
        break;
      case "step-area":
        break;
      case "basic-column":
        break;
      case "group-column":
        break;
      case "stack-column":
        break;
      case "stack-percentage-column":
        break;
      case "basic-pie":
        break;
      case "ring-pie":
        break;
      case "linear-color-pie":
        break;

      default:
        break;
    }
  });
}

export { initVChartType };
