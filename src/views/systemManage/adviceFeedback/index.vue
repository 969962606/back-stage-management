<template>
  <div class="container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      highlight-current-row
      :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
    >
      <el-table-column prop="nickName" align="center" label="昵称">
      </el-table-column>
      <el-table-column align="center" label="头像">
        <template slot-scope="scope">
          <div>
            <img :src="scope.row.userAvatar" width="50" height="50" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="phonenumber" label="电话号码" align="center">
      </el-table-column>
      <el-table-column align="center" prop="content" label="反馈内容">
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="反馈时间">
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
        `/v1/platform/feedback/feedbacks?&pageNo=${this.listQuery.page}&pageSize=${this.listQuery.limit}`
      ).then(res => {
        this.listLoading = false;
        this.list = res.data.resultData.feedbacks;
        this.total = res.data.resultData.totalNum;
      });
    }
  }
};
</script>
