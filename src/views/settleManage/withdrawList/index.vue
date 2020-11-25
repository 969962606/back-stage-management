<template>
  <!-- 结算/提现列表 -->
  <div class="container">
    <el-input
      class="search-input"
      v-model="phonenumber"
      :placeholder="placeholder"
      suffix-icon="el-icon-search"
    ></el-input>提现状态：
    <el-select @change="changeStatus" v-model="withdrawStatus" placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-button @click="searchHandle">查询</el-button>
    <el-button class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      highlight-current-row
      :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
    >
      <el-table-column prop="createTime" align="center" label="申请时间"></el-table-column>
      <el-table-column prop="phonenumber" align="center" label="提现账号"></el-table-column>
      <el-table-column prop="withdrawAmount" align="center" label="提现金额">
        <template slot-scope="scope">{{scope.row.withdrawAmount | dealMoney}}</template>
      </el-table-column>
      <el-table-column prop="nickName" align="center" label="微信昵称"></el-table-column>
      <el-table-column prop="managerName" align="center" label="审核人"></el-table-column>
      <el-table-column prop="checkTime" align="center" label="审核时间"></el-table-column>
      <el-table-column prop="withdrawStatus" align="center" label="状态">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.withdrawStatus === 'PENDING'">进行中</span>
            <span v-if="scope.row.withdrawStatus === 'APPROVE'">已通过</span>
            <span v-if="scope.row.withdrawStatus === 'REFUSE'">未通过</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        v-if="isHasPermissions('COUNT_MANAGEMENT:WITHDRAW:WITHDRAW_STATUS')"
      >
        <template slot-scope="scope">
          <div>
            <el-button @click="handleStatus(scope.row)" size="mini">通过</el-button>
            <el-button @click="reject(scope.row)" size="mini">驳回</el-button>
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
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { requestApi } from "@/api/index";

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
      withdrawStatus: "",
      phonenumber: "",
      placeholder: "请输入提现账号",
      options: [
        { label: "已通过", value: "APPROVE" },
        { label: "未通过", value: "REFUSE" },
        { label: "进行中", value: "PENDING" },
      ],
      withdrawAmount: 0,
    };
  },
  mounted(query) {
    this.getList();
  },
  methods: {
    // 数据导出
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "申请时间",
          "提现账号",
          "提现金额",
          "微信昵称",
          "审核人",
          "审核时间",
          "状态",
        ];
        const sex = this.withdrawAmount;
        const filterVal = [
          "createTime",
          "phonenumber",
          "withdrawAmount",
          "nickName",
          "managerName",
          "checkTime",
          "withdrawStatus",
        ];

        const data = this.formatJson(filterVal);

        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "提现列表导出",
        });
        this.downloadLoading = false;
      });
    },
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
    handleStatus(row) {
      requestApi(`/v1/platform/withdraw/${row.withdrawId}`, "put").then(
        (res) => {
          console.log(res);

          this.$message({
            message: "审核通过",
            type: "success",
          });
          this.getList()
        }
      );
    },
    reject(row) {
      requestApi(`/v1/platform/rwithdraw/${row.withdrawId}`, "put").then(
        (res) => {
         this.$message.error('审核未通过');
           this.getList()
        }
      );
    },
    changeStatus(val) {
      this.withdrawStatus = val;
    },
    getList() {
      this.listLoading = true;
      requestApi(
        `/v1/platform/withdraw/withdraws?pageNo=${this.listQuery.page}&pageSize=${this.listQuery.limit}&withdrawStatus=${this.withdrawStatus}&phonenumber=${this.phonenumber}`
      ).then((res) => {
        this.listLoading = false;
        this.list = res.data.resultData.withdraws;
        this.total = res.data.resultData.totalNum;
        this.withdrawAmount = res.data.resultData.withdrawAmount;
      });
    },
    searchHandle() {
      this.listQuery.page = 1;
      this.getList();
    },
  },
};
</script>
