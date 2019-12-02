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
          <type-selector
            size="small"
            @type="getType"
            v-if="refresh"
          ></type-selector>
        </el-form-item>
        <el-form-item label="价格区间:">
          <el-row>
            <el-col :span="11">
              <el-form-item prop="minPrice" style="margin-top:0">
                <el-input
                  v-model="searchForm.minPrice"
                  placeholder="最低价"
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
        empty-text="暂无求购商品"
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
            <router-link class="name" :to="getDemandUrl(scope.row.id)">
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="typeName" label="商品类型" width="150">
        </el-table-column>
        <el-table-column prop="description" label="商品描述" width="250">
        </el-table-column>
        <el-table-column prop="publisherUserName" label="求购用户" width="150">
        </el-table-column>
        <el-table-column
          prop="idealPrice"
          label="心理预期价"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="createTimeStr"
          label="发布时间"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="offerGoodsIdListCount"
          label="已提供商品"
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
  name: "demandHome",
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
    api.getDemand().then(res => {
      //console.log(res.data);
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
          "createTimeStr",
          formatTime(tableData[i].createTime, "Y/M/D/ h:m:s")
        );

        _this.$set(
          tableData[i],
          "offerGoodsIdListCount",
          tableData[i].offerGoodsIdList.length
        );
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
          .getDemand({
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
    getDemandUrl(id) {
      return `/Demand/${id}`;
    }
  }
};
</script>
