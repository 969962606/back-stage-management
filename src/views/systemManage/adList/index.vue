<template>
  <div class="container">
    <el-button @click="add">新增广告</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      highlight-current-row
      :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
    >
      <el-table-column prop="adName" align="center" label="广告名称">
      </el-table-column>
      <el-table-column align="center" label="弹出广告图片">
        <template slot-scope="scope">
          <div>
            <img :src="scope.row.indexImage" width="50" height="50" alt="" />
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="底部广告图片">
        <template slot-scope="scope">
          <div>
            <img :src="scope.row.footerImage" width="50" height="50" alt="" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="adLink" label="广告链接" align="center">
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div>
            <el-button @click="edit(scope.row)" size="mini">编辑</el-button>
            <el-button :disabled="scope.row.adStatus === 'FORBIDDEN'" @click="forbidden(scope.row)" size="mini"
              >禁用</el-button
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="广告名称" prop="adName">
          <el-input type="text" v-model="form.adName"></el-input>
        </el-form-item>
        <el-form-item label="广告链接" prop="adLink">
          <el-input type="text" v-model="form.adLink"></el-input>
        </el-form-item>
        <el-form-item label="广告展示位" prop="adPosition">
          <el-checkbox-group @change="handleChecked" v-model="adPosition">
            <el-checkbox
              @change="handleCheckedItem($event, index)"
              v-for="(item, index) in adPositionList"
              :label="item.adPosition"
              :key="item.adPosition"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="hasAd" label="广告图片" prop="adImg">
          <el-row>
            <el-col v-if="isHome" :span="10">
              请上传弹出式广告图片
              <img
                v-if="form.indexImage"
                :src="form.indexImage"
                alt=""
                style="width: 200px;height: 200px"
              />
              <p v-else class="no-img"></p>
              <el-upload
                class="upload-demo"
                action=""
                :http-request="httpRequestIndex"
                multiple
                :limit="1"
                :file-list="fileList"
              >
                <el-button class="upload">上传图片</el-button>
              </el-upload>
            </el-col>
            <el-col v-if="isBottom" :span="10">
              <p class="top-txt">请上传底部广告图片</p>
              <img
                v-if="form.footerImage !== ''"
                :src="form.footerImage"
                alt=""
                style="width: 200px;height: 200px"
              />
              <p v-else class="no-img"></p>
              <el-upload
                class="upload-demo"
                action=""
                :http-request="httpRequestFooter"
                multiple
                :limit="1"
                :file-list="fileList"
              >
                <el-button class="upload">上传图片</el-button>
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { requestApi } from "@/api/index";
import { uploadFile, initConfig } from "@/utils/index";
import { getTimeString } from "@/utils/validate";

export default {
  components: {
    Search,
    Pagination
  },
  data() {
    const validateImg = (rule, value, callback) => {
      if (!this.form.indexImage && this.isHome) {
        callback(new Error("请上传弹出式广告图片"));
      } else if (!this.form.footerImage && this.isBottom) {
        callback(new Error("请上传底部式广告图片"));
      } else {
        callback();
      }
    };
    const validatePosition = (rule, value, callback) => {
      if (this.form.adPosition === undefined) {
        callback(new Error("请选择广告位"));
      } else {
        callback();
      }
    };
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
      dialogTitle: "新增广告",
      dialogVisible: false,
      form: {
        adName: "",
        adLink: "",
        adPosition: "",
        indexImage: "",
        footerImage: "",
        adId: 0
      },
      rules: {
        adName: [
          { required: true, message: "请输入广告名称", triggle: "blur" }
        ],
        adLink: [
          { required: true, message: "请输入广告链接", triggle: "blur" }
        ],
        adPosition: [
          { required: true, triggle: "change", validator: validatePosition }
        ],
        adImg: [{ required: true, triggle: "change", validator: validateImg }]
      },
      adPositionList: [
        { adPosition: "HOME", label: "首页" },
        { adPosition: "RENT_SUCCESS", label: "租借成功页" },
        { adPosition: "ORDER_DETAIL", label: "订单详情页" },
        { adPosition: "PAY_SUCCESS", label: "支付成功页" }
      ],
      adPosition: [],
      fileList: [],
      client: null,
      isHome: false,
      isBottom: false,
      hasAd: false
    };
  },
  async mounted() {
    this.getList();
    this.client = await initConfig();
  },
  methods: {
    edit(row) {
      this.adPosition = [];
      this.hasAd = false;
      this.isBottom = false;
      this.isHome = false;
      console.log(row, "row");
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogTitle = "编辑广告";
      this.dialogVisible = true;
      let arr = this.form.adPosition.split(":");
      console.log(arr, "arr");
      arr.forEach((item, array) => {
        this.adPosition.push(item);
      });
      console.log(this.adPosition, "adPosition");
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "HOME") {
          this.hasAd = true;
          this.isHome = true;
        } else if (
          arr[i] === "RENT_SUCCESS" ||
          arr[i] === "ORDER_DETAIL" ||
          arr[i] === "PAY_SUCCESS"
        ) {
          this.hasAd = true;
          this.isBottom = true;
        }
      }
    },
    forbidden(row) {
      requestApi(`/v1/platform/ad/${row.adId}`, 'put', {adStatus: 'FORBIDDEN'}, 'json').then(
        res => {
          this.getList();
        }
      )
    },
    handleDel(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          requestApi(`/v1/platform/ad/${row.adId}`, "delete", {}, "json").then(
            res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getList();
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    httpRequestIndex(res) {
      this.fileList = [];
      uploadFile(
        this.client,
        { file: res.file },
        "power/" + getTimeString(1)
      ).then(res => {
        this.form.indexImage = res.url;
        this.$forceUpdate();
      });
    },
    httpRequestFooter(res) {
      this.fileList = [];
      uploadFile(
        this.client,
        { file: res.file },
        "power/" + getTimeString(1)
      ).then(res => {
        this.form.footerImage = res.url;
        this.$forceUpdate();
      });
    },
    handleCheckedItem(checked, index) {
      console.log(checked, index, "index");
      if (index === 0) {
        this.isHome = checked;
        // 当编辑广告时，删除首页广告位的操作
        if (!this.isHome) {
          this.form.indexImage = "";
          console.log(this.isHome, this.form.indexImage, "删除操作");
        }
        if (this.isHome) {
          this.hasAd = true;
        }
      }
    },
    handleChecked(data) {
      console.log(data, "checked");
      let arr = "";
      if (data[0] === "HOME" && data.length === 1) {
        this.isBottom = false;
        if (!this.isBottom) {
          this.form.footerImage = "";
          console.log(this.isBottom, this.form.footerImage, "删除底部操作");
        }
      }
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          arr = data[i];
        } else {
          arr = `${arr}:${data[i]}`;
        }
        if (
          data[i] === "RENT_SUCCESS" ||
          data[i] === "ORDER_DETAIL" ||
          data[i] === "PAY_SUCCESS"
        ) {
          this.hasAd = true;
          this.isBottom = true;
        }
      }
      this.form.adPosition = arr;
    },
    add() {
      this.dialogVisible = true;
      if (this.$refs.form !== undefined) {
        this.$refs.form.resetFields();
      }
      this.form = {};
      this.form.indexImage = "";
      this.form.footerImage = "";
      this.form.adId = 0;
      this.adPosition = [];
      this.hasAd = false;
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          requestApi(
            `/v1/platform/ad/${this.form.adId}`,
            "post",
            this.form,
            "json"
          ).then(res => {
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
        `/v1/platform/ad/ads?&pageNo=${this.listQuery.page}&pageSize=${this.listQuery.limit}`
      ).then(res => {
        this.listLoading = false;
        this.list = res.data.resultData.ads;
        this.total = res.data.resultData.totalNum;
      });
    }
  }
};
</script>
