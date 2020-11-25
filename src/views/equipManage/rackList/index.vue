<template>
  <!-- 设备/机柜列表 -->
  <div class="container">
    <el-input
      class="search-input"
      v-model="keyword"
      placeholder="请输入机柜编号/名称"
      suffix-icon="el-icon-search"
    ></el-input>
    <el-input
      class="search-input"
      v-model="agentName"
      placeholder="请输入加盟商名称"
      suffix-icon="el-icon-search"
    ></el-input>
    <el-input
      class="search-input"
      v-model="storeName"
      placeholder="请输入商户名称"
      suffix-icon="el-icon-search"
    ></el-input>
    <span>
      <el-select
        @change="changeStatus"
        v-model="cabinetStatus"
        placeholder="设备状态："
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </span>
    <v-distpicker @selected="selected" class="vdistpicker"></v-distpicker>
    <el-button @click="search">查询</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      highlight-current-row
      :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        prop="cabinetNo"
        align="center"
        label="机柜编号"
      ></el-table-column>
      <el-table-column
        prop="cabinetName"
        align="center"
        label="机柜名称"
      ></el-table-column>
      <el-table-column
        prop="batchNo"
        label="生产批次"
        align="center"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="hardwareVersion"
        label="设备版本号"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="agentNames"
        label="归属加盟商"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="deviceModel"
        label="设备类型"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="telecomOperator"
        label="网络制式"
      ></el-table-column>
      <!-- <el-table-column align="center" prop="ieme" label="物联网编号">
      </el-table-column>-->
      <el-table-column
        align="center"
        prop="storeName"
        label="商家名称"
      ></el-table-column>
      <el-table-column align="center" label="省市区">
        <template slot-scope="scope">
          <div>
            {{ scope.row.province }} {{ scope.row.city }}
            {{ scope.row.district }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="detailAddress"
        label="设备地址"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="createTime"
        label="创建时间"
      ></el-table-column>
      <el-table-column align="center" prop="cabinetStatus" label="状态">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row.cabinetStatus === 'ONLINE'">在线</span>
            <span v-if="scope.row.cabinetStatus === 'OFFLINE'">离线</span>
            <span v-if="scope.row.cabinetStatus === 'UNPUBLISHED'">未投放</span>
            <span v-if="scope.row.cabinetStatus === 'BREAKAGE'">报损</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="二维码">
        <template slot-scope="scope">
          <div>
            <el-button @click="watchQRcode(scope.row)" size="mini"
              >查看</el-button
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <div>
            <el-button
              v-if="isHasPermissions('DEVICE_MANAGEMENT:CABINET:EDIT')"
              @click="edit(scope.row)"
              size="mini"
              >编辑</el-button
            >

            <el-button
              v-if="isHasPermissions('DEVICE_MANAGEMENT:CABINET:EDIT')"
              @click="slotmessage(scope.row)"
              size="mini"
              >插槽</el-button
            >

            <span v-if="isHasPermissions('DEVICE_MANAGEMENT:CABINET:BREAKAGE')">
              <el-button
                v-if="scope.row.cabinetState === 'BREAKAGE'"
                @click="refresh(scope.row)"
                size="mini"
                >恢复</el-button
              >
              <el-button
                v-else
                :disabled="scope.row.cabinetState === 'FORBIDDEN'"
                @click="breakage(scope.row)"
                size="mini"
                >报损</el-button
              >
            </span>
            <el-button
              v-if="isHasPermissions('DEVICE_MANAGEMENT:CABINET:DELETE')"
              :disabled="scope.row.cabinetStatus === 'BREAKAGE'"
              @click="handleDel(scope.row)"
              size="mini"
              >删除</el-button
            >
            <span
              v-if="
                isHasPermissions('DEVICE_MANAGEMENT:CABINET:CABINET_STATUS')
              "
            >
              <el-button
                v-if="scope.row.cabinetState === 'FORBIDDEN'"
                @click="refresh(scope.row)"
                size="mini"
                >恢复</el-button
              >
              <el-button
                v-else
                :disabled="scope.row.cabinetState === 'BREAKAGE'"
                @click="forbidden(scope.row)"
                size="mini"
                >禁用</el-button
              >
            </span>
            <el-button
              v-if="
                isHasPermissions('DEVICE_MANAGEMENT:CABINET:VIEW_POWERBANKS')
              "
              @click="toPowerList(scope.row)"
              size="mini"
              >充电宝</el-button
            >
            <el-button @click="toReset(scope.row)" size="mini"
              >重新分配</el-button
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
      title="编辑机柜信息"
      :visible.sync="dialogVisible"
      width="30%"
      :showClose="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="机柜编号" prop="cabinetNo">
          <el-input
            :disabled="true"
            type="text"
            v-model="form.cabinetNo"
          ></el-input>
        </el-form-item>
        <el-form-item label="机柜名称" prop="cabinetName">
          <el-input v-model="form.cabinetName"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceModel">
          <el-input
            :disabled="true"
            v-model="form.deviceModel"
            placeholder="请选择"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">提 1交</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="槽位信息"
      align="center"
      :visible.sync="information"
      width="510px"
      :showClose="false"
    >
      <div class="solt_massge">
        <div class="solt_footer" :v-model="dataList">
          <p>编号</p>
          <p>{{ dataList.cabinetNo }}</p>
        </div>
        <div class="solt_footer" :v-model="dataList">
          <p>网络</p>
          <p v-if="dataList.cabinetStatus == 'ONLINE'">在线</p>
          <p v-if="dataList.cabinetStatus == 'OFFLINE'">离线</p>
        </div>
        <div class="solt_footer">
          <p>槽位获取时间</p>
          <p>{{ dataList.updateTime }}</p>
        </div>
      </div>
      <div class="solt_popup">
        <div class="solt_hiden">
          <p @click="gengxin" style="color: #00c250; cursor: pointer">更新</p>
          <p style="color: #e57b3a; cursor: pointer" @click="qbtanchu()">
            弹出所有
          </p>
        </div>
      </div>
      <div class="solt_operation">
        <template>
          <el-table :data="dataList.slots" style="width: 100%">
            <el-table-column
              width="60px"
              prop="serialNumber"
              label="槽位"
            ></el-table-column>
            <el-table-column width="60px" prop="slotState" label="状态">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.slotStatus === 'EMPTY'">空</span>
                  <span v-if="scope.row.slotStatus === 'EXCEPTION'">异常</span>
                  <span v-if="scope.row.slotStatus === 'REGULAR'">正常</span>
                  <span v-if="scope.row.slotStatus === 'UNDER_CHARGE'"
                    >充电</span
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column width="60px" label="类型">三线</el-table-column>
            <el-table-column
              width="60px"
              prop="batteryPower"
              label="电量"
            ></el-table-column>
            <el-table-column width="60px" prop="chargeStatus" label="充电">
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.chargeStatus === false">否</span>
                  <span v-if="scope.row.chargeStatus === true">是</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              width="65px"
              align="center"
              prop="cabinetSlotId"
              label="ID"
            ></el-table-column>
            <el-table-column align="center" label="操作" width="100px">
              <template slot-scope="scope">
                <div class="hig">
                  <el-button
                    @click="tanchu(scope.row)"
                    style="color: #e33636"
                    class="tan"
                    >弹出1</el-button
                  >
                   <el-button
                    @click="tanchuq(scope.row)"
                    style="color: #e33636"
                    class="tan"
                    >弹出2</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <span style="display: block; height: 50px; lineheight: 50px"
        >*左起第一个槽位为一号槽位</span
      >
    </el-dialog>

    <el-dialog title="机柜二维码" :visible.sync="dialogVisibleCode" width="30%">
      <div class="qrContainer">
        <img :src="qrCode" alt width="200px" />
      </div>
    </el-dialog>
    <el-dialog title="重新分配" :visible.sync="dialogVisibleReset" width="30%">
      <el-form ref="forms" :model="forms" :rules="ruless" label-width="110px">
        <el-form-item label="代理商">
          <el-select
            v-model="forms.agentId"
            placeholder="请选择"
            @change="currStationChange"
          >
            <el-option
              v-for="item in agentList"
              :key="item.agentId"
              :label="item.agentName"
              :value="item.agentId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmitReset">提 交1</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { requestApi } from "@/api/index";
import Search from "@/components/Search";
import VDistpicker from "v-distpicker";
export default {
  components: {
    Search,
    Pagination,
    VDistpicker,
  },
  data() {
    return {
      storeId: "",
      machinery: {
        windowHeight: "",
        configModal: {
          showFlag: false,
          content: "是否确认撤机是否弹出 该机柜所有充电宝?",
          innerWidth: 350,
        },
        cabinetId: "",
        cabinetSlotId: 1, //弹出所有时为0
        data: null,
        updateTime: "",
        isAll: false,
      },
      cabinetSlotId: 1, //弹出所有时为0
      isAll: false,

      ros: "unll",
      dataList: "unll",
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
      dialogVisible: false,
      information: false,
      options: [
        { label: "正常", value: "REGULAR" },
        { label: "在线", value: "ONLINE" },
        { label: "离线", value: "OFFLINE" },
        { label: "报损", value: "BREAKAGE" },
        { label: "禁止", value: "FORBIDDEN" },
        { label: "未入库", value: "INBOUND" },
        { label: "已出库", value: "OUTBOUND" },
      ],
      form: {
        cabinetNo: "",
        cabinetName: "",
        deviceModel: "",
      },
      forms: {
        agentId: "",
      },
      rules: {
        cabinetNo: [
          { required: true, message: "请输入机柜编号", triggle: "blur" },
        ],
        cabinetName: [
          { required: true, message: "请输入机柜名称", triggle: "blur" },
        ],
        deviceModel: [
          { required: true, message: "请选择设备类型", triggle: "change" },
        ],
      },
      ruless: {
        agentId: [{ required: true, message: "请选择代理商", triggle: "blur" }],
      },
      keyword: "",
      address: "",
      agentName: "",
      storeName: "",
      cabinetStatus: "",
      agengId: "",
      qrCode: "",
      dialogVisibleCode: false,
      dialogVisibleReset: false,
      agentList: [],
      nameID: "",
      data_list:''
    };
  },
  mounted() {
    this.agengId = this.$route.query.agengId || "";

    console.log(this.agengId);

    if (this.agengId == "") {
      console.log(1);
      this.getList(this.agengId);
      this.getAgentlist();
    } else {
      console.log(2);
      this.getList(this.agengId);
      this.getAgentlist();
    }
  },
  methods: {
    currStationChange(val) {
      // console.log("currStationChange", val);
      this.nameID = val;
    },
    watchQRcode(row) {
      this.dialogVisibleCode = true;
      this.qrCode = row.qrCode;
    },
    toPowerList(row) {
      this.$router.push({
        path: "/equipManage/powerList",
        query: { cabinetNo: row.cabinetNo },
      });
    },
    toReset(row) {
      // console.log(row);
      this.storeId = row.storeId;
      this.forms.agentId = row.agentId;
      this.forms.cabinetId = row.cabinetId;
      this.dialogVisibleReset = true;
    },
    refresh(row) {
      this.$confirm("是否恢复使用该设备？", "提示！", {
        confirmButtonText: "确 定",
        cancelButtonText: "取 消",
        type: "warning",
      })
        .then(() => {
          requestApi(
            `/v1/platform/cabinet/status`,
            "put",
            {
              cabinetId: row.cabinetId,
              cabinetState: "REGULAR",
            },
            "json"
          ).then((res) => {
            this.getList();
            this.$message({
              type: "success",
              message: "操作成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    forbidden(row) {
      this.$confirm("是否确认禁用该设备，确认后不可使用", "警告！", {
        confirmButtonText: "确 定",
        cancelButtonText: "取 消",
        type: "warning",
      })
        .then(() => {
          requestApi(
            `/v1/platform/cabinet/status`,
            "put",
            {
              cabinetId: row.cabinetId,
              cabinetState: "FORBIDDEN",
            },
            "json"
          ).then((res) => {
            this.getList();
            this.$message({
              type: "success",
              message: "操作成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    breakage(row) {
      this.$confirm(
        "是否将该机柜设置为报损状态？确认后不可再进行更改",
        "警告！",
        {
          confirmButtonText: "确 定",
          cancelButtonText: "取 消",
          type: "warning",
        }
      )
        .then(() => {
          requestApi(
            `/v1/platform/cabinet/status`,
            "put",
            {
              cabinetId: row.cabinetId,
              cabinetState: "BREAKAGE",
            },
            "json"
          ).then((res) => {
            this.getList();
            this.$message({
              type: "success",
              message: "操作成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },

    edit(row) {
      this.dialogVisible = true;
      this.form = JSON.parse(JSON.stringify(row));
    },
    // 获取机柜信息
    slotmessage(row) {
      // console.log( row);
      var sex = row.city;
      var ss = sex + "";
      // console.log(ss == 'null');
      // console.log(row.city.toString() == "");
      if (ss == "null") {
        //  console.log("unll");
        this.$alert("此机柜暂无插槽信息", {
          confirmButtonText: "确定",
        });
        return;
      } else {
        // console.log("no unll");
        this.information = true;
        this.form = JSON.parse(JSON.stringify(row));
        // console.log(row);
        this.ros = row;
        requestApi(`/v1/wx/merchant/cabinet/${row.cabinetId}/slots`).then(
          (res) => {
            // console.log(res);
            this.dataList = res.data.resultData;
            this.machinery = res.data.resultData;
            // console.log(this.machinery);
          }
        );
        return;
      }
    },
    // 更新机柜信息

    gengxin(row) {
      // console.log(212);
      // console.log(this.dataList);
      requestApi(`/v1/wx/merchant/cabinet/${this.ros.cabinetId}/slots`).then(
        (res) => {
          this.dataList = res.data.resultData;
          this.$message.success("更新成功");
        }
      );
    },

    tanchu(e) {
      // console.log(e.cabinetSlotId);

      this.$confirm("是否弹出该充电宝?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.isAll = true;
          // console.log(this.isAll);

          requestApi(
            `/v1/wx/merchant/cabinet/${this.ros.cabinetId}/slots/${e.cabinetSlotId}/0`,
            "post"
          ).then((res) => {
            this.$message({
              type: "success",
              message: "弹出成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消弹出",
          });
        });
    },
      tanchuq(e) {
      // console.log(e.cabinetSlotId);

      this.$confirm("是否弹出该充电宝?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.isAll = true;
          // console.log(this.isAll);

          requestApi(
            `/v1/wx/merchant/cabinet/${this.ros.cabinetId}/slots/${e.cabinetSlotId}/1`,
            "post"
          ).then((res) => {
            this.$message({
              type: "success",
              message: "弹出成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消弹出",
          });
        });
    },
    // 全部弹出
    qbtanchu(e) {
      this.$confirm("是否弹出所有充电宝?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.isAll = true;
          // console.log(this.isAll);

          requestApi(
            `/v1/wx/merchant/cabinet/${this.ros.cabinetId}/slots`,
            "post"
          ).then((res) => {
            this.$message({
              type: "success",
              message: "弹出成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消弹出",
          });
        });
    },

    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          requestApi(
            `/v1/platform/cabinet/${this.form.cabinetId}`,
            "put",
            {
              cabinetName: this.form.cabinetName,
              deviceModel: this.form.deviceModel,
            },
            "json"
          ).then((res) => {
            this.$message.success("保存成功");
            this.getList();
            this.dialogVisible = false;
          });
        }
      });
    },
    onCancel() {
      this.$refs.forms.resetFields();
      this.dialogVisibleReset = false;
    },
    onSubmitReset() {
      // console.log(this.forms, "forms");
      // console.log(this.forms.agentId);
      if (!this.forms.agentId) {
        this.$message.error("请选择代理商");
        return;
      }
      requestApi(
        `v1/platform/cabinet/${this.forms.cabinetId}/redistribute`,
        "put",
        {
          agentId: this.forms.agentId,
          storeId: this.storeId,
        },
        "json"
      ).then((res) => {
        if (res.data.resultStatus) {
          this.$message.success("分配成功");
          this.$refs.forms.resetFields();
          this.getList();
          this.dialogVisibleReset = false;
        }
      });
    },
    changeStatus(val) {
      this.cabinetStatus = val;
    },
    selected(data) {
      this.address = `${data.province.value}${data.city.value}${data.area.value}`;
      if (this.address === "省市区") {
        this.address = "";
      }
    },
    getList(list_ID) {
      // 判断是否有agentId传入
      if (list_ID) {
        console.log("true");

        var regPos = /^[0-9]+.?[0-9]*/; //判断是否是数字。
        console.log(regPos.test(list_ID));
    
        if (regPos.test(list_ID)) {
          console.log('a');
          this.data_list=list_ID
          this.listLoading = true;
          console.log(list_ID);
          const managerId = JSON.parse(localStorage.getItem("resultData"))
            .managerId;
          requestApi(
            `/v1/platform/cabinet/cabinets?keyword=${this.keyword}&storeName=${
              this.storeName
            }&agentName=${this.agentName}&address=${
              this.address
            }&searchCabinetType=${this.cabinetStatus || ""}&pageNo=${
              this.listQuery.page
            }&pageSize=${
              this.listQuery.limit
            }&managerId=${managerId}&agentId=${list_ID}`
          ).then((res) => {
            this.list = res.data.resultData.cabinets;
            // console.log(this.list);
            this.total = res.data.resultData.totalNum;
            this.listLoading = false;
          });
        } else {
          console.log('b');
          this.listLoading = true;
          console.log(list_ID);
          list_ID = this.data_list;
          const managerId = JSON.parse(localStorage.getItem("resultData"))
            .managerId;
          requestApi(
            `/v1/platform/cabinet/cabinets?keyword=${this.keyword}&storeName=${
              this.storeName
            }&agentName=${this.agentName}&address=${
              this.address
            }&searchCabinetType=${this.cabinetStatus || ""}&pageNo=${
              this.listQuery.page
            }&pageSize=${
              this.listQuery.limit
            }&managerId=${managerId}&agentId=${list_ID}`
          ).then((res) => {
            this.list = res.data.resultData.cabinets;
            // console.log(this.list);
            this.total = res.data.resultData.totalNum;
            this.listLoading = false;
          });
        }
      } else {
        console.log('c');
        list_ID = "";
        this.listLoading = true;
        const managerId = JSON.parse(localStorage.getItem("resultData"))
          .managerId;
        requestApi(
          `/v1/platform/cabinet/cabinets?keyword=${this.keyword}&storeName=${
            this.storeName
          }&agentName=${this.agentName}&address=${
            this.address
          }&searchCabinetType=${this.cabinetStatus || ""}&pageNo=${
            this.listQuery.page
          }&pageSize=${
            this.listQuery.limit
          }&managerId=${managerId}&agentId=${list_ID}`
        ).then((res) => {
          this.list = res.data.resultData.cabinets;
          // console.log(this.list);
          this.total = res.data.resultData.totalNum;
          this.listLoading = false;
        });
      }
    },

    getAgentlist() {
      requestApi(`v1/platform/agent/comboBox`).then((res) => {
        if (res.data.resultStatus) {
          this.agentList = res.data.resultData;
        }
      });
    },
    // 查询
    search() {
      this.agengId = "";
      this.getList(this.agengId);
      this.getAgentlist();
    },
    handleDel(row) {
      this.$confirm("是否确认删除该设备？", "警告！", {
        confirmButtonText: "确 定",
        cancelButtonText: "取 消",
        type: "warning",
      })
        .then(() => {
          requestApi(
            `/v1/platform/cabinet/${row.cabinetId}`,
            "delete",
            { cabinetStatus: row.cabinetStatus },
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
  },
};
</script>
<style  scoped>
.solt_massge {
  width: 100%;
  /* height: 50px; */
}
.solt_popup {
  width: 100%;
  /* height: 50px; */
}
.solt_operation {
  width: 100%;
  /* height: 50px; */
}
.solt_footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  border-bottom: 1px solid #f4f5f8;
  font-size: 18px;
  line-height: 40px;
}

.solt_hiden {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  border-bottom: 1px solid #f4f5f8;
  padding: 0 50px;
  font-size: 18px;
  line-height: 40px;
  border-top: 4px solid #f4f5f8;
}
.hig {
  display: flex;
  justify-content: space-between;
  width: 80px;
}
.tan {
  background-color: #fff;
  border: 1px solid #fff;
  width: 30px;
  height: 30px;
  padding: 0;
  line-height: 15px;
}
</style>
<style lang="">
.el-dialog__body {
  padding: 0 20px;
}
.el-button--mini {
  margin-bottom: 10px;
}
.search-input {
  margin-bottom: 20px !important;
}
.el-table .cell {
  line-height: 36px !important;
}
</style>