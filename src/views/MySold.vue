<template>
  <div>
    <div class="displayTable">
      <el-table
        :data="tableData"
        stripe
        highlight-current-row
        style="width: 100%"
        empty-text="暂无出售商品"
        v-loading="loading"
        lazy
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
          width="150"
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
        <el-table-column prop="statusName" label="商品状态" width="100">
        </el-table-column>
        <el-table-column
          prop="minPrice"
          label="起拍价"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="overTime"
          label="结束时间"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="currentBuyerPrice"
          label="当前出价"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="currentBuyer"
          label="出价者"
          width="100"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                v-if="
                  scope.row.statusName === '待重新上架' ||
                    scope.row.statusName === '待竞价'
                "
                icon="el-icon-delete"
              ></el-button>
              <el-button
                v-if="scope.row.statusName === '待重新上架'"
                icon="el-icon-upload2"
              ></el-button>
              <el-button
                v-if="scope.row.statusName === '待竞价'"
                icon="el-icon-download"
              >
              </el-button>
              <el-button
                v-if="
                  scope.row.statusName === '待重新上架' ||
                    scope.row.statusName === '待竞价'
                "
                icon="el-icon-edit"
              ></el-button>
              <el-button
                v-if="scope.row.statusName === '待接受竞价'"
                icon="el-icon-check"
              ></el-button>
              <el-button
                v-if="scope.row.statusName === '待接受竞价'"
                icon="el-icon-close"
              >
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import api from "@/utils/api";
import formatTime from "@/utils/formatTime";

export default {
  data() {
    return {
      tableData: [],
      loading: false
    };
  },
  created() {
    let _this = this;
    api.getMySold().then(res => {
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
        //判断商品状态
        if (tableData[i].status === 0) {
          _this.$set(tableData[i], "statusName", "待重新上架");
        } else if (tableData[i].status === 1) {
          if (tableData[i].overTime <= new Date().getTime()) {
            //竞拍结束
            if (tableData[i].currentBuyerUserId !== null) {
              //有人出价，等待卖家接受竞价
              _this.$set(tableData[i], "statusName", "待接受竞价");
            } else {
              //无人出价，卖家可以修改信息
              _this.$set(tableData[i], "statusName", "待重新上架");
            }
          } else {
            //在竞拍时间内
            if (tableData[i].currentBuyerUserId !== null) {
              //有人出价，等待卖家接受竞价
              _this.$set(tableData[i], "statusName", "竞价中");
            } else {
              //无人出价，卖家可以修改信息
              _this.$set(tableData[i], "statusName", "待竞价");
            }
          }
        } else {
          _this.$set(tableData[i], "statusName", "已成交");
        }

        //时间戳转时间字符串
        _this.$set(
          tableData[i],
          "overTime",
          formatTime(tableData[i].overTime, "Y/M/D/ h:m:s")
        );

        //商品类型转换
        api.getGoodsType(tableData[i].type).then(res => {
          _this.$set(tableData[i], "typeName", res.data.typeName);
        });

        //通过竞价者id获取竞价者名字
        if (tableData[i].currentBuyerUserId !== null) {
          let _this = this;
          api.getUserInfo(tableData[i].currentBuyerUserId).then(res => {
            _this.$set(tableData[i], "currentBuyer", res.data.username);
          });
        }

        count++;
      }
      return tableData;
    },
    getImgUrl: function(url) {
      if (url) {
        return `http://10.128.248.142:8081/picUrl/${url}`;
      } else {
        console.log("parse url failed");
        return undefined;
      }
    },
    getGoodsUrl(id) {
      return `/Goods/${id}`;
    }
  }
};
</script>

<style></style>
