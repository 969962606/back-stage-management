<template>
<!-- 图表  -->
  <div
    :id="id"
    :class="className"
    :style="{ height: height, width: width }"
  ></div>
</template>
<script>
import echarts from "echarts";
export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    id: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "200px"
    },
    height: {
      type: String,
      default: "200px"
    },
    xAxisData: {
      type: Array,
      default: () => {}
    },
    chartData: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: "category",
          data: this.xAxisData
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: this.chartData,
            type: "bar",
            barWidth: "30%"
          }
        ],
        color: ["#43d283", "#43d283", "#43d283"]
      });
    }
  }
};
</script>
