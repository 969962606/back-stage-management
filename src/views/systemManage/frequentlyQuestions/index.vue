<template>
  <div class="container">
    <el-button @click="add">添加常见问题</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      highlight-current-row
      :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
    >
      <el-table-column type="index" width="50" label="排序"> </el-table-column>
      <el-table-column prop="question" align="center" label="问题">
      </el-table-column>
      <el-table-column prop="answer" align="center" label="答案">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div>
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button @click="handleDel(scope.row)" size="mini"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    /> -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="问题名" prop="question">
          <el-input type="text" v-model="form.question"></el-input>
        </el-form-item>
        <el-form-item label="具体答案" prop="answer">
          <el-input type="textarea" v-model="form.answer"></el-input>
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
      dialogVisible: false,
      dialogTitle: "新增常见问题",
      form: {
        question: "",
        answer: "",
        faqId: 0
      },
      rules: {
        question: [{ required: true, message: "请输入问题", tirrgle: "blur" }],
        answer: [{ required: true, message: "请输入答案", tirrgle: "blur" }]
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    add() {
      this.dialogTitle = "新增常见问题";
      this.dialogVisible = true;
      if (this.$refs.form !== undefined) {
        this.$refs.form.resetFields();
      }
      this.form = {};
      this.form.faqId = 0;
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save();
        }
      });
    },
    handleEdit(row) {
      // https://gitee.com/shenzhen_chongya/management_backstage.git
      // git@gitee.com:shenzhen_chongya/management_backstage.git
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogTitle = "编辑常见问题";
      this.dialogVisible = true;
    },
    handleDel(row) {
      this.$confirm("是否确认删除该条数据？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          requestApi(
            `/v1/platform/faq/${row.faqId}`,
            "delete",
            {},
            "json"
          ).then(res => {
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
    save() {
      requestApi(
        `/v1/platform/faq/${this.form.faqId}`,
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
      requestApi(`/v1/platform/faq/faqs`).then(res => {
        this.listLoading = false;
        this.list = res.data.resultData;
      });
    }
  }
};
</script>
