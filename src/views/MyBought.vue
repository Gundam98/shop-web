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
      <el-table-column width="200">
        <template slot-scope="scope">
          <el-image
            :src="getHeadImgUrl(scope.row.id, scope.row.picUrlList[0])"
            :preview-src-list="
              getImgUrlList(scope.row.id, scope.row.picUrlList)
            "
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
          <router-link class="name" :to="getGoodsUrl(scope.row.id)">
            {{ scope.row.name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="typeName" label="商品类型" width="150">
      </el-table-column>
      <el-table-column prop="description" label="商品描述" width="250">
      </el-table-column>
      <el-table-column
        prop="currentBuyerPrice"
        label="成交价格"
        width="150"
      ></el-table-column>
      <el-table-column prop="dealTimeStr" label="成交时间"></el-table-column>
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
    api.getMyBought().then(res => {
      console.log(res.data);
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
          "dealTimeStr",
          formatTime(tableData[i].dealTime, "Y/M/D/ h:m:s")
        );
        count++;
      }
      return tableData;
    },
    getGoodsUrl(id) {
      return `/Goods/${id}`;
    },
    getHeadImgUrl: function(id, url) {
      if (id) {
        return `http://127.0.0.1:8081/goodsResource/${id}/pic/${url}`;
      } else {
        // console.log("parse url failed");
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
    }
  }
};
</script>
