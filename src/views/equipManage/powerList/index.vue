<template>
<!-- 设备/生产批次 -->
  <div class="container">
    <!-- 充电宝编号：<search @searchHandle="searchHandle" /> -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      highlight-current-row
      :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
    >
      <el-table-column prop="cabinetNo" align="center" label="机柜编号">
      </el-table-column>
      <el-table-column prop="powerbankNo" align="center" label="充电宝编号">
      </el-table-column>
      <el-table-column prop="powerbankStatus" label="充电宝状态" align="center">
      </el-table-column>
      <el-table-column align="center" prop="batteryPower" label="充电宝电量">
      </el-table-column>
      <el-table-column align="center" prop="usageCounter" label="使用次数">
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="生产日期">
      </el-table-column>
    </el-table>
    <!-- <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    /> -->
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
      powerbankNo: "",
      cabinetNo: ""
    };
  },
  mounted(query) {
    this.cabinetNo = this.$route.query.cabinetNo;
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      requestApi(
        `/v1/platform/powerbank/powerbanks?powerbankNo=${this.powerbankNo}&pageNo=${this.listQuery.page}&pageSize=${this.listQuery.limit}&cabinetNo=${this.cabinetNo || ''}`
      ).then(res => {
        this.listLoading = false;
        this.list = res.data.resultData.powerbanks;
        this.total = res.data.resultData.totalNum;
      });
    },
    searchHandle(val) {
      this.powerbankNo = val;
      this.listQuery.page = 1;
      this.getList();
    }
  }
};
</script>
