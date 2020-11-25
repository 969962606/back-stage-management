<template>
  <div class="container">
          <el-col :span="4">
        <!-- <span class="label">用户手机号：</span> -->
        <el-input
          class="search-input"
          v-model="keyword2"
          suffix-icon="el-icon-search"
          placeholder="查找下级"
        ></el-input>
      </el-col>
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
    <!-- <span class="txt">开通时间：</span> -->
    <el-date-picker
      v-model="startDate"
      type="date"
      value-format="yyyy-MM-dd"
      placeholder="开始日期"
    ></el-date-picker
    >至
    <el-date-picker
      v-model="endDate"
      type="date"
      value-format="yyyy-MM-dd"
      placeholder="结束日期"
    ></el-date-picker>
    <search :placeholder="placeholder" @searchHandle="searchHandle" />
 

    <el-button
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="handleDownload"
      >导出</el-button
    >

    <el-button
      v-if="isHasPermissions('AGENT_MANAGEMENT:AGENT:ADD')"
      style="float: right"
      @click="add"
      >新增加盟商</el-button
    >
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      highlight-current-row
      :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
    >
      <el-table-column
        prop="agentId"
        align="center"
        label="ID"
      ></el-table-column>
      <el-table-column
        prop="account"
        align="center"
        label="登入账号"
      ></el-table-column>
      <el-table-column
        prop="agentName"
        label="姓名"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="phonenumber"
        class-name="status-col"
        label="联系方式"
        align="center"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="openTime"
        label="开通时间"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="superior"
        label="上级"
      ></el-table-column>
      <el-table-column align="center" prop="percentage" label="分成比例">
        <template slot-scope="scope">
          <div>{{ scope.row.percentage }}%</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="agentAmount" label="总收益">
        <template slot-scope="scope">
          <div>{{ scope.row.agentAmount | dealMoney }}</div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="remark"
        label="备注"
      ></el-table-column>
      <el-table-column align="center" label="操作" width="250px">
        <template slot-scope="scope">
          <div>
            <el-button @click="toCabinet(scope.row)" size="mini"
              >设备列表</el-button
            >
            <el-button @click="In_tie(scope.row)" size="mini">换绑</el-button>
            <el-button
              v-if="isHasPermissions('AGENT_MANAGEMENT:AGENT:EDIT')"
              @click="showEdit(scope.row)"
              size="mini"
              >编辑</el-button
            >
            <el-button type="danger" @click="delet(scope.row)" size="mini"
              >删除</el-button
            >
            <span
              v-if="isHasPermissions('AGENT_MANAGEMENT:AGENT:AGENT_STATUS')"
            >
              <el-button
                @click="forbit(scope.row)"
                v-if="scope.row.agentStatus === 'NORMAL'"
                type="danger"
                size="mini"
                >禁用</el-button
              >
              <el-button
                @click="recover(scope.row)"
                v-if="scope.row.agentStatus === 'FORBIDDEN'"
                type="warning"
                size="mini"
                >恢复</el-button
              >
            </span>
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
      title="恢复"
      :visible.sync="dialogOperateVisible"
      :showClose="showClose"
      width="30%"
    >
      <el-form :model="formOperate" :rules="rulesOperate" ref="formOperate">
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="formOperate.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogOperateVisible = false"
          >取消</el-button
        >
        <el-button @click="handleRecover">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :showClose="showClose"
      width="30%"
    >
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input
            v-model.number="form.phonenumber"
            type="number"
            placeholder="请输入手机号码"
          />
        </el-form-item>
        <el-form-item label="账号密码" prop="password">
          <el-input
            v-model="form.password"
            type=""
            placeholder="密码不能低于8位"
          />
        </el-form-item>
        <el-form-item label="真实姓名" prop="agentName">
          <el-input v-model="form.agentName" placeholder="请输入真实姓名" />
        </el-form-item>
        <p style="font-size: 16px">分成配置</p>
        <el-form-item label="代理分成" prop="payOffPercentage">
          <br />
          <el-row>
            <el-col :span="12">
              <el-form-item label="回本前:" label-width="59px">
                <el-input v-model="form.beforePayoffPercentage">
                  <span slot="suffix">%</span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="回本后:" label-width="59px">
                <el-input v-model="form.afterPayoffPercentage">
                  <span slot="suffix">%</span>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >取消</el-button
        >
        <el-button @click="onSubmit">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 换绑 -->
    <el-dialog title="换绑" :visible.sync="dialogVisibleEnd" width="30%">
      <el-form
        ref="formEnd"
        :model="formEnd"
        :rules="rules"
        label-width="110px"
        status-icon
      >
        <el-form-item label="换绑账号" prop="orderNo">
          <el-input
            type="text"
            :disabled="false"
            v-model="formEnd.phone"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEnd = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitEnd">提 交</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>
<script>
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import { requestApi } from "@/api/index";

export default {
  components: {
    Search,
    Pagination,
  },
  data() {
    const payOffPercentage = (rule, value, callback) => {
      if (
        this.form.beforePayoffPercentage === "" &&
        this.form.afterPayoffPercentage === ""
      ) {
        callback(new Error("请输入完整的代理分成"));
      } else {
        callback();
      }
    };
    return {
      optionsOrder: [
        { label: "代理商/加盟商", value: "AGENT" },
        { label: "商户", value: "STORE_ACCOUNT" },
        { label: "铺货员", value: "AGENT_SUB_ACCOUNT" },
      ],
      disabled: true,
      date: null,
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
      formEnd: {
        phone: "",
      },
 orderStatus: "",
 accountType:'',
 keyword2:'',
      dialogVisible: false,
      showClose: false,
      form: {
        agentName: "",
        phonenumber: "",
        password: "",
        beforePayoffPercentage: "",
        afterPayoffPercentage: "",
      },
      dialogTitle: "新增加盟商",
      rules: {
        agentName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
        ],
        phonenumber: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入账号密码", trigger: "blur" },
        ],
        payOffPercentage: [
          { required: true, trigger: "blur", validator: payOffPercentage },
        ],
      },
      keyword: "",
      startDate: "",
      endDate: "",
      placeholder: "请输入姓名或手机号",
      agentId: 0,
      formOperate: {
        remark: "",
      },
      rulesOperate: {
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
      },
      dialogOperateTitle: "禁止",
      dialogOperateVisible: false,
      dialogVisibleEnd: false,
      agentStatus: "",
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // isHasPermissions(permission) {
    //   const allPermissions = localStorage.getItem("allPermissions");
    //   if (allPermissions.includes(permission)) {
    //     this.isShowNewBtn = true;
    //   }
    //   return false
    // },
    // 数据导出
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "ID",
          "登入账号",
          "姓名",
          "联系方式",
          "开通时间",
          "上级",
          "分成比例",
          "总收益",
          "备注",
        ];

        const filterVal = [
          "agentId",
          "account",
          "agentName",
          "phonenumber",
          "password",
          "openTime",
          "superior",
          "percentage",
          "agentAmount",
          "remark",
        ];

        const data = this.formatJson(filterVal);

        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "加盟商列表导出",
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
    toCabinet(row) {
      this.$router.push({
        path: "/equipManage/rackList",
        query: {
          agengId: row.agentId,
        },
      });
    },
    recover(row) {
      this.dialogOperateVisible = true;
      this.agentStatus = row.agentStatus;
      this.agentId = row.agentId;
    },
    handleRecover() {
      const params = {
        agentStatus: "NORMAL",
        remark: this.formOperate.remark,
      };
      console.log(params);
      this.$refs.formOperate.validate((valid) => {
        if (valid) {
          requestApi(
            `/v1/platform/agent/${this.agentId}`,
            "put",
            params,
            "json"
          ).then((res) => {
            this.dialogOperateVisible = false;
            this.$message.success("保存成功");
            this.getList();
          });
        }
      });
    },
    // 删除
    delet(row) {
      console.log(112);
      this.$confirm("是否确认删除该条数据？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          requestApi(
            `/v1/platform/aaa/${row.agentId}`,
            "delete",
            {},
            "json"
          ).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 禁用
    forbit(row) {
      this.$confirm("是否确认禁用该加盟商账号，确认后账号不可使用", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          requestApi(
            `/v1/platform/agent/${row.agentId}`,
            "put",
            {
              agentStatus: "FORBIDDEN",
            },
            "json"
          ).then((res) => {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    // 换绑
    onSubmitEnd() {
      var phonenumber = this.formEnd.phone;
      // console.log(params);
      requestApi(
        `/v1/platform/manager/changeBind/` + phonenumber,
        "post",
        "json"
      )
        .then((res) => {
          console.log(1);
          this.dialogOperateVisible = false;
          this.$message({
            message: "换绑成功",
            type: "success",
          });
          this.getList();
        })
        .catch((res) => {
          console.log(2);
          this.dialogOperateVisible = false;
          this.$message.error("换绑失败");
          this.getList();
        });

      // this.$refs.formOperate.validate((valid) => {
      //   if (valid) {
      //   }
      // });
    },
    // 编辑
    showEdit(row) {
      this.disabled = false;
      this.dialogTitle = "编辑加盟商";
      this.agentId = row.agentId;
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },

    // 换绑
    In_tie(row) {
      this.disabled = false;
      this.dialogTitle = "编辑加盟商";
      this.agentId = row.agentId;
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogVisibleEnd = true;
    },

    add() {
      this.disabled = true;
      this.dialogVisible = true;
      this.dialogTitle = "新增加盟商";
      this.agentId = 0;
      this.form = {};
      // this.form.password="cy123456"
    },
    getList() {
      requestApi(
        `/v1/platform/agent/agents?keyword=${this.keyword}&startDate=${
          this.startDate || ""
        }&endDate=${this.endDate || ""}&pageNo=${
          this.listQuery.page
        }&pageSize=${this.listQuery.limit}&accountType=${this.accountType}&keyword2=${this.keyword2}`
      ).then((res) => {
        this.list = res.data.resultData.agents;
        this.total = res.data.resultData.totalNum;
      });
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        console.log(valid);
        if (valid) {
          this.save();
        } else {
          this.$message.info("星号为必填项！");
        }
      });
    },
    save() {
      console.log(this.form);
      requestApi(
        `/v1/platform/agent/${this.agentId}`,
        "post",
        this.form,
        "json"
      ).then((res) => {
        this.$message.success("保存成功");
        this.dialogVisible = false;
        this.getList();
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
      this.accountType=val
    },
  },
};
</script>
