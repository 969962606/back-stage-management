<template>
  <!-- 订单/订单列表 -->
  <div class="container">
    <!-- 查询 -->
    <el-row>
      <el-col :span="6">
        <el-input
          class="search-input"
          v-model="orderNo"
          suffix-icon="el-icon-search"
          placeholder="订单编号："
        ></el-input>
      </el-col>
      <el-col :span="6">
        <el-input
          class="search-input"
          v-model="username"
          suffix-icon="el-icon-search"
          placeholder="用户昵称"
        ></el-input>
      </el-col>

      <el-col :span="6">
        <el-input
          class="search-input"
          v-model="business "
          suffix-icon="el-icon-search"
          placeholder="代理商/加盟商"
        ></el-input>
      </el-col>

      <el-col :span="6">
        <!-- <span class="label">用户手机号：</span> -->
        <el-input
          class="search-input"
          v-model="phonenumber"
          suffix-icon="el-icon-search"
          placeholder="用户手机号："
        ></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
         <el-col :span="6">
        <!-- <span class="label">机柜编号：</span> -->
        <el-input
          class="search-input"
          v-model="cabinetNo"
          suffix-icon="el-icon-search"
          placeholder="机柜编号："
        ></el-input>
      </el-col>
      <el-col :span="6">
        <!-- <span class="label">充电宝编号：</span> -->
        <el-input
          class="search-input"
          v-model="powerbankNo"
          suffix-icon="el-icon-search"
          placeholder="充电宝编号："
        ></el-input>
      </el-col>
      
      <el-col :span="6">
        <el-date-picker
          @change="changeEnd"
          clearable
          v-model="startDate"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择起始时间"
        ></el-date-picker>
      </el-col>
      <el-col :span="6">
        <!-- <span class="label">机柜编号：</span> -->
        <el-date-picker
          @change="changeStart"
          v-model="endDate"
          clearable
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择结束时间"
        ></el-date-picker>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col :span="6">
        <!-- <span class="label">支付方式：</span> -->
        <el-select
          @change="changePay"
          clearable
          v-model="payType"
          placeholder="支付方式："
        >
          <el-option
            v-for="item in optionsPay"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-input
          class="search-input"
          v-model="transactionId"
          suffix-icon="el-icon-search"
          placeholder="支付流水号"
        ></el-input>
      </el-col>
      <el-col :span="6">
        <!-- <span class="label">订单状态：</span> -->
        <el-select
          @change="changeOrder"
          clearable
          v-model="orderStatus"
          placeholder="订单状态："
        >
          <el-option
            v-for="item in optionsOrder"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-button @click="searchHandle">查询</el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
        >导出</el-button
      >
    </el-row>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      element-loading-text="拼命加载中..."
      :data="list"
      highlight-current-row
      :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
    >
      <el-table-column
        prop="orderNo"
        align="center"
        label="订单编号"
      ></el-table-column>
      <el-table-column prop="orderStatus" align="center" label="订单状态">
        <template slot-scope="scope">
          <div>
            <span
              style="color: #d96d70"
              v-if="scope.row.orderStatus === 'FINISH'"
              >订单完成</span
            >
            <span
              style="color: #fd9795"
              v-if="scope.row.orderStatus === 'PENDING'"
              >正在租借</span
            >
            <span
              style="color: #fd9795"
              v-if="scope.row.orderStatus === 'DOING'"
              >租借中</span
            >
            <span
              style="color: #fd9795"
              v-if="scope.row.orderStatus === 'TIMEOUT'"
              >超时</span
            >
            <!-- <span
              style="color: #fd9795"
              v-if="scope.row.orderStatus === 'EXECEPTION'"
              >异常订单</span
            > -->
            <span
              style="color: #399998"
              v-if="scope.row.orderStatus === 'REFUND'"
              >已退款</span
            >
            <span
              style="color: #399998"
              v-if="scope.row.orderStatus === 'UNREFUND'"
              >未退款</span
            >
            <span
              style="color: #399998"
              v-if="scope.row.orderStatus === 'CREATED'"
              >取消租借</span
            >
            <span
              style="color: #fd9795"
              v-if="scope.row.orderStatus === 'UNPAY'"
              >未付款</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="用户昵称"
        align="center"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="phonenumber"
        label="用户手机号"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="cabinetNo"
        label="机柜编号"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="powerbankNo"
        label="充电宝编号"
      ></el-table-column>
            <el-table-column
        align="center"
        prop="returnPower"
        label="充电宝状态"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.returnPower === "UNRETURN" ? "未归还" : "归还" }}</div>
        </template>
      </el-table-column>
    
      <el-table-column align="center" label="借出信息">
        <template slot-scope="scope">
          <div>
            <span class="borrow-address"
              >借出地点：{{ scope.row.borrowStoreName }}</span
            >
            <span class="borrow-time">借出时间：{{ scope.row.beginTime }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="归还信息">
        <template slot-scope="scope">
          <div>
            <span class="borrow-address"
              >归还地点：{{ scope.row.returnStoreName }}</span
            >
            <span class="borrow-time">归还时间：{{ scope.row.endTime }}</span>
          </div>
        </template>
      </el-table-column>
          <el-table-column
        align="center"
        prop="powerbankNo"
        label="实际时间"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="duration"
        label="使用时长"
      ></el-table-column>
      <el-table-column align="center" prop="payAmount" label="支付费用">
        <template slot-scope="scope">{{
          scope.row.payAmount | dealMoney
        }}</template>
      </el-table-column>
      <el-table-column align="center" prop="payType" label="支付方式">
        <template slot-scope="scope">
          <div>{{ scope.row.payType === "ALIPAY" ? "支付宝" : "微信" }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="rentType" label="扣款类型">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.rentType === 'DEPOSIT'">押金</span>
            <span v-if="scope.row.rentType === 'ALIPAY_ZHIMA'">芝麻信用</span>
            <span v-if="scope.row.rentType === 'WECHAT_CODE'">微信支付分</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="payTime"
        label="支付时间"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="transactionId"
        label="支付流水号"
      ></el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.orderStatus === 'FINISH'">
              {{ scope.row.endRemark }}
            </span>
            <span v-if="scope.row.orderStatus === 'REFUND'">
              {{ scope.row.refundRemark }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        width="150px"
        v-if="isHasPermissions('ORDER_MANAGEMENT:ORDER:ORDER_STATUS')"
      >
        <template slot-scope="scope">
          <div>
            <el-button
              :disabled="
                !(
                  scope.row.orderStatus == 'PENDING' ||
                  scope.row.orderStatus == 'DOING'
                )
              "
              size="mini"
              v-if="
                scope.row.orderStatus !== 'UNPAY' &&
                scope.row.orderStatus !== 'FINISH'
              "
              @click="handleEnd(scope.row)"
              >结束</el-button
            >
            <el-button
              :disabled="!(scope.row.orderStatus == 'FINISH')"
              @click="handleRefund(scope.row)"
              size="mini"
              >退款</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog title="结束" :visible.sync="dialogVisibleEnd" width="30%">
      <el-form
        ref="formEnd"
        :model="formEnd"
        :rules="rules"
        label-width="110px"
        status-icon
      >
        <el-form-item label="订单号" prop="orderNo">
          <el-input
            type="text"
            :disabled="true"
            v-model="formEnd.orderNo"
          ></el-input>
        </el-form-item>
        <el-form-item label="租借时间" prop="beginTime">
          <el-input :disabled="true" v-model="formEnd.beginTime"></el-input>
        </el-form-item>
        <el-form-item label="归还时间" prop="endTime">
          <!-- <el-input v-model="formEnd.endTime"></el-input> -->
          <el-date-picker
            v-model="formEnd.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          ></el-date-picker>
          <!-- <el-date-picker  type="datetime" placeholder="选择时间"  value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"></el-date-picker> -->
          <el-button @click="free" style="width: 40px" size="mini"
            >免费</el-button
          >
        </el-form-item>
        <el-form-item label="归还店铺" prop="returnStoreName">
          <el-autocomplete
            class="inline-input"
            v-model="formEnd.returnStoreName"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            :trigger-on-focus="false"
            @select="handleSelect"
            @blur="changeSelect"
          >
            <template slot-scope="props">
              <div class="name">{{ props.item.storeName }}</div>
              <span class="addr">
                {{ props.item.province }}{{ props.item.city
                }}{{ props.item.district }}
              </span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="formEnd.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEnd = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitEnd">提 交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="退款" :visible.sync="dialogVisibleRefund" width="30%">
      <el-form
        ref="formRefund"
        :model="formRefund"
        :rules="rules"
        label-width="110px"
      >
        <el-form-item label="订单号" prop="orderNo">
          <el-input
            type="text"
            :disabled="true"
            v-model="formRefund.orderNo"
          ></el-input>
        </el-form-item>
        <el-form-item label="租借时间" prop="beginTime">
          <el-input :disabled="true" v-model="formRefund.beginTime"></el-input>
        </el-form-item>
        <el-form-item label="最大退款金额" prop="endTime">
          <el-input :disabled="true" v-model="formRefund.payAmount"></el-input>
        </el-form-item>
        <el-form-item label="退款金额" prop="refundAmount">
          <el-input v-model="formRefund.refundAmount"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="formRefund.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleRefund = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitRefund">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { requestApi } from "@/api/index";
import Search from "@/components/Search";
import moment from "moment";
export default {
  components: {
    Search,
    Pagination,
  },
  data() {
    return {
      list: null,
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id",
      },
      dialogVisibleEnd: false,
      dialogVisibleRefund: false,
      formEnd: {
        orderStatus: "FINISH",
        orderNo: "",
        username: "",
         business: "",
        beginTime: "",
        endTime: "",
        returnAddress: "",
        returnStoreName: "",
        remark: "",
        orderId: "",
        province: "",
        city: "",
        district: "",
      },
      formRefund: {
        orderStatus: "REFUND",
        orderNo: "",
        username: "",
        business: "",
        beginTime: "",
        payAmount: "",
        refundAmount: "",
        remark: "",
        orderId: "",
      },
      rules: {
        endTime: [
          { required: true, message: "请输入归还时间", tirrgle: "blur" },
        ],
        returnStoreName: [
          { required: true, message: "请输入归还店铺", tirrgle: "blur" },
        ],
        refundAmount: [
          { required: true, message: "请输入退款金额", tirrgle: "blur" },
        ],
        remark: [{ required: true, message: "请输入备注", tirrgle: "blur" }],
      },
      orderNo: "",
      username: "",
      business: "",
      phonenumber: "",
      cabinetNo: "",
      transactionId: "",
      startDate: "",
      endDate: "",
      powerbankNo: "",
      payType: "",
      orderStatus: "",
      optionsPay: [
        { label: "支付宝", value: "ALIPAY" },
        { label: "微信", value: "WECHART_PAY" },
      ],
      optionsOrder: [
        { label: "订单完成", value: "FINISH" },
        { label: "正在租借", value: "PENDING" },
        { label: "租借中", value: "DOING" },
        { label: "未付款", value: "UNPAY" },
        { label: "取消租借", value: "CREATED" },
        { label: "已退款", value: "REFUND" },
        { label: "未退款", value: "UNREFUND" },
        { label: "超时订单", value: "TIMEOUT" },
        { label: "异常订单", value: "EXECEPTION" },
      ],
      chargeRule: "",
      cbData: [],
      isSelect: false,
      downloadLoading: false,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 数据导出
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "订单编号",
          "订单状态",
          "用户昵称",
          "机柜编号",
          "使用时长",
          "支付费用",
          "支付方式",
          "扣款类型",
          "支付时间",
        ];

        const filterVal = [
          "orderNo",
          "username",
          "business",
          "orderStatus",
          "nickName",
          "cabinetNo",
          "transactionId",
          "startDate",
          "endDate",
          "duration",
          "payAmount",
          "payType",
          "rentType",
          "payTime",
        ];

        const data = this.formatJson(filterVal);

        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "导出",
        });
        this.downloadLoading = false;
      });
    },
    // 数据导出
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },

    querySearch(keyword, cd) {
      requestApi(
        `/v1/platform/stores/address?keyword=${this.formEnd.returnStoreName}`
      ).then((res) => {
        let results = [];
        results = res.data.resultData.storeAddess;
        cd(results);
      });
    },
    changeSelect() {
      this.isSelect = false;
    },
    handleSelect(res) {
      this.isSelect = true;
      this.formEnd.province = res ? res.province : "";
      this.formEnd.city = res ? res.city : "";
      this.formEnd.district = res ? res.district : "";
      this.formEnd.returnStoreName = res ? res.storeName : "";
      this.formRefund.storeId = res ? res.storeId : "";
      this.formEnd.storeId = res ? res.storeId : "";
    },
    free() {
      const currentTime = moment().valueOf();
      const afterTime = moment(this.formEnd.beginTime)
        .add(this.chargeRule, "m")
        .valueOf();
      if (afterTime > currentTime) {
        this.formEnd.endTime = moment(currentTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        return;
      }
      this.formEnd.endTime = moment(afterTime).format("YYYY-MM-DD HH:mm:ss");
      // this.formEnd.endTime = moment(
      //   moment(this.formEnd.beginTime).format("YYYY-MM-DD HH:mm:ss")
      // )
      //   .add(this.chargeRule, "m")
      //   .format("YYYY-MM-DD HH:mm:ss");
    },
    handleEnd(row) {
      this.isSelect = false;
      this.chargeRule = row.chargeRule.split("-")[0];
      if (this.$refs.formEnd !== undefined) {
        this.$refs.formEnd.resetFields();
      }
      this.formEnd = JSON.parse(JSON.stringify(row));
      this.formEnd.orderStatus = "FINISH";
      this.formEnd.endTime = "";
      this.dialogVisibleEnd = true;
    },
    handleRefund(row) {
      if (this.$refs.formRefund !== undefined) {
        this.$refs.formRefund.resetFields();
      }
      this.formRefund = JSON.parse(JSON.stringify(row));
      this.formRefund.payAmount = this.formRefund.payAmount / 100;
      this.formRefund.orderStatus = "REFUND";
      this.dialogVisibleRefund = true;
    },
    onSubmitEnd() {
      if (!this.isSelect) {
        this.$message.info("请选择归还店铺！");
        return;
      }
      console.log(this.formEnd);
      this.$refs.formEnd.validate((valid) => {
        if (valid) {
          requestApi(
            `/v1/platform/order/status`,
            "put",
            this.formEnd,
            "json"
          ).then((res) => {
            this.$message.success("订单已结束");
            this.dialogVisibleEnd = false;
            this.getList();
          });
        }
      });
    },
    onSubmitRefund() {
      const formRefund = JSON.parse(JSON.stringify(this.formRefund));
      formRefund.refundAmount = formRefund.refundAmount * 100;
      this.$refs.formRefund.validate((valid) => {
        if (valid) {
          requestApi(
            `/v1/platform/order/status`,
            "put",
            formRefund,
            "json"
          ).then((res) => {
            this.$message.success("退款成功");
            this.dialogVisibleRefund = false;
            this.getList();
          });
        }
      });
    },
    getList() {
      this.listLoading = true;
      console.log(JSON.parse(localStorage.getItem("resultData")).managerId);
      const managerId = JSON.parse(localStorage.getItem("resultData"))
        .managerId;
      requestApi(
        `/v1/platform/order/orders?orderNo=${this.orderNo}&pageNo=${this.listQuery.page}&userName=${this.username}&agentName=${this.business }&pageSize=${this.listQuery.limit}&phonenumber=${this.phonenumber}&cabinetNo=${this.cabinetNo}&transactionId=${this.transactionId}&startDate=${this.startDate}&endDate=${this.endDate}&powerbankNo=${this.powerbankNo}&payType=${this.payType}&orderStatus=${this.orderStatus}&managerId=${managerId}`
      ).then((res) => {
        this.list = res.data.resultData.orders;
        this.total = res.data.resultData.totalNum;
        this.listLoading = false;
      });
    },
    changePay(val) {
      this.payType = val;
    },
    changeOrder(val) {
      this.orderStatus = val;
    },
    changeEnd(val) {
      this.startDate = val;
    },
    changeStart(val) {
      this.endDate = val;
    },
    searchHandle() {
      this.listQuery.page = 1;
      this.getList();
    },
  },
};
</script>
<style lang="">
.el-col-7 {
  width: 20%;
}
</style>
