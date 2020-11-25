<template>
  <div class="container">
    <el-form :model="form" :rules="rules" ref="form">
      <el-row>
        计费规则：
      </el-row>
      <el-row class="rowTop">
        <el-form-item prop="charge_free_minute">
          <el-input
            class="inputWidth"
            v-model="form.charge_free_minute"
          ></el-input>
          分钟内免费
        </el-form-item>
        <el-row>
          <el-col :span="3">
            <el-form-item prop="hours">
              <el-select
                class="inputWidth"
                v-model="form.hours"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              小时
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item prop="yuan">
              <el-input class="inputWidth" v-model="form.yuan"></el-input>元
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="charge_ceiling">
          <el-input class="inputWidth" v-model="form.charge_ceiling"></el-input
          >元每天封顶
        </el-form-item>
      </el-row>
      <el-row
        class="rowTop"
        style="border-top: 1px solid #eee;padding-top: 20px"
      >
        提现规则：
      </el-row>
      <el-row>
        <el-form-item prop="withdraw_automated">
          提现金额大于等于
          <el-input
            class="inputWidth"
            v-model="form.withdraw_automated"
          ></el-input>
          元时进入人工审核
        </el-form-item>
        <el-form-item prop="withdraw_manul">
          提现金额小于
          <el-input class="inputWidth" v-model="form.withdraw_manul"></el-input>
          元时系统自助审核
        </el-form-item>
      </el-row>
      <el-row
        class="rowTop"
        style="border-top: 1px solid #eee;padding-top: 20px"
      >
        平台分成规则：
        <el-row class="rowTop">
          <el-form-item prop="before_payoff_percentage">
            回本前：<el-input
              class="inputWidth"
              v-model="form.before_payoff_percentage"
              ><span slot="suffix">%</span></el-input
            ></el-form-item
          >
          <el-form-item prop="before_payoff_percentage">
            回本后：<el-input
              class="inputWidth"
              v-model="form.before_payoff_percentage"
              ><span slot="suffix">%</span></el-input
            ></el-form-item
          >
        </el-row>
      </el-row>
      <el-row><el-button @click="onSubmit">确定</el-button></el-row>
    </el-form>
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
      form: {
        charge_free_minute: "",
        hours: "",
        yuan: "",
        charge: "",
        withdraw_manul: "",
        withdraw_automated: "",
        charge_ceiling: "",
        after_payoff_percentage: "",
        before_payoff_percentage: ""
      },
      options: [
        { label: "0.5", value: "0.5" },
        { label: "1", value: "1" },
        { label: "1.5", value: "1.5" },
        { label: "2", value: "2" }
      ],
      rules: {}
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      requestApi(`/v1/platform/rule`).then(res => {
        let arr = res.data.resultData.charge.split(":");
        let hours = arr[0];
        let yuan = arr[1];
        let {
          charge_free_minute,
          withdraw_manul,
          withdraw_automated,
          charge_ceiling,
          after_payoff_percentage,
          before_payoff_percentage
        } = res.data.resultData;
        this.form = {
          charge_free_minute,
          withdraw_manul,
          withdraw_automated,
          charge_ceiling,
          after_payoff_percentage,
          before_payoff_percentage,
          hours,
          yuan
        };
      });
    },
    onSubmit() {
      this.form.charge = `${this.form.hours}:${this.form.yuan}`;
      console.log(this.form.charge, "charge");
      this.$refs.form.validate(valid => {
        if (valid) {
          requestApi(`/v1/platform/rule`, "put", this.form, "json").then(
            res => {
              this.$message.success("保存成功");
              this.getList();
            }
          );
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.inputWidth {
  width: 100px;
  margin-right: 10px;
}
.rowTop {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
