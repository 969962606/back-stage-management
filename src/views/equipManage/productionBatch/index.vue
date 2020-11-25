<template>
<!-- 设备/生产批次的新增批次 -->
  <div class="container">
    <search :placeholder="placeholder" @searchHandle="searchHandle" />
    <el-button
      v-if="isHasPermissions('DEVICE_MANAGEMENT:BATCH:ADD')"
      @click="add"
      style="float: right"
      >新增批次</el-button
    >
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      highlight-current-row
      :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
    >
      <el-table-column prop="batchNo" align="center" label="批次编号">
      </el-table-column>
      <el-table-column prop="productDate" align="center" label="生产日期">
      </el-table-column>
      <el-table-column prop="productNum" label="生产数量" align="center">
      </el-table-column>
      <el-table-column align="center" prop="deviceModel" label="设备型号">
      </el-table-column>
      <el-table-column align="center" prop="remark" label="备注">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div>
            <el-button
              v-if="isHasPermissions('DEVICE_MANAGEMENT:BATCH:ADD')"
              @click="watch(scope.row)"
              size="mini"
              >查看</el-button
            >
            <el-button
              v-if="isHasPermissions('DEVICE_MANAGEMENT:BATCH:EDIT')"
              @click="edit(scope.row)"
              size="mini"
              >编辑</el-button
            >
            <el-button
              v-if="isHasPermissions('DEVICE_MANAGEMENT:BATCH:DELETE')"
              @click="handleDelete(scope.row)"
              type="danger"
              size="mini"
              >删除</el-button
            >
            <a
              v-if="isHasPermissions('DEVICE_MANAGEMENT:BATCH:EXPORT_QRCODE')"
              @click="exportQrCode(scope.row)"
              ref="exportCode"
            >
              <el-button type="info" size="mini">
                导出二维码
              </el-button>
            </a>
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
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="批次编号" prop="batchNo">
          <el-input type="text" v-model="form.batchNo"></el-input>
        </el-form-item>
        <el-form-item label="生产日期" prop="productDate">
          <el-date-picker
            v-model="form.productDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="生产数量" prop="productNum">
          <el-input type="number" v-model.number="form.productNum"></el-input>
        </el-form-item>
        <el-form-item label="充电宝数量" prop="powerbankNum">
          <el-input type="number" v-model.number="form.powerbankNum"></el-input>
        </el-form-item>
        <el-form-item label="设备型号" prop="deviceTypeId">
          <el-select v-model.number="form.deviceTypeId" placeholder="请选择">
            <el-option
              v-for="item in deviceList"
              :key="item.deviceModel"
              :label="item.deviceModel"
              :value.number="item.deviceTypeId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">提 交1</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="机柜编号"
      :visible.sync="dialogVisibleCabinet"
      width="30%"
    >
      <el-table
        v-loading="listLoadingCabinet"
        :data="listCabinet"
        element-loading-text="Loading"
        highlight-current-row
        :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
      >
        <el-table-column prop="cabinetNo" align="center" label="机柜编号">
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
      BASEURL: process.env.BASE_URL,
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
      dialogTitle: "新增批次",
      dialogVisible: false,
      form: {
        batchNo: "",
        productDate: "",
        productNum: null,
        powerbankNum: null,
        deviceTypeId: null,
        remark: "",
        batchId: 0
      },
      rules: {
        batchNo: [
          { required: true, message: "请输入批次编号", triggle: "blur" }
        ],
        productDate: [
          { required: true, message: "请选择生产日期", triggle: "change" }
        ],
        productNum: [
          {
            type: "number",
            required: true,
            message: "请输入生产数量",
            triggle: "blur"
          }
        ],
        powerbankNum: [
          {
            type: "number",
            required: true,
            message: "请输入充电宝数量",
            triggle: "blur"
          }
        ],
        deviceTypeId: [
          {
            type: "number",
            required: true,
            message: "请选择设备型号",
            triggle: "blur"
          }
        ],
        remark: [{ required: true, message: "请输入批次编号", triggle: "blur" }]
      },
      keyword: "",
      placeholder: "请输入批次编号或设备型号",
      deviceList: null,
      dialogVisibleCabinet: false,
      listCabinet: null,
      listLoadingCabinet: false
    };
  },
  mounted() {
    this.getList();
    this.getDeviceType();
  },
  methods: {
    exportQrCode(row) {
      let link =
        this.BASEURL + "/v1/platform/batch/" + row.batchId + "/exportQrCode";
      window.open(link, "_self");
    },
    watch(row) {
      this.dialogVisibleCabinet = true;
      requestApi(
        `/v1/platform/batch/${row.batchId}/cabinets`,
        "get",
        {},
        "json"
      ).then(res => {
        this.listCabinet = res.data.resultData;
      });
    },
    getList() {
      this.listLoading = true;
      requestApi(
        `/v1/platform/batch/batches?keyword=${this.keyword}&pageNo=${this.listQuery.page}&pageSize=${this.listQuery.limit}`
      ).then(res => {
        this.list = res.data.resultData.batches;
        this.total = res.data.resultData.totalNum;
        this.listLoading = false;
      });
    },
    handleDelete(row) {
      this.$confirm("该数据的设备类型无其他关联，确认删除吗？", "警告！", {
        confirmButtonText: "确 定",
        cancelButtonText: "取 消",
        type: "warning"
      })
        .then(() => {
          requestApi(
            `/v1/platform/batch/${row.batchId}`,
            "delete",
            {},
            "json"
          ).then(res => {
            this.getList();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    add() {
      this.dialogVisible = true;
      this.dialogTitle = "新增批次";
      if (this.$refs.form !== undefined) {
        this.$refs.form.resetFields();
      }
      this.form = {};
      this.form.batchId = 0;
    },
    edit(row) {
      this.dialogTitle = "编辑批次";
      this.dialogVisible = true;
      this.form = JSON.parse(JSON.stringify(row));
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save();
        } else {
          this.$message.info("请输入完整信息！");
          return;
        }
      });
    },
    save() {
      requestApi(
        `/v1/platform/batch/${this.form.batchId}`,
        "post",
        this.form,
        "json"
      ).then(res => {
        this.dialogVisible = false;
        this.$message.success("保存成功");
        this.getList();
      });
    },
    searchHandle(val) {
      this.keyword = val;
      this.listQuery.page = 1;
      this.getList();
    },
    getDeviceType() {
      requestApi(`/v1/platform/deviceType/deviceTypes/comboBox`).then(res => {
        console.log();
        this.deviceList = res.data.resultData;
      });
    }
  }
};
</script>
