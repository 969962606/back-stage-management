<template>
  <!-- 设备/首页 -->
  <div class="container">
    <div v-if="fox">
      <ul class="top">
        <li class="item item0">
          <svg-icon icon-class="item1" class="item-icon" />
          <p class="item-block">
            <span class="item-title">订单总收入1</span>
            <span v-if="dataIndex" class="item-num-bold">
              {{ dataIndex.orderTotalAmount | dealMoney }}
            </span>
          </p>
        </li>
        <li class="item item1">
          <svg-icon icon-class="item2" class="item-icon" />
          <p class="item-block">
            <span class="item-title">平台总收益</span>
            <span v-if="dataIndex" class="item-num-bold">{{
              dataIndex.platformTotalAmount | dealMoney
            }}</span>
          </p>
        </li>
        <li class="item item2">
          <svg-icon icon-class="item3" class="item-icon" />
          <p class="item-block">
            <span class="item-title">设备总数</span>
            <span v-if="dataIndex" class="item-num-bold">{{
              dataIndex.deviceTotalNum
            }}</span>
          </p>
        </li>
        <li class="item item3">
          <svg-icon icon-class="item4" class="item-icon" />
          <p class="item-block">
            <span class="item-title">投放总数</span>
            <span v-if="dataIndex" class="item-num-bold">{{
              dataIndex.cabinetTotalPublishNum
            }}</span>
          </p>
        </li>
        <li class="item item4">
          <svg-icon icon-class="gen1" class="item-icon" />
          <p class="item-block">
            <span v-if="dataIndex" class="item-num">{{
              dataIndex.totalAgentNum
            }}</span>
            <span class="item-title">总加盟商</span>
          </p>
        </li>
        <li class="item item5">
          <svg-icon icon-class="gen2" class="item-icon" />
          <p class="item-block">
            <span v-if="dataIndex" class="item-num">{{
              dataIndex.totalMerchantNum
            }}</span>
            <span class="item-title">总商户数</span>
          </p>
        </li>
        <li class="item item6">
          <svg-icon icon-class="gen3" class="item-icon" />
          <p class="item-block">
            <span v-if="dataIndex" class="item-num">{{
              dataIndex.totalUserNum
            }}</span>
            <span class="item-title">总注册用户量</span>
          </p>
        </li>
        <li class="item item7">
          <svg-icon icon-class="gen4" class="item-icon" />
          <p class="item-block">
            <span v-if="dataIndex" class="item-num">{{
              dataIndex.totalOrderNum
            }}</span>
            <span class="item-title">总订单数</span>
          </p>
        </li>
      </ul>
      <div class="content">
        <div class="left">
          <p class="title"><span class="line"> </span>销售额（月&周）</p>
          <section>
            <p class="item item-title">本月收入</p>
            <p v-if="dataIndex" class="item item-num">
              {{ dataIndex.thisMonthTotalOrderAmount | dealMoney }}
            </p>
            <p class="item item-title">本周收入</p>
            <p v-if="dataIndex" class="item item-num">
              {{ dataIndex.thisWeekTotalOrderAmount | dealMoney }}
            </p>
          </section>
        </div>
        <div class="right">
          <el-row>
            <p class="title"><span class="line"> </span>销售订单统计图</p>
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
                :lineData="chartData"
                :isWeek.sync="isWeek"
                v-if="chartData.length > 0"
              />
            </div>
          </el-row>
        </div>
      </div>
    </div>
    <div v-if="box">无权查看</div>
  </div>
</template>

<script>
import { requestApi } from "@/api/index";
import Chart from "@/components/Charts/LineMarker";
import moment from "moment";
export default {
  components: {
    Chart,
  },
  data() {
    return {
      dataIndex: null,
      startDay: "",
      endDay: "",
      weekData: [],
      mouthData: [],
      chartData: [],
      isActive: true,
      searchType: "THIS_WEEK",
      isWeek: "WEEK",
      fox: true,
      box: false,
    };
  },


  created() {
    const rs = JSON.parse(localStorage.getItem("resultData")).rs;
    if (rs) {
      console.log(1);
      this.fox = true;
    } else {
      console.log(2);
      this.fox = false;
      this.box = true;
    }

    this.getDetail();
    this.getWeekTime();
  },
  methods: {
    getDetail() {
      const rs = JSON.parse(localStorage.getItem("resultData")).rs;
      if (rs) {
        requestApi(
          `/v1/platform/index?searchType=${this.searchType}&rs=${rs}`
        ).then((res) => {
          console.log(res);
          this.dataIndex = res.data.resultData;
          let chartdata = res.data.resultData.statisticsOrder;
          let item = null;
          for (let i = 0; i < chartdata.length; i++) {
            this.chartData.push(chartdata[i].totalOrderAmount / 100);
          }
          console.log(this.chartData, "chartData");
        });
      }
    },
    itemChecked(e) {
      this.chartData = [];
      this.searchType = e.target.dataset.type;
      this.isActive = !this.isActive;
      if (this.searchType === "THIS_WEEK") {
        this.isWeek = "WEEK";
        this.getWeekTime();
      } else if (this.searchType === "THIS_MONTH") {
        this.isWeek = "MONTH";
        this.getMonthTime();
      }
      this.getDetail();
    },
    getWeekTime() {
      this.startDay = moment()
        .startOf("week")
        .add(1, "days")
        .format("YYYY-MM-DD");
      this.endDay = moment().endOf("week").add(1, "days").format("YYYY-MM-DD");
    },
    getMonthTime() {
      this.startDay = moment().startOf("month").format("YYYY-MM-DD");
      this.endDay = moment().endOf("month").format("YYYY-MM-DD");
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  background: transparent;
  padding: 0;
  & .top {
    width: 100%;
    color: #fff;
    overflow: hidden;
    & .item {
      float: left;
      height: 160px;
      width: 24%;
      position: relative;
      & .item-icon {
        width: 42px;
        height: 42px;
        color: #fff;
        font-size: 16px;
        position: absolute;
        right: 22px;
        top: 22px;
      }
      & .item-title {
        display: block;
        font-size: 20px;
        font-weight: 500;
        margin-top: 28px;
        margin-left: 43px;
      }
      & .item-num-bold {
        display: block;
        font-size: 40px;
        font-family: numberBold;
        font-weight: bold;
        margin-top: 30px;
        margin-left: 43px;
      }
    }
    & {
      @for $i from 0 through 3 {
        .item#{$i} {
          background: url("~@/assets/bg#{$i}.png") no-repeat;
          background-size: 100% 100%;
          margin-right: 1.32%;
        }
        @if $i == 3 {
          .item#{$i} {
            margin-right: 0;
          }
        }
      }
      @for $i from 4 through 7 {
        .item#{$i} {
          background: #fff;
          margin-top: 20px;
          padding-right: 1%;
          box-sizing: content-box;
          color: #999999;
          & .item-block {
            margin-right: -10px;
            margin-top: 40px;
            float: right;
            overflow: hidden;
            text-align: right;
            border-right: 1px solid #eeeeee;
            padding-right: 25%;
            .item-num {
              font-size: 32px;
              // font-weight: 600;
              color: rgba(51, 51, 51, 1);
              margin: 0;
              font-family: PingFangS;
            }
            .item-title {
              font-size: 18px;
              // font-weight: 600;
              color: rgba(153, 153, 153, 1);
              margin: 0;
              font-family: PingFangS;
            }
          }

          .item-icon {
            width: 25px;
            position: absolute;
            top: 60px;
            left: 90px;
          }
        }
        @if $i == 7 {
          .item#{$i} {
            margin-right: 0;
            margin-top: 20px;
            .item-block {
              border-right: none;
            }
          }
        }
      }
    }
  }
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
      min-height: 450px;
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
