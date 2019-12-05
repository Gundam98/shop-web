<template>
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
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip content="编辑" placement="bottom">
              <el-button
                icon="el-icon-edit"
                type="warning"
                @click="edit(scope.row.id, scope.$index)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="bottom">
              <el-button
                icon="el-icon-delete"
                type="danger"
                @click="remove(scope.row.id, scope.$index)"
              ></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import api from "@/utils/api";
import formatTime from "@/utils/formatTime";

export default {
  data() {
    return {
      tableData: [],
      loading: true
    };
  },
  created() {
    let _this = this;
    api.getMyDemand().then(res => {
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
    getDemandUrl(id) {
      return `/Demand/${id}`;
    },
    remove: function(id, i) {
      let _this = this;
      api
        .removeDemand(id)
        .then(res => {
          _this.tableData.splice(i, 1);
          _this.$message.success("删除成功");
        })
        .catch(e => e);
    },
    edit: function(id, i) {
      this.$router.push(`/DemandGoods/${id}`);
    }
  }
};
</script>
