<template>
<!-- 加盟商/申请列表 -->
  <div class="container">
    <search @searchHandle="searchHandle" :placeholder="placeholder" />
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      highlight-current-row
      :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
    >
      <el-table-column prop="agentId" align="center" label="ID">
      </el-table-column>
      <el-table-column prop="agentName" align="center" label="姓名">
      </el-table-column>
      <el-table-column prop="phonenumber" label="联系电话" align="center">
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="性别"
        align="center"
      >
        <template slot-scope="scope">{{ genderStr[scope.row.gender] }}</template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">{{ contactStatusStr[scope.row.contactStatus] }}</template>
      </el-table-column>
      <el-table-column align="center" label="省市区">
        <template slot-scope="scope">
          <div>
            {{ scope.row.province }} {{ scope.row.city }}
            {{ scope.row.district }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="申请时间">
      </el-table-column>
      <el-table-column align="center" prop="contactRemark" label="备注">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div v-if="scope.row.contactStatus === 'YES'">
            {{ scope.row.auditStatus === "APPROVE" ? "通过" : "拒绝" }}
          </div>
          <div v-else>
            <div v-if="isHasPermissions('AGENT_MANAGEMENT:APPLY_AGENT:AUDIT_STATUS')">
              <el-button @click="pass(scope.row)" size="mini">通过</el-button>
              <el-button @click="reject(scope.row)" size="mini">拒绝</el-button>
            </div>
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
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :showClose="false"
    >
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark"></el-input>
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
import Search from "@/components/Search";
import { requestApi } from "@/api/index";

export default {
  components: {
    Search,
    Pagination
  },
  data() {
    return {
      genderStr: {
        'MALE': '男',
        'FEMALE': '女',
        'UNKNOW': '未知'
      },
      contactStatusStr: {
        'YES': '已联系',
        'NO': '待联系'
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
        sort: "+id"
      },
      placeholder: "请输入姓名或手机号",
      dialogVisible: false,
      form: { remark: " " },
      rules: {
        remark: [{ required: true, message: "请输入备注", triggle: "blur" }]
      },
      keyword: "",
      agentId: 0,
      auditStatus: "",
      dialogTitle: ""
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    pass(row) {
      this.dialogVisible = true;
      this.agentId = row.agentId;
      this.auditStatus = "APPROVE";
      this.dialogTitle = "通过";
      this.form = {};
    },
    reject(row) {
      this.dialogVisible = true;
      this.agentId = row.agentId;
      this.auditStatus = "REFUSE";
      this.dialogTitle = "拒绝";
      this.form = {};
    },
    onSubmit() {
      const params = {
        agentId: this.agentId,
        auditStatus: this.auditStatus,
        contactRemark: this.form.remark
      };
      this.$refs.form.validate(valid => {
        if (valid) {
          requestApi(`/v1/platform/agent/apply`, "put", params, "json").then(
            res => {
              this.$message.success("操作成功");
              this.dialogVisible = false;
              this.getList();
            }
          );
        } else {
          return;
        }
      });
    },
    getList() {
      this.listLoading = true;
      requestApi(
        `/v1/platform/agent/agents/apply?keyword=${this.keyword}&pageNo=${this.listQuery.page}&pageSize=${this.listQuery.limit}`
      ).then(res => {
        this.listLoading = false;
        this.list = res.data.resultData.agents;
        this.total = res.data.resultData.totalNum;
      });
    },
    searchHandle(val) {
      this.keyword = val;
      this.listQuery.page = 1;
      this.getList();
    }
  }
};
</script>
