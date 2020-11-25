<template>
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
    lineData: Array,
    isWeek: {
      type: String,
      default: "WEEK"
    }
  },
  data() {
    return {
      chart: null,
      xAxisDataM: [
        "1号",
        "2号",
        "3号",
        "4号",
        "5号",
        "6号",
        "7号",
        "8号",
        "9号",
        "10号",
        "11号",
        "12号",
        "13号",
        "14号",
        "15号",
        "16号",
        "17号",
        "18号",
        "19号",
        "21号",
        "22号",
        "23号",
        "24号",
        "25号",
        "26号",
        "27号",
        "28号",
        "29号",
        "30号",
        "31号"
      ],
      xAxisDataW: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    };
  },
  mounted() {
    // console.log(this.lineData, this.isWeek, "line");
    this.initChart();
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      this.chart.setOption({
        xAxis: {
          type: "category",
          data: this.isWeek === "WEEK" ? this.xAxisDataW : this.xAxisDataM
        },
        yAxis: {
          type: "value"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: "#57617B"
            }
          }
        },
        series: [
          {
            data: this.lineData,
            type: "line"
          }
        ],
        color: ["#43d283", "#43d283", "#43d283"]
      });
    }
  }
};
</script>
