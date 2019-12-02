<template>
  <div>
    <el-page-header @back="goBack" content="详情"> </el-page-header>
    <el-row>
      <el-col :span="14" class="infoDisplay">
        <div style="margin-bottom:20px;display:flex;align-items:center">
          <div style="font-size:40px">{{ demandInfo.name }}</div>
        </div>
        <div>
          <span style="color:grey">心理价位</span>
          <span style="color:#ff0036;font-size:30px">
            ￥{{ demandInfo.idealPrice }}
          </span>
        </div>
        <br />

        <div style="font-size:12px;text-align:left">
          <span style="margin-right:20px">
            <span style="color:grey">求购用户</span>
            {{ demandInfo.publisherUserName }}
          </span>
          <span style="margin-right:20px">
            <span style="color:grey">商品类型</span>
            {{ demandInfo.typeName }}
          </span>
          <br />
          <span style="margin-right:20px">
            <span style="color:grey">发布时间</span>
            {{ demandInfo.createTimeStr }}
          </span>
          <br />
          <span style="margin-right:20px">
            <span style="color:grey">上次修改时间</span>
            {{ demandInfo.modifiedTimeStr }}
          </span>
        </div>
      </el-col>
      <el-col :span="10" class="offerDisplay">
        <el-table
          :data="tableData"
          stripe
          style="width:300px"
          empty-text="暂无商品信息"
          max-height="200px"
        >
          <el-table-column prop="name" label="商品名" width="150px">
            <template slot-scope="scope">
              <router-link :to="getGoodsUrl(scope.row.id)" class="name">
                {{ scope.row.name }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="sellerUserName"
            label="卖家"
            width="150px"
          ></el-table-column>
        </el-table>
        <el-popover
          placement="left-end"
          width="320"
          trigger="click"
          v-model="visible"
          v-if="!isDemander"
        >
          <el-form :inline="true">
            <el-form-item>
              <el-select v-model="sellerGoodsId" placeholder="选择自己的商品">
                <el-option
                  v-for="goods in sellerGoodsList"
                  :key="goods.id"
                  :label="goods.name"
                  :value="goods.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onRecommend">提交</el-button>
            </el-form-item>
          </el-form>
          <el-button
            slot="reference"
            style="width:300px"
            type="primary"
            icon="el-icon-plus"
          >
            推荐自己的商品
          </el-button>
        </el-popover>
      </el-col>
    </el-row>

    <el-tabs type="card" value="description" style="padding:20px">
      <el-tab-pane label="商品描述" name="description">
        <p style="text-align: left">{{ demandInfo.description }}</p>
      </el-tab-pane>
      <el-tab-pane label="服务说明" name="service">服务说明</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import api from "@/utils/api";
import formatTime from "@/utils/formatTime";

export default {
  data() {
    return {
      demandInfo: {},
      tableData: [],
      recommendGoodsId: null,
      curUser: "",
      sellerGoodsList: [],
      sellerGoodsId: null,
      visible: false
    };
  },
  computed: {
    isDemander: function() {
      if (!this.demandInfo.publisherUserName) return false;
      if (this.curUser === this.demandInfo.publisherUserName) return true;
      else return false;
    }
  },
  async created() {
    this.curUser = sessionStorage.username;
    let res = await api.getDemandInfo(this.$route.params.id);
    this.demandInfo = this.processDemandInfo(res.data);
    for (const id of this.demandInfo.offerGoodsIdList) {
      let res = await api.getGoodsInfo(id);
      this.tableData.push(res.data);
    }
    this.sellerGoodsList = (await api.getMySold()).data;
  },
  methods: {
    onRecommend: function() {
      let _this = this;
      api
        .recommendGoods(this.demandInfo.id, {
          goodsId: this.sellerGoodsId,
          demandId: this.demandInfo.id
        })
        .then(res => {
          // console.log(res);
          _this.visible = false;
          _this.$message.success("提交成功");
          let goodsName = "";
          _this.sellerGoodsList.forEach(item => {
            if ((item.id = this.sellerGoodsId)) {
              goodsName = item.name;
            }
          });
          _this.tableData.push({
            sellerUserName: _this.curUser.username,
            name: goodsName
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    processDemandInfo: function(info) {
      //时间戳转时间字符串
      info.modifiedTimeStr = formatTime(info.modifiedTime, "Y/M/D/ h:m:s");
      info.createTimeStr = formatTime(info.createTime, "Y/M/D/ h:m:s");

      return info;
    },
    goBack() {
      this.$router.go(-1);
    },
    getGoodsUrl(id) {
      return `/Goods/${id}`;
    }
  }
};
</script>

<style scope>
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

.infoDisplay {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px;
}

.offerDisplay {
  padding: 20px;
  text-align: left;
}
</style>
