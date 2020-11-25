<template>
<!-- 设备/告警列表 -->
  <div class="container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      highlight-current-row
      :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
    >
      <el-table-column prop="cabinetNo" align="center" label="机柜编号">
      </el-table-column>
      <el-table-column prop="content" align="center" label="内容">
      </el-table-column>
      <el-table-column prop="feedbackTime" label="反馈时间" align="center">
      </el-table-column>
      <el-table-column align="center" prop="detailAddress" label="地址">
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
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      requestApi(
        `/v1/platform/warn/warns?pageNo=${this.listQuery.page}&pageSize=${this.listQuery.limit}`
      ).then(res => {
        this.list = res.data.resultData.warns;
        this.total = res.data.resultData.totalNum;
        this.listLoading = false;
      });
    }
  }
};
</script>
