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
          prop="overTimeStr"
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
              <el-tooltip
                content="上架"
                placement="bottom"
                v-if="scope.row.statusName === '待重新上架'"
              >
                <el-button
                  icon="el-icon-upload2"
                  type="primary"
                  @click="online(scope.row, scope.$index)"
                ></el-button>
              </el-tooltip>

              <el-tooltip
                content="下架"
                placement="bottom"
                v-if="scope.row.statusName === '待竞价'"
              >
                <el-button
                  icon="el-icon-download"
                  type="primary"
                  @click="offline(scope.row.id, scope.$index)"
                >
                </el-button>
              </el-tooltip>

              <el-tooltip
                content="编辑"
                placement="bottom"
                v-if="
                  scope.row.statusName === '待重新上架' ||
                    scope.row.statusName === '待竞价'
                "
              >
                <el-button
                  icon="el-icon-edit"
                  type="warning"
                  @click="edit(scope.row.id, scope.$index)"
                ></el-button>
              </el-tooltip>

              <el-tooltip
                content="删除"
                placement="bottom"
                v-if="
                  scope.row.statusName === '待重新上架' ||
                    scope.row.statusName === '待竞价'
                "
              >
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  @click="remove(scope.row.id, scope.$index)"
                ></el-button>
              </el-tooltip>

              <el-tooltip
                content="接受竞价"
                placement="bottom"
                v-if="scope.row.statusName === '待接受竞价'"
              >
                <el-button
                  icon="el-icon-check"
                  type="success"
                  @click="accept(scope.row.id, scope.$index)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                content="拒绝竞价"
                placement="bottom"
                v-if="scope.row.statusName === '待接受竞价'"
              >
                <el-button
                  icon="el-icon-close"
                  type="danger"
                  @click="refuse(scope.row.id, scope.$index)"
                >
                </el-button>
              </el-tooltip>
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
          "overTimeStr",
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
        } else {
          //填充暂无
          _this.$set(tableData[i], "currentBuyer", "暂无");
          _this.$set(tableData[i], "currentBuyerPrice", "暂无");
        }

        count++;
      }
      return tableData;
    },
    getImgUrl: function(url) {
      if (url) {
        return `http://127.0.0.1:8081/picUrl/${url}`;
      } else {
        console.log("parse url failed");
        return undefined;
      }
    },
    getGoodsUrl: function(id) {
      return `/Goods/${id}`;
    },
    online: function(data, i) {
      let _this = this;
      console.log(data);
      if (data.overTime <= new Date().getTime()) {
        _this.$message.error("请修改结束时间后上架");
        return;
      } else {
        api
          .onlineGoods(data.id)
          .then(res => {
            _this.$set(_this.tableData[i], "statusName", "待竞价");
            _this.$message.success("上架成功");
          })
          .catch(e => e);
      }
    },
    offline: function(id, i) {
      let _this = this;
      api
        .offlineGoods(id)
        .then(res => {
          _this.$set(_this.tableData[i], "statusName", "待重新上架");
          _this.$message.success("下架成功");
        })
        .catch(e => e);
    },
    accept: function(id, i) {
      let _this = this;
      api
        .acceptPrice(id)
        .then(res => {
          if (res.data) {
            _this.$set(_this.tableData[i], "statusName", "已成交");
            _this.$message.success("接受竞价成功");
          } else {
            _this.$message.warning("买方余额不足");
          }
        })
        .catch(e => e);
    },
    refuse: function(id, i) {
      let _this = this;
      api
        .refusePrice(id)
        .then(res => {
          _this.$set(_this.tableData[i], "statusName", "待重新上架");
          _this.$message.success("拒绝竞价成功");
        })
        .catch(e => e);
    },
    remove: function(id, i) {
      let _this = this;
      api
        .removeGoods(id)
        .then(res => {
          _this.tableData.splice(i, 1);
          _this.$message.success("删除成功");
        })
        .catch(e => e);
    },
    edit: function(id, i) {
      console.log(id);
    }
  }
};
</script>

<style></style>
