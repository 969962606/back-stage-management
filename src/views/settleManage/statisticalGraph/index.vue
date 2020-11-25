<template>
<!-- 结算/统计图表 -->
  <div class="container">
    <div class="container-item">
      <h4>加盟商营收TOP10</h4>
      <div class="chart-container">
        <bar-graph
          height="100%"
          width="100%"
          v-if="xData.length > 0"
          :xAxisData="xData"
          :chartData="chartData"
          :id="'agent'"
        ></bar-graph>
      </div>
    </div>
    <div class="container-item">
      <h4>机柜营收TOP10</h4>
      <div class="chart-container">
        <bar-graph
          height="100%"
          width="100%"
          v-if="xData.length > 0"
          :xAxisData="cabinetsX"
          :chartData="cabinetsData"
          :id="'cabinet'"
        ></bar-graph>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <p class="title"><span class="line"> </span>销售额（月&周）</p>
        <section>
          <p class="item item-title">本月收入</p>
          <p v-if="dataDetail" class="item item-num">
            {{ dataDetail.thisMonthTotalOrderAmount | dealMoney}}
          </p>
          <p class="item item-title">本周收入</p>
          <p v-if="dataDetail" class="item item-num">
            {{ dataDetail.thisWeekTotalOrderAmount | dealMoney}}
          </p>
        </section>
      </div>
      <div class="right">
        <el-row>
          <p class="title"><span class="line"> </span>销售额统计图</p>
          <p class="content">
            <span
              data-type="THIS_WEEK"
              @click="itemChecked($event)"
              class="item"
              :class="{ activeItem: isActive }"
              >本周</span
            >
            <span
              data-type="THIS_MONTH"
              @click="itemChecked($event)"
              class="item"
              :class="{ activeItem: !isActive }"
              >本月</span
            >
            <el-date-picker
              class="index-picker"
              v-model="startDay"
              type="date"
              placeholder="开始日期"
              value-format="yyyy-MM-dd"
              readonly
            >
            </el-date-picker>
            至
            <el-date-picker
              class="index-picker"
              v-model="endDay"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="结束日期"
              readonly
            >
            </el-date-picker>
          </p>
        </el-row>
        <el-row style="height: 88%">
          <div class="chart-container">
            <chart
              height="100%"
              width="100%"
              :lineData="amountData"
              :isWeek.sync="isWeek"
              :id="'amount'"
              v-if="amountData.length > 0"
            />
          </div>
        </el-row>
      </div>
    </div>

    <div class="content">
      <div class="left">
        <p class="title"><span class="line"> </span>订单（月&周）</p>
        <section>
          <p class="item item-title">本月订单总数</p>
          <p v-if="dataDetail" class="item item-num">
            {{ dataDetail.thisMonthTotalOrderNum }}
          </p>
          <p class="item item-title">本周订单数量</p>
          <p v-if="dataDetail" class="item item-num">
            {{ dataDetail.thisWeekTotalOrderNum }}
          </p>
        </section>
      </div>
      <div class="right">
        <el-row>
          <p class="title"><span class="line"> </span>订单统计图</p>
          <p class="content">
            <span
              data-type="THIS_WEEK"
              @click="itemCheckedO($event)"
              class="item"
              :class="{ activeItem: isActiveO }"
              >本周</span
            >
            <span
              data-type="THIS_MONTH"
              @click="itemCheckedO($event)"
              class="item"
              :class="{ activeItem: !isActiveO }"
              >本月</span
            >
            <el-date-picker
              class="index-picker"
              v-model="startDayO"
              type="date"
              placeholder="开始日期"
              value-format="yyyy-MM-dd"
              readonly
            >
            </el-date-picker>
            至
            <el-date-picker
              class="index-picker"
              v-model="endDayO"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="结束日期"
              readonly
            >
            </el-date-picker>
          </p>
        </el-row>
        <el-row style="height: 88%">
          <div class="chart-container">
            <chart
              height="100%"
              width="100%"
              :lineData="numData"
              :isWeek.sync="isWeekO"
              :id="'num'"
              v-if="numData.length > 0"
            />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "@/components/Charts/LineMarker";
import barGraph from "@/components/Charts/barGraph.vue";
import moment from "moment";
import { requestApi } from "@/api/index";

export default {
  components: {
    barGraph,
    Chart
  },
  data() {
    return {
      dataDetail: null,
      xData: [], //加盟X
      chartData: [], //加盟Y
      cabinetsX: [], //机柜X
      cabinetsData: [], //机柜Y
      isActive: true, //销售额触发周或月
      isActiveO: true, //订单触发周或月
      endDay: "", // 销售额的时间结束
      startDay: "", //销售额的时间开始
      endDayO: "", // 订单的时间结束
      startDayO: "", // 订单的时间结束
      amountData: [], //销售额Y
      numData: [], //订单Y
      orderNumSearchType: "THIS_WEEK",
      orderAmountSearchType: "THIS_WEEK",
      isWeek: "WEEK",
      isWeekO: "WEEK"
    };
  },
  mounted() {
    this.startDay = this.getWeekTime().startDay;
    this.endDay = this.getWeekTime().endDay;
    this.startDayO = this.getWeekTime().startDay;
    this.endDayO = this.getWeekTime().endDay;
    this.getGraphDetail();
  },
  methods: {
    getGraphDetail() {
      requestApi(
        `/v1/platform/statistics?orderNumSearchType=${this.orderNumSearchType}&orderAmountSearchType=${this.orderAmountSearchType}`
      ).then(res => {
        console.log(res);
        // console.log(res, "统计");
        this.dataDetail = res.data.resultData;
        let agentNames = res.data.resultData.top10AgentAmount;
        let cabinets = res.data.resultData.top10CabinetAmount;
        let numData = res.data.resultData.statisticsOrderNum;
        let amountData = res.data.resultData.statisticsOrderAmount;
        amountData.forEach(item => {
          this.amountData.push(item.totalOrderAmount/100);
        });
        numData.forEach(item => {
          this.numData.push(item.totalOrderNum);
        });
        agentNames.forEach(item => {
          this.xData.push(item.agentName);
          this.chartData.push(item.amount/100);
        });
        cabinets.forEach(item => {
          this.cabinetsX.push(item.cabinetNo);
          this.cabinetsData.push(item.amount/100);
        });
      });
    },
    itemChecked(e) {
      this.amountData = [];
      this.orderAmountSearchType = e.target.dataset.type;
      this.isActive = !this.isActive;
      if (this.orderAmountSearchType === "THIS_WEEK") {
        this.isWeek = "WEEK";
        this.startDay = this.getWeekTime().startDay;
        this.endDay = this.getWeekTime().endDay;
      } else if (this.orderAmountSearchType === "THIS_MONTH") {
        this.startDay = this.getMonthTime().startDay;
        this.endDay = this.getMonthTime().endDay;
        this.isWeek = "MONTH";
      }
      this.getGraphDetail();
    },
    itemCheckedO(e) {
      this.numData = [];
      this.orderNumSearchType = e.target.dataset.type;
      this.isActiveO = !this.isActiveO;
      if (this.orderNumSearchType === "THIS_WEEK") {
        this.isWeekO = "WEEK";
        this.startDayO = this.getWeekTime().startDay;
        this.endDayO = this.getWeekTime().endDay;
      } else if (this.orderNumSearchType === "THIS_MONTH") {
        this.startDayO = this.getMonthTime().startDay;
        this.endDayO = this.getMonthTime().endDay;
        this.isWeekO = "MONTH";
      }
      this.getGraphDetail();
    },
    getWeekTime(startDay, endDay) {
      startDay = moment()
        .startOf("week")
        .add(1, "days")
        .format("YYYY-MM-DD");
      endDay = moment()
        .endOf("week")
        .add(1, "days")
        .format("YYYY-MM-DD");
      return {
        startDay,
        endDay
      };
    },
    getMonthTime(startDay, endDay) {
      startDay = moment()
        .startOf("month")
        .format("YYYY-MM-DD");
      endDay = moment()
        .endOf("month")
        .format("YYYY-MM-DD");
      return {
        startDay,
        endDay
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.chart-container {
  height: 500px;
}
h4 {
  font-size: 16px;
  margin: 0;
}
.container-item {
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
}
.container {
  padding: 0;
  background: transparent;
  & .content {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    font-family: PingFangS;
    font-weight: 600;
    & .left {
      width: 20%;
      background: #fff;
      height: 100%;
      .title {
        height: 25px;
        font-size: 18px;
        color: rgba(51, 51, 51, 1);
        line-height: 25px;
        .line {
          margin-top: 2px;
        }
      }
      section {
        display: flex;
        flex-direction: column;
        align-items: center;
        & .item-title {
          font-size: 14px;
          color: rgba(170, 170, 170, 1);
        }
        & .item-num {
          font-size: 32px;
          color: rgba(51, 51, 51, 1);
          margin-top: 0;
          margin-bottom: 100px;
        }
      }
    }
    & .right {
      width: 79%;
      background: #fff;
      height: 447px;

      & .title {
        font-size: 18px;
        color: rgba(51, 51, 51, 1);
        float: left;
        & .line {
          margin-top: 2px;
        }
      }
      & .content {
        float: right;
        display: flex;
        justify-content: center;
        align-items: center;
        & .item {
          margin: 0 20px;
        }
      }
      & .chart-container {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.activeItem {
  color: #43d283;
}
</style>
