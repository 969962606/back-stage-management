<template>
<!-- 加盟商/充电宝申请列表 -->
  <div class="container">
    <search :placeholder="placeholder" @searchHandle="searchHandle" />
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      highlight-current-rowId
      :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
    >
      <el-table-column prop="reissueId" align="center" label="ID">
      </el-table-column>
      <el-table-column prop="agentName" align="center" label="姓名">
      </el-table-column>
      <el-table-column prop="phonenumber" label="联系电话" align="center">
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">{{reissueStatusStr[scope.row.reissueStatus]}}</template>
      </el-table-column>
      <el-table-column align="center" prop="applyNum" label="申请数量">
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="申请时间">
      </el-table-column>
      <el-table-column align="center" prop="auditTime" label="审批时间">
      </el-table-column>
      <el-table-column align="center" prop="remark" label="备注">
      </el-table-column>
      <el-table-column align="center" label="操作" >
        <template slot-scope="scope">
          <div v-if="scope.row.auditStatus === 'PENDING'">
            <div v-if="isHasPermissions('AGENT_MANAGEMENT:APPLY_REISSUE:AUDIT_STATUS')">
              <el-button @click="reissue(scope.row)" size="mini">补发</el-button>
              <el-button @click="reject(scope.row)" size="mini">拒绝</el-button>
            </div>
            
          </div>
          <div v-else>
            {{scope.row.auditStatus === 'APPROVE'? '已补发': '已拒绝'}}
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
    <el-dialog title="拒绝" :visible.sync="dialogVisibleReject" width="30%">
      <el-form ref="formReject" :model="formReject" :rules="rulesReject">
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="formReject.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleReject"
          >完 成</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="补发充电宝"
      :visible.sync="dialogVisible"
      width="30%"
      :showClose="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="账号" prop="agentId">
          <el-input type="number" v-model.number="form.agentId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="充电宝数量" prop="reissuenNum">
          <el-input type="number" v-model="form.reissuenNum"></el-input>
        </el-form-item>
        <el-form-item label="快递单号" prop="expressNo">
          <el-input type="text" v-model="form.expressNo"></el-input>
        </el-form-item>
        <el-form-item label="快递名称" prop="expressName">
          <el-select v-model="form.expressName" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleReissue"
          >完 成</el-button
        >
      </span>
    </el-dialog>
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
      reissueStatusStr: {
        'YES': '已补发',
        'NO': '未补发'
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
      dialogVisible: false,
      form: {
        agentId: 0,
        reissuenNum: '',
        expressNo: "",
        expressName: "顺丰",
        remark: ""
      },
      options: [
        { label: "顺丰", value: "顺丰" },
        { label: "圆通", value: "圆通" },
        { label: "申通", value: "申通" }
      ],
      rules: {
        agentId: [
          { type: 'number', required: true, message: "请输入代理商账号", triggle: "blur" }
        ],
        reissuenNum: [
          { required: true, message: "请输入补发数量", triggle: "blur" }
        ],
        expressNo: [
          { required: true, message: "请输入快递单号", triggle: "blur" }
        ],
        expressName: [
          { required: true, message: "请选择快递名称", triggle: "change" }
        ],
        remark: [{ required: true, message: "请输入备注", triggle: "blur" }]
      },
      keyword: "",
      placeholder: "请输入姓名或手机号",
      formReject: {
        remark: ""
      },
      rulesReject: {
        remark: [{ required: true, message: "请输入备注", triggle: "blur" }]
      },
      dialogVisibleReject: false,
      reissueId: 0,
      agentId: ''
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    reject(row) {
      this.dialogVisibleReject = true;
      this.reissueId = row.reissueId;
      this.formReject.agentId = row.agentId;
    },
    handleReject() {
      this.formReject.auditStatus = 'REFUSE'
      this.$refs.formReject.validate((valid) => {
        if (valid) {
          requestApi(`/v1/platform/powerbank/reissue/${this.reissueId}`, 'put', this.formReject, 'json').then(
            res => {
              this.dialogVisibleReject = false;
              this.$message.success('保存成功');
              this.getList()
            }
          )
        }
      })
    },
    reissue(row) {
      console.log(row, '补发')
      this.dialogVisible = true;
      this.reissueId = row.reissueId;
      this.form = {};
      this.form.agentId = row.agentId;
    },
    handleReissue() {
      this.form.auditStatus = 'APPROVE'
      this.$refs.form.validate((valid) => {
        if (valid) {
          requestApi(`/v1/platform/powerbank/reissue/${this.reissueId}`, 'put', this.form, 'json').then(
            res => {
              this.dialogVisible = false;
              this.$message.success('保存成功');
              this.getList()
            }
          )
        }
      })
    },
    getList() {
      requestApi(
        `/v1/platform/reissue/reissues?keyword=${this.keyword}&pageNo=${this.listQuery.page}&pageSize=${this.listQuery.limit}`
      ).then(res => {
        this.list = res.data.resultData.applyReissues;
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
