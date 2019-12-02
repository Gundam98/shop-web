<template>
  <div class="home">
    <div class="search">
      <el-form :model="searchForm" :inline="true" ref="searchForm">
        <el-form-item label="商品名:" prop="name">
          <el-input
            v-model="searchForm.name"
            placeholder="商品名"
            size="small"
            style="width:100px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="商品类型:" prop="type">
          <typeSelector size="small" @type="getType"></typeSelector>
        </el-form-item>
        <el-form-item label="价格区间:">
          <el-row>
            <el-col :span="11">
              <el-form-item prop="minPrice" style="margin-top:0">
                <el-input
                  v-model="searchForm.minPrice"
                  placeholder="起拍价"
                  type="number"
                  size="small"
                  style="width:100px"
                  clearable
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="maxPrice" style="margin-top:0">
                <el-input
                  v-model="searchForm.maxPrice"
                  placeholder="最高价"
                  type="number"
                  size="small"
                  style="width:100px"
                  clearable
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" size="small">
            提交
          </el-button>
          <el-button @click="resetForm" size="small">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="displayTable">
      <el-table
        :data="tableData"
        stripe
        highlight-current-row
        style="width: 100%"
        empty-text="暂无上架商品"
        v-loading="loading"
        lazy
      >
        <el-table-column
          prop="name"
          label="商品名"
          width="250"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <router-link :to="getGoodsUrl(scope.row.id)" class="name">
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="typeName" label="商品类型" width="100">
        </el-table-column>
        <el-table-column prop="sellerUserName" label="卖家" width="150">
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
        <el-table-column prop="statusName" label="商品状态"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import api from "@/utils/api";
import formatTime from "@/utils/formatTime";
import typeSelector from "@/components/TypeSelector";
import judgeStatus from "@/utils/judgeStatus";

export default {
  name: "home",
  data() {
    return {
      searchForm: {
        name: "",
        minPrice: null,
        maxPrice: null,
        type: ""
      },
      tableData: [],
      loading: true
    };
  },
  components: {
    typeSelector
  },
  created() {
    let _this = this;
    api.getGoods().then(res => {
      _this.tableData = _this.processTableData(res.data);
      _this.loading = false;
    });
  },
  methods: {
    processTableData: function(data) {
      let tableData = data;
      let _this = this;
      let count = 0;
      while (count < tableData.length) {
        let i = count;
        //时间戳转时间字符串
        _this.$set(
          tableData[i],
          "overTime",
          formatTime(tableData[i].overTime, "Y/M/D/ h:m:s")
        );

        //无竞拍价则填充暂无
        if (tableData[i].currentBuyerPrice === null) {
          _this.$set(tableData[i], "currentBuyerPrice", "暂无");
        }

        //判断商品状态
        _this.$set(tableData[i], "statusName", judgeStatus(tableData[i]));

        count++;
      }
      return tableData;
    },
    getType(data) {
      this.searchForm.type = data;
    },
    submitForm: function() {
      if (
        parseInt(this.searchForm.minPrice) <=
          parseInt(this.searchForm.maxPrice) ||
        !this.searchForm.minPrice ||
        !this.searchForm.maxPrice
      ) {
        let _this = this;
        this.loading = true;
        api
          .getGoods({
            name: this.searchForm.name || null,
            minPrice: this.searchForm.minPrice,
            maxPrice: this.searchForm.maxPrice,
            type: this.searchForm.type || null
          })
          .then(res => {
            _this.tableData = _this.processTableData(res.data);
            _this.loading = false;
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        this.$message.error("最低值不能高于最高值");
        return;
      }
    },
    resetForm: function() {
      this.$refs["searchForm"].resetFields();
    },
    getGoodsUrl(id) {
      return `/Goods/${id}`;
    }
  }
};
</script>
