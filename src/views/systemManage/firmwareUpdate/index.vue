<template>
  <div class="container">
    <el-button @click="add">新增固件</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      highlight-current-row
      :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
    >
      <el-table-column prop="firmwareSize" align="center" label="固件大小">
      </el-table-column>
      <el-table-column prop="version" align="center" label="版本号">
      </el-table-column>
      <el-table-column prop="createTime" label="上传时间" align="center">
      </el-table-column>
      <el-table-column align="center" prop="description" label="固件描述">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div>
            <el-button @click="handleEdit(scope.row)" size="mini"
              >编辑</el-button
            >
            <el-button @click="handleDel(scope.row)" size="mini"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="固件链接" prop="url">
          <el-input type="text" v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="固件大小" prop="firmwareSize">
          <el-input type="number" v-model.number="form.firmwareSize"></el-input>
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input type="text" v-model="form.version"></el-input>
        </el-form-item>
        <el-form-item label="固件描述" prop="description">
          <el-input type="textarea" v-model="form.description"></el-input>
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
import Search from "@/components/Search";
import { valid } from "semver";
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
        url: "",
        firmwareSize: null,
        version: "",
        description: "",
        firmwareId: 0
      },
      rules: {
        url: [{ required: true, message: "请输入链接", triggle: "blur" }],
        firmwareSize: [
          {
            type: "number",
            required: true,
            message: "请输入固件大小",
            triggle: "blur"
          }
        ],
        version: [{ required: true, message: "请输入版本号", triggle: "blur" }],
        description: [
          { required: true, message: "请输入描述", triggle: "blur" }
        ]
      },
      dialogTitle: "",
      dialogVisible: false
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleDel(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          requestApi(`/v1/platform/firmware/${row.firmwareId}`, 'delete', {}, 'json').then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleEdit(row) {
      this.dialogTitle = "编辑固件";
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },
    add() {
      this.dialogTitle = "新增固件";
      this.dialogVisible = true;
      if (this.$refs.form !== undefined) {
        this.$refs.form.resetFields();
      }
      this.form = {};
      this.form.firmwareId = 0;
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save();
        }
      });
    },
    save() {
      requestApi(
        `/v1/platform/firmware/${this.form.firmwareId}`,
        "post",
        this.form,
        "json"
      ).then(res => {
        this.$message.success("保存成功");
        this.getList();
        this.dialogVisible = false;
      });
    },
    getList() {
      this.listLoading = true;
      requestApi(
        `/v1/platform/firmware/firmwares?pageNo=${this.listQuery.page}&pageSize=${this.listQuery.limit}`
      ).then(res => {
        this.list = res.data.resultData.firmwares;
        this.total = res.data.resultData.totalNum;
        this.listLoading = false;
      });
    }
  }
};
</script>
