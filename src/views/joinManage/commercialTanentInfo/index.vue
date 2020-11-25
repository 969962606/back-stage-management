<template>
<!-- 加盟商/商户信息 -->
  <div class="container">
    <el-input
      class="search-input"
      v-model="keyword"
      placeholder="请输入商铺名称或商铺电话"
      suffix-icon="el-icon-search"
    ></el-input>
    <el-input
      class="search-input"
      v-model="agentNames"
      placeholder="请输入设备归属人"
      suffix-icon="el-icon-search"
    ></el-input>

    <span>
      商铺分类：
      <el-select
        @change="selectChange"
        v-model="storeType"
        clearable
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
    </span>
    <el-button @click="searchHandle">查询</el-button>
 <el-button class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    <el-table
      size="mini"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      highlight-current-row
      :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
    >
      <el-table-column prop="storeName" align="center" label="商铺名称">
      </el-table-column>
      <el-table-column label="商铺封面" align="center">
        <template slot-scope="scope">
          <div>
            <img
              :src="scope.row.storeBanner"
              style="width: 100px; height: 100px"
              alt=""
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="storeOwner" label="商铺联系人">
      </el-table-column>
      <el-table-column align="center" prop="phonenumber" label="商铺电话">
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="省市区">
        <template slot-scope="scope">
          <div>
            {{ scope.row.province }} {{ scope.row.city }}
            {{ scope.row.district }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="detailAddress" label="详细地址">
      </el-table-column>
      <el-table-column align="center" prop="agentNames" label="设备归属人">
      </el-table-column>
      <el-table-column align="center" prop="deviceNum" label="设备数量">
      </el-table-column>
      <el-table-column align="center" prop="storeType" label="商铺类型">
      </el-table-column>
      <el-table-column align="center" prop="businessHours" label="营业时间">
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间">
      </el-table-column>
      <el-table-column align="center" prop="storeAmount" label="总收入">
        <template slot-scope="scope">
          {{scope.row.storeAmount | dealMoney}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="percentage" label="抽成比">
      </el-table-column>
      <el-table-column align="center" prop="chargeStandard" label="收费策略">
      </el-table-column>
      <el-table-column align="center" prop="remark" label="备注">
      </el-table-column>
      <el-table-column align="center" label="操作" width="250px">
        <template slot-scope="scope">
          <div>
            <el-button v-if="isHasPermissions('AGENT_MANAGEMENT:STORE:EDIT')" @click="edit(scope.row)" size="mini">编辑</el-button>
            <el-button v-if="isHasPermissions('AGENT_MANAGEMENT:STORE:DELETE')" @click="handleDel(scope.row)" size="mini"
              >删除</el-button
            >
            <el-button v-if="isHasPermissions('AGENT_MANAGEMENT:STORE:DIVIDED')" size="mini" @click="divideRecord(scope.row)"
              >分成记录</el-button
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
      title="编辑商铺"
      :visible.sync="dialogVisible"
      width="50%"
      @open="dialogOpen"
      :showClose="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="商铺" prop="storeName">
          <el-input type="text" v-model="form.storeName"></el-input>
        </el-form-item>
        <el-form-item label="商铺类型" prop="storeType">
          <el-select v-model="form.storeType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商铺电话" prop="phonenumber">
          <el-input type="text" v-model="form.phonenumber"></el-input>
        </el-form-item>
        <el-form-item label="商铺联系人" prop="storeOwner">
          <el-input type="text" v-model="form.storeOwner"></el-input>
        </el-form-item>
        <!-- <el-form-item label="省市区" prop="select">
          <v-distpicker
            class="distpicker"
            @province="changeProvince"
            @city="changeCity"
            @area="changeArea"
            :province="form.province"
            :city="form.city"
            :area="form.district"
          ></v-distpicker>
        </el-form-item> -->

        <el-form-item label="详细地址" prop="detailAddress">
          <el-input
            placeholder="搜索地点"
            v-model="form.detailAddress"
            suffix-icon="el-icon-search"
            id="tipinput"
          ></el-input>
        </el-form-item>
        <el-form-item label="门牌号" prop="streetNumber">
          <el-input v-model="form.streetNumber"></el-input>
        </el-form-item>
        <div>
          <!-- <input type="text"  class="search_input" placeholder="请输入地址" v-model="address"></input> -->
        </div>
        <div style="display:flex;width:100%;margin-top:30px;">
          <div id="iCenter"></div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">提 交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分成记录" :visible.sync="dividedRecordDialog" width="50%">
      <el-table
        size="mini"
        v-loading="recordLoading"
        :data="recordList"
        element-loading-text="Loading"
        highlight-current-row
        :header-cell-style="{ background: '#F4F5F8', color: '#666666' }"
      >
        <el-table-column align="center" prop="cabinetNo" label="设备编号">
        </el-table-column>
        <el-table-column align="center" prop="orderNo" label="订单编号">
        </el-table-column>
        <el-table-column align="center" prop="fee" label="订单金额">
            <template slot-scope="scope">
              {{scope.row.payAmount | dealMoney}}
            </template>
        </el-table-column>
        <el-table-column align="center" prop="endTime" label="订单时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="agentsShareMoneyProportion"
          label="分成金额"
        >
          <template slot-scope="scope">
              {{scope.row.shareMoney }}
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="totalDivide"
        :page.sync="listQueryDivide.page"
        :limit.sync="listQueryDivide.limit"
        @pagination="getListRecord"
      />
      
    </el-dialog>
  </div>
</template>

<script>
import MapLoader from '@/plugins/amap.js'
import Search from '@/components/Search'
import Pagination from '@/components/Pagination'
import { requestApi } from '@/api/index'
import VDistpicker from 'v-distpicker'
export default {
  components: {
    Search,
    Pagination,
    VDistpicker
  },
  data () {
    const validateSelect = (rule, value, callback) => {
      if (
        this.form.province === '' &&
        this.form.city === '' &&
        this.form.district
      ) {
        callback(new Error('请输入省市区'))
      } else if (this.form.district === '' || this.form.district === '区') {
        callback(new Error('请输入区'))
      } else {
        callback()
      }
    }
    return {
      list: null,
      listLoading: false,
      storeType: '',
      options: [
        { label: '餐厅', value: '餐厅' },
        { label: '酒店', value: '酒店' },
        { label: '医院', value: '医院' },
        { label: '咖啡馆', value: '咖啡馆' },
        { label: 'KTV', value: 'KTV' },
        { label: '车站', value: '车站' },
        { label: '其他场所', value: '其他场所' }
      ],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      dialogVisible: false,
      form: {
        storeName: '',
        detailAddress: '',
        streetNumber: '',
        storeType: '',
        phonenumber: '',
        storeOwner: '',
        province: '',
        city: '',
        district: '',
        storeId: '',
        longitude: null,
        latitude: null
      },
      rules: {
        storeName: [
          { required: true, message: '请输入商铺名称', trigger: 'blur' }
        ],
        storeType: [
          { required: true, message: '请选择商铺类型', trigger: 'change' }
        ],
        phonenumber: [
          { required: true, message: '请输入商铺电话', trigger: 'blur' }
        ],
        storeOwner: [
          { required: true, message: '请输入商铺联系人', trigger: 'blur' }
        ],
        // select: [
        //   { required: true, message: "请选择省市区", validator: validateSelect }
        // ],
        detailAddress: [
          { required: true, message: '请选择详细地址', trigger: 'change' }
        ]
        // streetNumber: [
        //   { required: true, message: "请选择具体门牌号", trigger: "blur" }
        // ]
      },
      dividedRecordDialog: false,
      recordList: null,
      recordLoading: false,
      keyword: '',
      agentNames: '',
      zoom: 16,
      listQueryDivide: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      totalDivide: 0,
      storeId: 0,
      marker: [],
      markerSelect: [],
      markerClick: [],
      mapObj: '', // 地图对象
      selectedIndex: -1,
      geocoder: null
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    // 数据导出
      handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['商铺名称', '商铺联系人', '商铺电话', '省市区', '详细地址', '设备归属人', '设备数量', '商铺类型', '营业时间', '创建时间', '总收入', '抽成比', '收费策略', '备注']
        
        const filterVal =  ['storeName', 'storeOwner', 'phonenumber', 'createTime', 'detailAddress', 'agentNames', 'deviceNum', 'storeType', 'businessHours', 'createTime', 'storeAmount', 'percentage', 'chargeStandard', 'remark']
        
        const data = this.formatJson(filterVal)
   
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '导出'
        })
        this.downloadLoading = false
      })
    },
     formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },

    dialogOpen () {
      this.mapInit()
    },
    mapInit () {
      let _this = this
      MapLoader().then(AMap => {
        _this.mapObj = new AMap.Map('iCenter', {
          resizeEnable: true,
          zoom: 20
        })
        _this.marker = new AMap.Marker()
        var auto = new AMap.Autocomplete({
          input: 'tipinput'
        })
        _this.mapObj.setCenter(
          new AMap.LngLat(this.form.longitude, this.form.latitude)
        )
        _this.mapObj.add(_this.marker)
        AMap.event.addListener(auto, 'select', function (data) {
          // console.log(data, "data");
          let latitude = data.poi.location.lat
          let longitude = data.poi.location.lng
          _this.form.longitude = longitude
          _this.form.latitude = latitude
          _this.form.detailAddress = data.poi.name
          _this.form.streetNumber = ''
          _this.mapObj.setCenter(new AMap.LngLat(longitude, latitude))
          _this.marker = new AMap.Marker({
            position: [longitude, latitude]
          })
          _this.mapObj.add(_this.marker)
        })
        AMap.plugin('AMap.Geocoder', function () {
          _this.geocoder = new AMap.Geocoder()
        })
        _this.mapObj.on('click', function (e) {
          var lnglat = [e.lnglat.getLng(), e.lnglat.getLat()]
          _this.geocoder.getAddress(lnglat, function (status, result) {
            // console.log(status, result, "1111111");
            if (status === 'complete' && result.info === 'OK') {
              let district = `${result.regeocode.addressComponent.province}${result.regeocode.addressComponent.city}${result.regeocode.addressComponent.district}`
              _this.form.streetNumber =
                result.regeocode.addressComponent.streetNumber
              let detailAddress = result.regeocode.formattedAddress
              _this.form.detailAddress = detailAddress.slice(district.length)
              _this.form.longitude = e.lnglat.getLng()
              _this.form.latitude = e.lnglat.getLat()
              _this.marker = new AMap.Marker({
                position: [e.lnglat.getLng(), e.lnglat.getLat()]
              })
              _this.mapObj.clearMap()
              _this.mapObj.setCenter(new AMap.LngLat(e.lnglat.getLng(), e.lnglat.getLat()))
              _this.mapObj.add(_this.marker)
            }
          })
        })
      })
    },
    divideRecord (row) {
      this.dividedRecordDialog = true
      this.getListRecord()
      this.storeId = row.storeId
    },
    getListRecord () {
      requestApi(
        `/v1/platform/sharemoneyrecord/sharemoneyrecords?storeId=${this.storeId}&pageNo=${this.listQueryDivide.page}&pageSize=${this.listQueryDivide.limit}&keyword=&agentNames=`
      ).then(res => {
        this.recordList = res.data.resultData.records
        this.totalDivide = res.data.resultData.totalNum
      })
    },
    handleDel (row) {
      this.$confirm('是否确认删除该条数据？?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          requestApi(
            `/v1/platform/store/${row.storeId}`,
            'delete',
            {},
            'json'
          ).then(res => {
            this.getList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    changeProvince (data) {
      this.form.province = data.value
    },
    changeCity (data) {
      this.form.city = data.value
    },
    changeArea (data) {
      this.form.district = data.value
    },
    edit (row) {
      if (this.$refs.form !== undefined) {
        this.$refs.form.resetFields()
      }
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
      this.form.longitude = row.longitude
      this.form.latitude = row.latitude
    },
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          requestApi(
            `/v1/platform/store/${this.form.storeId}`,
            'put',
            this.form,
            'json'
          ).then(res => {
            this.getList()
            this.$message.success('保存成功')
            this.dialogVisible = false
          })
        }
      })
    },
    getList () {
      this.listLoading = true
      requestApi(
        `/v1/platform/store/stores?keyword=${this.keyword}&agentNames=${this.agentNames}&pageNo=${this.listQuery.page}&pageSize=${this.listQuery.limit}&storeType=${this.storeType}`
      ).then(res => {
        this.listLoading = false
        this.list = res.data.resultData.stores
        this.total = res.data.resultData.totalNum
      })
    },
    searchHandle () {
      this.listQuery.page = 1
      this.getList()
    },
    selectChange (val) {
      this.storeType = val
    }
  }
}
</script>

<style>
.amap-sug-result {
  z-index: 3000 !important;
}
#iCenter {
  height: 500px;
  width: 100%;
}
</style>
