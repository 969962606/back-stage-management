<template>
<!-- 加盟商/出库记录 -->
  <div class="container">
    <search :placeholder="placeholder" @searchHandle="searchHandle"/> 
    <el-button v-if="isHasPermissions('AGENT_MANAGEMENT:OUTBOUND:ADD')" @click="add" style="float: right">新建记录</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      highlight-current-row
      :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
    >
      <el-table-column prop="agentId" align="center" label="ID">
      </el-table-column>
      <el-table-column prop="agentName" align="center" label="购买人">
      </el-table-column>
      <el-table-column prop="phonenumber" label="联系电话" align="center">
      </el-table-column>
      <el-table-column
        prop="buyNum"
        class-name="status-col"
        label="购买数量"
        align="center"
      >
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="出库时间">
      </el-table-column>
      <el-table-column align="center" prop="expressName" label="物流公司">
      </el-table-column>
      <el-table-column align="center" prop="expressNo" label="物流单号">
      </el-table-column>
      <el-table-column align="center" prop="remark" label="备注">
      </el-table-column>
      <el-table-column align="center" label="设备编号">
        <template slot-scope="scope">
          <div>
            <el-button @click="searchRecord(scope.row)" size="mini">查看</el-button>
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
    <el-dialog title="新增记录" :visible.sync="dialogVisible" width="30%">
      <el-form :model="form" ref="form" :rules="rules" label-width="125px">
        <el-form-item label="购买人" prop="agentId">
          <el-select v-model="form.agentId" placeholder="请选择">
            <el-option
              v-for="item in comboList"
              :key="item.agentId"
              :label="item.agentName"
              :value="item.agentId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="购买人联系方式" prop="phonenumber">
          <el-input type="number" v-model.number="form.phonenumber"></el-input>
        </el-form-item>
        <el-form-item label="购买数量" prop="buyNum">
          <el-input type="text" v-model="form.buyNum">
            <span slot="suffix">台</span>
          </el-input>
        </el-form-item>
        <el-form-item label="快递公司" prop="expressName">
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
        <el-form-item label="快递单号" prop="expressNo">
          <el-input type="number" v-model.number="form.expressNo"></el-input>
        </el-form-item>
        <el-form-item label="批次选择" prop="batchNos">
          <el-checkbox-group @change="handleCheckedb" v-model="batchNos">
            <el-checkbox
              v-for="(item, index) in batchList"
              :label="item.deviceModel"
              :key="index"
            >
              {{ item.deviceModel }}
            </el-checkbox>
          </el-checkbox-group>
          已选择({{ changeSex }})个批次
        </el-form-item>
        <el-form-item label="设备选择" prop="cabinetNos">
          <el-checkbox-group @change="handleChecked" v-model="cabinetNos">
            <el-checkbox
              v-for="(item, index) in cabinetsList"
              :label="item.cabinetNo"
              :key="index"
            >
              {{ item.cabinetNo }}
            </el-checkbox>
          </el-checkbox-group>
          已选择({{ changeNum }})台
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">提 交</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="设备编号"
      :visible.sync="dialogVisibleDevice"
      width="30%"
    >
    <el-table
      v-loading="listLoadingDevice"
      :data="listDevice"
      element-loading-text="Loading"
      highlight-current-row
      :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
    >
      <el-table-column prop="cabinetNo" align="center" label="设备编号">
      </el-table-column>
    </el-table>
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
      options: [
        { label: "顺丰", value: "顺丰" },
        { label: "圆通", value: "圆通" },
        { label: "申通", value: "申通" }
      ],
      form: {
        agentId: "",
        phonenumber: null,
        buyNum: "",
        expressName: "",
        expressNo: "",
        cabinetNos: "",
        batchNos: "",
        remark: "",
        outboundId: 0,
        managerId: 4
      },
      deda:{

      },
      rules: {
        agentId: [
          { required: true, message: "请选择加盟商", trigger: "change" }
        ],
        phonenumber: [
          {
            type: "number",
            required: true,
            message: "请输入购买人联系方式",
            trigger: "blur"
          }
        ],
        buyNum: [
          { required: true, message: "请输入购买数量", trigger: "blur" }
        ],
        expressName: [
          { required: true, message: "请选择快递公司", trigger: "change" }
        ],
        expressNo: [
          { type: 'number', required: true, message: "请输入快递单号", trigger: "blur" }
        ],
        cabinetNos: [
          { required: true, message: "请输入设备编号", trigger: "blur" }
        ],
        batchNos: [
          { required: true, message: "请输入设备批次", trigger: "blur" }
        ],
       
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }]
      },
      cabinetsList: [],
      batchList: [],
      comboList: [],
      batchNos: [],
      cabinetNos: [],
      changeNum: 0,
      changeSex: 0,
      placeholder: '请输入姓名或手机号',
      keyword: '',
      dialogVisibleDevice: false,
      listDevice: [],
      listLoadingDevice: false
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    searchRecord(row) {
      this.dialogVisibleDevice = true;
      this.listLoadingDevice = true;
      requestApi(`/v1/platform/outbound/${row.outboundId}/cabinets`).then(
        res => {
          this.listLoadingDevice = false;
          this.listDevice = res.data.resultData;
        }
      )
    },
    searchHandle(val) {
      this.keyword = val;
      this.listQuery.page = 1;
      this.getList();
    },
    handleCheckedb(data) {
      console.log(data);
      this.changeSex = data.length;
      let Array = "";
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          Array = data[i];
        } else {
          Array = `${Array}:${data[i]}`;
        }
      }
      this.form.batchNos = Array;

    },
    handleChecked(data) {
        console.log(data);
      this.changeNum = data.length;
      let arr = "";
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          arr = data[i];
        } else {
          arr = `${arr}:${data[i]}`;
        }
      }
      this.form.cabinetNos = arr;
    },
    changeExpress(val) {
      this.form.expressName = val;
    },
    add() {
      this.dialogVisible = true;
      this.form = {};
      this.form.outboundId = 0;
      this.getCabinetsList();
      this.getBatchList();
      this.getComboList();
    },
    onSubmit() {
      console.log(this.form);
      if (this.changeNum !== parseInt(this.form.buyNum)) {
        this.$message.info("选择设备的数量与购买数量不相等");
        return false;
      }
      this.$refs.form.validate(valid => {
        this.form.managerId = 4;
        if (valid) {
          requestApi(
            `/v1/platform/outbound/${this.form.outboundId}`,
            "post",
            this.form,
            "json"
          ).then(res => {
            this.$message.success('保存成功')
            this.getList();
            this.dialogVisible = false;
          });
        }
      });
    },
    getList() {
      this.listLoading = true;
      requestApi(
        `/v1/platform/outbound/outbounds?keyword=${this.keyword}&pageNo=${this.listQuery.page}&pageSize=${this.listQuery.limit}`
      ).then(res => {
        this.list = res.data.resultData.outbounds;
        this.total = res.data.resultData.totalNum;
        this.listLoading = false;
      });
    },
    getCabinetsList() {

      requestApi(`/v1/platform/cabinet/inbound?cabinetStatus=INBOUND`).then(
        res => {
          //  console.log(res.data.resultData);
          this.cabinetsList = res.data.resultData.equipment;
           this.batchList = res.data.resultData.production;
           console.log(this.batchList);
        }
      );
    },
    getBatchList() {

      requestApi(`/v1/platform/cabinet/inbound?cabinetStatus=INBOUND`).then(
        res => {
          //  console.log(res.data.resultData);
          this.batchList = res.data.resultData.production;
        }
      );
    },
    getComboList() {
      
      requestApi(`/v1/platform/agent/comboBox`).then(res => {
        // console.log(res.data.resultData);
        this.comboList = res.data.resultData;
      });
    }
  }
};
</script>
<style lang="">
  .s{
    display: block;
  }
</style>
