<!-- 表格嵌套表单 -->
<template>
  <div class="base-form-table">
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <template :table="table" class="base-table">
        <el-table
        :data="sourceData"
        border
        :stripe='hasStripe'
        :header-cell-style="{display: displayStyle, background: '#eee'}"
        v-loading='table.loading'
        :highlight-current-row='table.hignlight'
        ref='table'
        show-overflow-tooltip='“true”'
        empty-text='暂无数据'

        >
        <el-table-column
        :label="indexLabel"
        type="index"
        align="center"
        v-if="hasIndex"
        width="80">
       </el-table-column>
        <el-table-column
        v-for="item in data"
        :key='item.label'
        :label='item.label'
        :prop='item.prop'
        :min-width='item.width'
        :align='item.align'
        >
        <template slot-scope="scope">
          <el-form-item v-if="item.prop === 'firstLeval'">
            <el-checkbox v-model="scope.row.flag" :disabled='checkDisabled' @change='checkChange' > {{ scope.row.label }} </el-checkbox>
          </el-form-item>
          <div v-if="item.prop === 'secondLeval'" class="secondLeval-box">
            <el-form-item  v-for="item in scope.row.secondTitle" :key="item.label">
              <el-checkbox v-model="item.flag" :disabled='checkDisabled' @change='checkChange' > {{ item.label }} </el-checkbox>
            </el-form-item>
          </div>
          <div v-if="item.prop === 'thirdLeval'" class="thirdLeval-box">
            <el-form-item v-for="item in scope.row.secondTitle" :key="item.label">
                <el-checkbox v-for="checkbox in item.items" v-model="checkbox.flag" :key="checkbox.label" name="operations" :disabled='checkDisabled' :label="checkbox.label" @change='checkChange' ></el-checkbox>
            </el-form-item>
          </div>
          <div v-if="item.prop === 'fourthLeval'" class="fourthLeval-box">
            <!-- <el-form-item v-for="(item, index) in scope.row.fourthTitle" :key="index">
              <el-radio-group  v-model="form.radio">
                <el-radio v-for="radio in item.items" :key="radio.label" name="radiop" :label="radio.label"></el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item>
              <el-radio></el-radio>
            </el-form-item>
          </div>
        </template>
        </el-table-column>
        </el-table>
      </template>
    </el-form>
  </div>
</template>

<script>
export default{
  data () {
    return {
      // 表格基本样式设置
      table: {
        loading: false, // 是否有加载动画
        hignlight: true // 是否高亮当前行
      }
    }
  },
  props: {
    // 表格是否有序号列
    hasIndex: {
      type: Boolean,
      default: false
    },
    // 表格是否是stripe
    hasStripe: {
      type: Boolean,
      default: true
    },
    // 序号列label
    indexLabel: {
      type: String,
      default: ' '
    },
    form: {
      type: Object,
      default () {
        return {}
      }
    },
    sourceData: {
      type: Array,
      default () {
        return []
      }
    },
    data: {
      type: Array,
      default () {
        return []
      }
    },
    // 表头是否显示
    displayStyle: {
      type: String,
      default: 'none'
    },
    checkDisabled:{
      type:Boolean,
      default:true
    }
  },
  methods: {
    // 合并表格
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return [1, 3]
      }
    },
    checkChange(ev){
      this.$emit('checkChange',ev)
    },
  }
}
</script>

<style scoped lang="scss">
.base-form-table{
  width: 100%;
}

.thirdLeval-box{
  display: flex;
  flex-direction: column;
}
</style>
