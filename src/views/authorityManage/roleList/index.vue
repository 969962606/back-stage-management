<template>
<!-- 权限/角色列表 -->
  <div class="container">
    <el-button v-if="isHasPermissions('PERMISSION_MANAGEMENT:ROLE:ADD') && isOperation" @click="add">新增</el-button>
    <el-button v-if="!isOperation" @click="toSave">保存</el-button>
    <el-button v-if="!isOperation" @click="cancelSave">取消保存</el-button>
    <div class="content">
      <div class="left">
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          highlight-current-row
          :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
        >
          <el-table-column prop="roleName" align="center" label="角色名称">
          </el-table-column>
          <el-table-column prop="creator" align="center" label="创建人">
          </el-table-column>
          <el-table-column prop="creatTime" label="创建时间" align="center">
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <div v-if="isOperation">
                <el-button v-if="isHasPermissions('PERMISSION_MANAGEMENT:ROLE:ALLOCATION')" size="mini" @click="setAuth(scope.row)"
                  >设置权限</el-button
                >
                <el-button v-if="isHasPermissions('PERMISSION_MANAGEMENT:ROLE:EDIT')" size="mini" @click="edit(scope.row)">编辑</el-button>
                <el-button
                  v-if="isHasPermissions('PERMISSION_MANAGEMENT:ROLE:DELETE')"
                  type="danger"
                  size="mini"
                  @click="handleDel(scope.row)"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="total"
          :small="small"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList"
        />
      </div>
      <div class="right">
        <div class="header">关联权限</div>
        <BaseFormTable
          :data="baseFormData"
          :sourceData="baseFormSourceData"
          :hasStripe="false"
          :form="fromAuth"
          :checkDisabled="checkDisabled"
          @BaseFormTable="checkChange"
        />

        
      </div>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="30%"
        :showClose="false"
      >
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
          <el-form-item label="	角色名称" prop="roleName">
            <el-input type="text" v-model="form.roleName"></el-input>
          </el-form-item>
        </el-form> 
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit">完 成</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { requestApi } from "@/api/index";
import Pagination from "@/components/Pagination";
import BaseFormTable from "./components/base-form-table";
import { authority } from "@/utils/authority";
export default {
  components: {
    Pagination,
    BaseFormTable
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id"
      },
      small: true,
      keyword: "",
      placeholder: "请输入昵称或手机号",
      dialogTitle: "新增角色",
      dialogVisible: false,
      form: {
        roleName: "",
        roleId: ""
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", triggle: "blur" }
        ]
      },
      baseFormData: [
        {
          label: "firstLeval",
          prop: "firstLeval",
          width: 110
        },
        {
          label: "secondLeval",
          prop: "secondLeval",
          width: 150
        },
        {
          label: "thirdLeval",
          prop: "thirdLeval",
          width: 480
        }
      ],
      checkDisabled: true,
      baseFormSourceData: [],
      fromAuth: {
        authorities: [],
        operations: []
      },
      alterFlag: false,
      cloneBaseFormSourceData: null,
      originalData: null,
      isOperation: true,
      isShowAdd: true
    };
  },
  mounted() {
    this.getList();
    this.baseFormSourceData = JSON.parse(JSON.stringify(authority));
    // console.log(this.baseFormSourceData, 'base')
  },
  methods: {
    // 触发了角色
    checkChange(val) {
      console.log(val, "val");
      let cloneBaseFormSourceData = this.cloneBaseFormSourceData;
      let baseFormSourceData = this.baseFormSourceData;
      this.authCompare(cloneBaseFormSourceData, baseFormSourceData);
    },
    authCompare(arr1, arr2) {
      // 上一次的数据
      let tempArr1 = [];
      for (let xitem of arr1) {
        tempArr1.push({
          auth: xitem.auth,
          flag: xitem.flag,
          level: xitem.level
        });
        for (let yitem of xitem.secondTitle) {
          tempArr1.push({
            auth: yitem.auth,
            flag: yitem.flag,
            level: yitem.level
          });
          for (let zitem of yitem.items) {
            tempArr1.push({
              auth: zitem.auth,
              flag: zitem.flag,
              level: zitem.level
            });
          }
        }
      }
      // 有变化的数据
      let tempArr2 = [];
      for (let xitem of arr2) {
        tempArr2.push({
          auth: xitem.auth,
          flag: xitem.flag,
          level: xitem.level
        });
        for (let yitem of xitem.secondTitle) {
          tempArr2.push({
            auth: yitem.auth,
            flag: yitem.flag,
            level: yitem.level
          });
          for (let zitem of yitem.items) {
            tempArr2.push({
              auth: zitem.auth,
              flag: zitem.flag,
              level: zitem.level
            });
          }
        }
      }

      for (let i = 0; i < tempArr1.length; i++) {
        if (tempArr1[i].flag != tempArr2[i].flag) {
          if (tempArr2[i].flag) {
            // 选中了资源值
            let level = tempArr2[i].level.split("-");

            if (level.length == 1) {
              // 一级选中资源
              let index = level[0];
              arr2[index].flag = true;
              for (let yitem of arr2[index].secondTitle) {
                yitem.flag = true;
                for (let zitem of yitem.items) {
                  zitem.flag = true;
                }
              }
              this.baseFormSourceData = arr2;
              this.cloneBaseFormSourceData = JSON.parse(JSON.stringify(arr2));
            } else if (level.length == 2) {
              arr2[level[0]].flag = true;
              for (let zitem of arr2[level[0]].secondTitle[level[1]].items) {
                zitem.flag = true;
              }
              this.baseFormSourceData = arr2;
              this.cloneBaseFormSourceData = JSON.parse(JSON.stringify(arr2));
            } else {
              arr2[level[0]].flag = true;
              arr2[level[0]].secondTitle[level[1]].flag = true;
              this.baseFormSourceData = arr2;
              this.cloneBaseFormSourceData = JSON.parse(JSON.stringify(arr2));
            }
          } else {
            // 取消选中了资源值
            let level = tempArr2[i].level.split("-");
            if (level.length == 1) {
              // 一级取消选中资源
              let index = level[0];
              arr2[index].flag = false;
              for (let yitem of arr2[index].secondTitle) {
                yitem.flag = false;
                for (let zitem of yitem.items) {
                  zitem.flag = false;
                }
              }
              this.baseFormSourceData = arr2;
              this.cloneBaseFormSourceData = JSON.parse(JSON.stringify(arr2));
            } else if (level.length == 2) {
              // 取消子集选中

              for (let zitem of arr2[level[0]].secondTitle[level[1]].items) {
                zitem.flag = false;
              }
              this.baseFormSourceData = arr2;
              this.cloneBaseFormSourceData = JSON.parse(JSON.stringify(arr2));
            } else {
              this.baseFormSourceData = arr2;
              this.cloneBaseFormSourceData = JSON.parse(JSON.stringify(arr2));
            }
          }
        }
      }
    },
    setAuth(row) {
      console.log(row);
      this.isShowAdd = false;
      this.checkDisabled = false;
      this.isOperation = false
      // if (this.alterFlag) {
      //   return;
      // }
      // this.alterFlag = true;
      this.editRoleAuth(row);
    },
    editRoleAuth(row) {
      
      console.log(row, "permission");
      this.form.roleId = row.roleId;
      let baseFormSourceData = JSON.parse(JSON.stringify(authority));
      let permissions = row.permissions;
      for (let xitem of baseFormSourceData) {
        if (permissions.indexOf(xitem.auth) != -1) {
          xitem.flag = true;
        }
        console.log(1111);
        if (xitem.secondTitle) {
          for (let yitem of xitem.secondTitle) {
            if (permissions.indexOf(yitem.auth) != -1) {
              yitem.flag = true;
            }
            if (yitem.items) {
              for (let zitem of yitem.items) {
                if (permissions.indexOf(zitem.auth) != -1) {
                  zitem.flag = true;
                }
              }
            }
          }
        }
      }
      this.baseFormSourceData = baseFormSourceData;
      this.cloneBaseFormSourceData = JSON.parse(
        JSON.stringify(baseFormSourceData)
      );
      this.originalData = JSON.parse(JSON.stringify(baseFormSourceData));
    },
    toSave() {
      let baseFormSourceData = this.baseFormSourceData;
      let authArr = [];
      for (let xitem of baseFormSourceData) {
        if (xitem.flag) {
          authArr.push(xitem.auth);
        }
        if (xitem.secondTitle) {
          for (let yitem of xitem.secondTitle) {
            if (yitem.flag) {
              authArr.push(yitem.auth);
            }
            if (yitem.items) {
              for (let zitem of yitem.items) {
                if (zitem.flag) {
                  authArr.push(zitem.auth);
                }
              }
            }
          }
        }
      }
      let params = {
        permissions: authArr.join(";")
      };
      console.log(params, "params");
      requestApi(
        `/v1/platform/role/${this.form.roleId}`,
        "post",
        params,
        "json"
      ).then(res => {
        this.getList();
        this.checkDisabled = true;
        this.isOperation = true;
        this.$message.success('保存成功')
      });
    },
    cancelSave() {
      // this.alterFlag = false;
      this.isOperation = true;
      this.checkDisabled = true;
      this.baseFormSourceData = this.originalData;
      this.isShowAdd = true
    },
    edit(row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },
    getList() {
      this.listLoading = true;
      requestApi(
        `/v1/platform/role/roles?pageNo=${this.listQuery.page}&pageSize=${this.listQuery.limit}`
      ).then(res => {
        this.list = res.data.resultData.roles;
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
      this.form.roleId = 0;
      this.baseFormSourceData = JSON.parse(JSON.stringify(authority));
    },
    handleDel(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          requestApi(
            `/v1/platform/role/${row.roleId}`,
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
    onSubmit() {
      this.form.creatorId = 4;
      this.$refs.form.validate(valid => {
        if (valid) {
          requestApi(
            `/v1/platform/role/${this.form.roleId}`,
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.container {
  background: #fff;
  @include padding;
  & .content {
    @include flex;

    & .left {
      width: 60%;
    }
    & .right {
      width: 40%;
      padding-top: 34px;
      & .header {
        height: 48px;
        width: 100%;
        background: #f4f5f8;
        font-weight: bold;
        color: #666;
        display: flex;
        align-items: center;
        padding-left: 30px;
      }
    }
  }
}
</style>
