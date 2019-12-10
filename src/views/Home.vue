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
          <typeSelector
            size="small"
            @type="getType"
            v-if="refresh"
          ></typeSelector>
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
      >
        <el-table-column width="200">
          <template slot-scope="scope">
            <el-image
              :src="getHeadImgUrl(scope.row.id, scope.row.picUrlList[0])"
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
            <router-link :to="getGoodsUrl(scope.row.id)" class="name">
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="typeName" label="商品类型" width="100">
        </el-table-column>
        <el-table-column prop="sellerUserName" label="卖家" width="100">
        </el-table-column>
        <el-table-column
          prop="minPrice"
          label="最低价/一口价"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="overTimeStr"
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
import typeSelector from "@/components/TypeSelector";

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
      loading: true,
      refresh: true
    };
  },
  components: {
    typeSelector
  },
  created() {
    let _this = this;
    api.getGoods().then(res => {
      // console.log(res.data);
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
        if (
          tableData[i].status === 2 ||
          (tableData[i].overTime < new Date().getTime() &&
            tableData[i].isBidMode == "true")
        ) {
          //已成交或者竞价结束的商品删除
          tableData.splice(i, 1);
        } else {
          //时间戳转时间字符串
          if (tableData[i].overTime) {
            _this.$set(
              tableData[i],
              "overTimeStr",
              formatTime(tableData[i].overTime, "Y/M/D/ h:m:s")
            );
          } else {
            _this.$set(tableData[i], "overTimeStr", "无");
          }

          //无竞拍价则填充暂无
          if (tableData[i].currentBuyerPrice === null) {
            _this.$set(tableData[i], "currentBuyerPrice", "暂无");
          }

          count++;
        }
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
      this.refresh = false;
      this.$nextTick(() => {
        this.refresh = true;
      });
      this.$refs["searchForm"].resetFields();
    },
    getHeadImgUrl: function(id, url) {
      if (id) {
        return `http://127.0.0.1:8081/goodsResource/${id}/pic/${url}`;
      } else {
        console.log("parse url failed");
        return undefined;
      }
    },
    getImgUrlList: function(id, urlList) {
      let list = [];
      urlList.forEach(element => {
        list.push(
          `http://127.0.0.1:8081/goodsResource/${id}/pic/${element}?t=${Math.random()}`
        );
      });
      return list;
    },
    getGoodsUrl(id) {
      return `/Goods/${id}`;
    }
  }
};
</script>

<style>
.el-form-item {
  margin: 10px;
}

.search {
  box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 4px, rgba(0, 0, 0, 0.04) 0px 0px 6px;
  border-radius: 5px;
  margin: 10px;
  background-color: white;
}

.displayTable {
  box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 4px, rgba(0, 0, 0, 0.04) 0px 0px 6px;
  margin: 10px;
}

.name:link {
  text-decoration: none;
  color: black;
}

.name:visited {
  text-decoration: none;
  color: black;
}

.name:hover {
  color: red;
  text-decoration: underline red;
}
</style>
