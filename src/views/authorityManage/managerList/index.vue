<template>
  <!-- 权限/管理员 -->
  <div class="container">
   
    <el-col :span="4">
      <!-- <span class="label">订单状态：</span> -->
      <el-select
        @change="changeOrder"
        clearable
        v-model="orderStatus"
        placeholder="账号类型："
      >
        <el-option
          v-for="item in optionsOrder"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-col>
    <search :placeholder="placeholder" @searchHandle="searchHandle" />
     <el-button class="butt"
      v-if="isHasPermissions('PERMISSION_MANAGEMENT:MANAGER:ADD')"
      @click="add"
      >新增管理员</el-button
    >
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      highlight-current-row
      :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
    >
      <el-table-column prop="managerId" align="center" label="账号">
      </el-table-column>
      <el-table-column prop="roleName" align="center" label="角色">
      </el-table-column>
      <el-table-column prop="agentName" align="center" label="上级">
      </el-table-column>
      <el-table-column prop="nickName" align="center" label="微信名字">
      </el-table-column>
      <el-table-column prop="phonenumber" label="电话号码" align="center">
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div>
            <el-button
              v-if="isHasPermissions('PERMISSION_MANAGEMENT:MANAGER:DELETE')"
              @click="handleDel(scope.row)"
              size="mini"
              >删除</el-button
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
    <el-dialog
      title="增加管理员"
      :visible.sync="dialogVisible"
      width="30%"
      :showClose="false"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item style="display: flex" label="用户账号" prop="phonenumber">
          <el-autocomplete
            class="inline-input autocomplateEL"
            v-model="form.phonenumber"
            :fetch-suggestions="querySearch"
            placeholder="请输入手机号码"
            :trigger-on-focus="false"
            @select="handleSelect"
            @blur="changeSelect"
            style="width: 218px"
          >
            <template slot-scope="props">
              <div class="autoList">
                <img
                  class="userAvatar"
                  :src="props.item.userAvatar"
                  width="30px"
                  height="30px"
                  alt=""
                />
                <span class="phonenum">{{ props.item.phonenumber }}</span>
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item style="display: flex" label="请选择角色" prop="roleId">
          <el-select v-model="form.roleId" placeholder="请选择">
            <el-option
              v-for="(item, index) in roleList"
              :label="item.roleName"
              :value="item.roleId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">完 成</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { requestApi } from "@/api/index";
import { valid } from "semver";
import Search from "@/components/Search";
export default {
  components: {
    Pagination,
    Search
  },
  data() {
    return {
      placeholder: "请输入手机号",
      orderStatus: "",
      accountType: "",
      optionsOrder: [
        { label: "销售", value: "销售" },
        { label: "运营商", value: "运营商" },
        { label: "管理员", value: "管理员" },
      ],
      listLoading: false,
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id",
      },
      dialogVisible: false,
      form: {
        phonenumber: null,
        roleId: null,
      },
      rules: {
        phonenumber: [
          {
            required: true,
            message: "请输入手机号码",
            triggle: "blur",
          },
        ],
        roleId: [
          {
            type: "number",
            required: true,
            message: "请选择角色",
            triggle: "change",
          },
        ],
      },
      roleList: null,
      isSelect: false,
      managerId: 4,
      roleName: "",
      agentName: "",
      nickName: "",
      keyword: "",
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    add() {
      this.isSelect = false;
      this.getRoleList();
      this.dialogVisible = true;
      if (this.$refs.form !== undefined) {
        this.$refs.form.resetFields();
      }
      this.form = {};
    },
    querySearch(keyword, cb) {
      console.log("keyword", keyword);
      console.log("phonenumber", this.form.phonenumber);
      requestApi(
        `/v1/platform/user/comboBox?keyword=${this.form.phonenumber}`
      ).then((res) => {
        cb(res.data.resultData);
      });
    },
    handleSelect(res) {
      this.isSelect = true;
      this.form.phonenumber = res ? res.phonenumber : "";
    },
    changeSelect() {
      this.isSelect = false;
    },
    onSubmit() {
      if (!this.isSelect) {
        this.$message.info("请选择用户账号！");
        return;
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          requestApi(
            `/v1/platform/manager/${this.managerId}`,
            "put",
            this.form,
            "json"
          ).then((res) => {
            this.getList();
            this.$message.success("保存成功");
            this.dialogVisible = false;
          });
        }
      });
    },
    getList() {
      this.listLoading = true;
      requestApi(
        `/v1/platform/manager/managers?keyword=${this.keyword}&roleStatus=${this.orderStatus}&pageNo=${this.listQuery.page}&pageSize=${this.listQuery.limit}`
      ).then((res) => {
        this.list = res.data.resultData.managers;
        this.total = res.data.resultData.totalNum;
        this.listLoading = false;
      });
    },
    handleDel(row) {
      this.$confirm("此操作将永久删除，是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          requestApi(
            `/v1/platform/manager/${row.managerId}`,
            "delete",
            {},
            "json"
          ).then((res) => {
            this.getList();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    getRoleList() {
      requestApi(`/v1/platform/role/comboBox`).then((res) => {
        this.roleList = res.data.resultData;
      });
    },
    searchHandle(val) {
      this.keyword = val;

      this.getList();
      this.listQuery.page = 1;
    },
    changeOrder(val) {
      console.log(val);
      this.orderStatus = val;
      this.accountType = val;
    },
  },
};
</script>
<style lang="">
.butt{
  float: right;
  margin-right: 104px;
}
  
</style>