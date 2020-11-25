<template>
<!-- 结算/分成记录 -->
  <div class="container">
    <!-- <search :placeholder="placehodlder" @searchHandle="searchHandle"/> -->


      <el-row>
      <el-col :span="7">
        <!-- <span class="label">用户手机号：</span> -->
        <el-input
          class="search-input"
          v-model="keyword"
          suffix-icon="el-icon-search"
          placeholder="请输入设备编号或订单号"
        ></el-input>
      </el-col>
     <el-col :span="7">
        <!-- <span class="label">订单编号：</span> -->
        <el-input
          class="search-input"
          v-model="agentNames"
          suffix-icon="el-icon-search"
          placeholder="加盟商"
        ></el-input>
      </el-col>
       <el-button @click="searchHandle">查询</el-button>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      highlight-current-row
      :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
    >
      <el-table-column prop="cabinetNo" align="center"  label="设备编号">
      </el-table-column>
      <el-table-column prop="orderNo" align="center" label="订单号">
      </el-table-column>
      <el-table-column prop="endTime" align="center" label="订单结束时间">
      </el-table-column>
      <el-table-column prop="payAmount" align="center" label="订单金额">
          <template slot-scope="scope">
            {{scope.row.payAmount | dealMoney}}
          </template>
      </el-table-column>
      <el-table-column prop="platformShareMoney" align="center" label="平台分成">
          <template slot-scope="scope">
            {{scope.row.platformShareMoney | dealMoney}}
          </template>
      </el-table-column>
      <el-table-column prop="agentNames" align="center" label="加盟商">
      </el-table-column>
      <el-table-column
        prop="shareMoneyProportion"
        align="center"
        label="加盟分润比例"
      >
      </el-table-column>
      <el-table-column
        prop="shareMoney"
        align="center"
        label="加盟分润"
      >
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
import { requestApi } from "@/api/index";
import Search from "@/components/Search";
export default {
  components: {
    Search,
    Pagination
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
        sort: "+id"
      },
      keyword: '',
      agentNames: '',
      placehodlder: '请输入设备编号或订单号'
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
          console.log(JSON.parse(localStorage.getItem("resultData")).managerId);
          const managerId=JSON.parse(localStorage.getItem("resultData")).managerId
      requestApi(
        `/v1/platform/sharemoneyrecord/sharemoneyrecords?pageNo=${this.listQuery.page}&pageSize=${this.listQuery.limit}&agentNames=${this.agentNames}&keyword=${this.keyword}&managerId=${managerId}`
      ).then(res => {
        this.listLoading = false;
        this.list = res.data.resultData.records;
        this.total = res.data.resultData.totalNum;
      });
    },
    searchHandle(val) {
      // this.keyword = val;
      this.listQuery.page = 1;
      this.getList()
    }
  }
};
</script>
