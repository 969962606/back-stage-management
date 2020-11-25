<template>
<!-- 设备/设备类型 -->
  <div class="container">
    <search :placeholder="placeholder" @searchHandle="searchHandle" />
    <el-button v-if="isHasPermissions('DEVICE_MANAGEMENT:DEVICE_TYPE:ADD')" @click="add" style="float: right">新增设备型号</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      highlight-current-row
      :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
    >
      <el-table-column prop="deviceModel" align="center" label="设备型号">
      </el-table-column>
      <el-table-column prop="createTime" align="center" label="创建时间">
      </el-table-column>
      <el-table-column prop="hardwareVersion" align="center" label="硬件版本号">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div>
            <el-button v-if="isHasPermissions('DEVICE_MANAGEMENT:DEVICE_TYPE:EDIT')" @click="edit(scope.row)" size="mini">编辑</el-button>
            <el-button v-if="isHasPermissions('DEVICE_MANAGEMENT:DEVICE_TYPE:DELETE')" size="mini" @click="handleDel(scope.row)"
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
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :showClose="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="设备型号" prop="deviceModel">
          <el-input type="text" v-model="form.deviceModel"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="form.createTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="硬件版本号" prop="hardwareVersion">
          <el-input type="text" v-model="form.hardwareVersion"></el-input>
        </el-form-item>
        <el-form-item label="设备出厂单价" prop="unitPrice">
          <el-input type="number" v-model.number="form.unitPrice"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">提 交</el-button>
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
      form: {
        deviceModel: "",
        createTime: "",
        hardwareVersion: "",
        unitPrice: null,
        deviceTypeId: 0
      },
      rules: {
        deviceModel: [
          { required: true, message: "请输入设备型号", triggle: "blur" }
        ],
        createTime: [
          { required: true, message: "请选择创建时间", triggle: "change" }
        ],
        hardwareVersion: [
          { required: true, message: "请输入硬件版本号", triggle: "blur" }
        ],
        unitPrice: [
          {
            type: "number",
            required: true,
            message: "请输入设备出厂单价",
            triggle: "blur"
          }
        ]
      },
      dialogVisible: false,
      dialogTitle: "新增设备类型",
      keyword: "",
      placeholder: "请输入设备型号"
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    edit(row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },
    searchHandle(val) {
      this.keyword = val;
      this.listQuery.page = 1;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      requestApi(
        `/v1/platform/deviceType/deviceTypes?keyword=${this.keyword}&pageNo=${this.listQuery.page}&pageSize=${this.listQuery.limit}`
      ).then(res => {
        this.list = res.data.resultData.deviceTypes;
        this.total = res.data.resultData.totalNum;
        this.listLoading = false;
      });
    },
    add() {
      this.dialogVisible = true;
      if (this.$refs.form !== undefined) {
        this.$refs.form.resetFields();
      }
      this.form = {};
      this.form.deviceTypeId = 0;
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save();
        } else {
          this.$message.success("请输入完整信息");
        }
      });
    },
    save() {
      requestApi(
        `/v1/platform/deviceType/${this.form.deviceTypeId}`,
        "post",
        this.form,
        "json"
      ).then(res => {
        this.$message.success("保存成功");
        this.getList();
        this.dialogVisible = false;
      });
    },
    handleDel(row) {
      this.$confirm(
        "该数据的设备类型有其他关联，删除后关联项也会被删除，是否确认继续删除？",
        "警告！",
        {
          confirmButtonText: "确 定",
          cancelButtonText: "取 消",
          type: "warning"
        }
      )
        .then(() => {
          requestApi(
            `/v1/platform/deviceType/${decodeURIComponent(row.deviceTypeId)}`,
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
    }
  }
};
</script>
