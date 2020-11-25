<template>
  <div class="container">
    <search :placeholder="placeholder" @searchHandle="searchHandle" />
    <a @click="exportData" ref="exportLink">
      <el-button v-if="isHasPermissions('USER_LIST:EXPORT')" style="float: right">导出数据</el-button>
    </a>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在加载..."
      highlight-current-row
      :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="nickName" align="center" label="昵称"></el-table-column>
      <el-table-column align="center" label="头像">
        <template slot-scope="scope">
          <span>
            <img :src="scope.row.userAvatar" alt width="40px" height="40px" />
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="phonenumber" label="电话号码" align="center"></el-table-column>
      <el-table-column class-name="status-col" label="性别" align="center">
        <template slot-scope="scope">
          <div>{{ genderStr[scope.row.gender] }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="地区">
        <template slot-scope="scope">
          <div>
            {{ scope.row.province }} {{ scope.row.city }}
            {{ scope.row.district }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="source" label="支付类型">
        <template slot-scope="scope">
          <div>
            <svg-icon v-if="scope.row.source === 'ALIPLAY'" class="pay" icon-class="alipay"></svg-icon>
            <svg-icon v-if="scope.row.source === 'WECHAT'" class="pay" icon-class="WeChat"></svg-icon>
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
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import { requestApi } from "@/api/index";
export default {
  name: "UserList",
  components: {
    Search,
    Pagination,
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      BASEURL: process.env.BASE_URL,
      genderStr: {
        MALE: "男",
        FEMALE: "女",
        UNKNOW: "未知",
      },
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
      keyword: "",
      placeholder: "请输入昵称或手机号",
      userIds: "",
      exportHref: "",
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    exportData() {
      if (this.userIds === "") {
        this.$message.info("请选择您需要导出的数据！");
      } else {
        let link =
          this.BASEURL + "/v1/platform/user/export?userIds=" + this.userIds;
        window.open(link);
        // requestApi(`/v1/platform/user/export?userIds=${this.userIds}`)
      }
    },
    selectionChange(arr) {
      let userIds = "";
      if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          if (i === 0) {
            userIds = `${arr[i].userId}`;
          } else {
            userIds = `${userIds}:${arr[i].userId}`;
          }
        }
        this.userIds = userIds;
      } else {
        this.userIds = "";
      }
    },
    getList() {
      this.listLoading = true;
      requestApi(
        `/v1/platform/user/users?keyword=${this.keyword}&pageNo=${this.listQuery.page}&pageSize=${this.listQuery.limit}`
      ).then((res) => {
        this.list = res.data.resultData.users;
        this.total = res.data.resultData.totalNum;
        this.listLoading = false;
      });
    },
    searchHandle(val) {
      this.keyword = val;
      this.listQuery.page = 1;
      this.getList();
    },
  },
};
</script>
