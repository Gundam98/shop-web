<template>
  <div class="home">
    <div class="search">
      <el-row>
        <el-form :inline="true" :model="searchForm" ref="searchForm">
          <el-form-item label="商品名:">
            <el-input
              v-model="searchForm.name"
              placeholder="商品名"
              size="small"
              style="width:100px"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品类型:">
            <el-select
              v-model="searchForm.type"
              placeholder="商品类型"
              size="small"
              style="width:100px"
            >
              <el-option label="生活用品" value="commodity"></el-option>
              <el-option label="食品" value="food"></el-option>
              <el-option label="电子产品" value="electronics"></el-option>
              <el-option label="家电" value="appliance"></el-option>
              <el-option label="学习用品" value="stationery"></el-option>
              <el-option label="娱乐" value="entertainment"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格区间:">
            <el-col :span="11">
              <el-input
                v-model="searchForm.minPrice"
                placeholder="最低价"
                type="number"
                size="small"
                style="width:100px"
              >
              </el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-input
                v-model="searchForm.maxPrice"
                placeholder="最高价"
                type="number"
                size="small"
                style="width:100px"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()" size="small">
              提交
            </el-button>
            <el-button @click="resetForm('searchForm')" size="small">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
    <div>
      <el-table
        :data="tableData"
        stripe
        highlight-current-row
        style="width: 100%"
        empty-text="暂无上架商品"
        v-loading="loading"
      >
        <el-table-column width="200">
          <template slot-scope="scope">
            <el-image
              :src="getImgUrl(scope.row.picUrl)"
              :preview-src-list="[getImgUrl(scope.row.picUrl)]"
              fit="contain"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品名"
          width="250"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <router-link
              :to="getGoodsUrl(scope.row.id)"
              style="text-decoration:none;color:black"
            >
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="typeName" label="商品类型" width="100">
        </el-table-column>
        <el-table-column prop="sellerName" label="卖家" width="150">
        </el-table-column>
        <el-table-column
          prop="minPrice"
          label="最低价"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="overTime"
          label="结束时间"
          width="250"
        ></el-table-column>
        <el-table-column
          prop="currentBuyerPrice"
          label="当前出价"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import api from "@/utils/api";
import formatTime from "@/utils/formatTime";

export default {
  name: "home",
  data() {
    return {
      searchForm: {
        name: "",
        minPrice: 0,
        maxPrice: 0,
        type: ""
      },
      tableData: [],
      loading: true
    };
  },
  created() {
    let _this = this;
    api.getAllGoods().then(res => {
      _this.tableData = _this.processTableData(res.data);
      _this.loading = false;
    });
  },
  computed: {},
  methods: {
    processTableData: function(data) {
      let tableData = data;
      let _this = this;
      let count = 0;
      while (count < tableData.length) {
        let i = count;
        if (tableData[i].overTime < new Date().getTime()) {
          tableData.splice(i, 1);
        } else {
          //时间戳转时间字符串
          _this.$set(
            tableData[i],
            "overTime",
            formatTime(tableData[i].overTime, "Y/M/D/ h:m:s")
          );

          //通过卖家id获取卖家名字
          api.getUserInfo(tableData[i].sellerUserId).then(res => {
            _this.$set(tableData[i], "sellerName", res.data.username);
          });

          //商品类型转换
          api.getGoodsType(tableData[i].type).then(res => {
            _this.$set(tableData[i], "typeName", res.data.typeName);
          });
          count++;
        }
      }
      return tableData;
    },
    submitForm: function() {
      if (this.searchForm.minPrice <= this.searchForm.maxPrice) {
        console.log(this.searchForm);
      } else {
        this.$message.error("最低值不能高于最高值");
        return;
      }
    },
    resetForm: function(formName) {
      this.$refs[formName].resetFields();
    },
    getImgUrl: function(url) {
      if (url) {
        return `http://10.128.248.142:8081/picUrl/${url}`;
      }
      return undefined;
    },
    getGoodsUrl(id) {
      return `/Goods/${id}`;
    }
  }
};
</script>
