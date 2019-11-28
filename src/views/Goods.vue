<template>
  <div>
    <el-page-header @back="goBack" content="详情"> </el-page-header>
    <el-row>
      <el-col :span="10" style="padding:20px">
        <el-carousel>
          <el-carousel-item
            v-for="(url, index) in [goodsInfo.picUrl]"
            :key="index"
          >
            <el-image
              v-if="goodsInfo.picUrl"
              :src="goodsInfo.picUrl"
              fit="contain"
            ></el-image>
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col
        :span="14"
        style="display:flex;flex-direction:column;flex-wrap: wrap;align-items:flex-start;justify-content:flex-start;padding:20px"
      >
        <div style="margin-bottom:20px;display:flex;align-items:center">
          <el-tag
            :type="tag.type"
            effect="dark"
            size="medium"
            style="margin-right:10px"
          >
            {{ tag.message }}
          </el-tag>
          <div style="font-size:40px">{{ goodsInfo.name }}</div>
        </div>
        <div style="margin-bottom:20px;" v-if="!timeout">
          <span>
            距离结束还有<countdown
              :endTime="goodsInfo.overTime"
              style="color:red"
            >
            </countdown>
          </span>
        </div>
        <div>
          <span style="color:grey">当前价</span>
          <span style="color:#ff0036;font-size:30px">
            ￥{{ goodsInfo.currentBuyerPrice || "暂无出价" }}
          </span>
          <span v-if="goodsInfo.currentBuyerPrice" style="padding-left:20px">
            <span style="color:grey">竞价用户</span>
            {{ goodsInfo.currentBuyerUserName }}
          </span>
        </div>
        <br />
        <el-form :inline="true" v-if="!isSeller">
          <el-form-item>
            <el-input v-model="bidPrice">
              <template slot="prepend">￥</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="bid"> 竞价 </el-button>
          </el-form-item>
        </el-form>

        <div style="font-size:12px">
          <span style="margin-right:20px">
            <span style="color:grey">起拍价</span>
            ￥{{ goodsInfo.minPrice }}
          </span>
          <span style="margin-right:20px">
            <span style="color:grey">卖家</span>
            {{ goodsInfo.sellerUserName }}
          </span>
          <span style="margin-right:20px">
            <span style="color:grey">上次修改时间</span>
            {{ goodsInfo.modifiedTime }}
          </span>
        </div>
      </el-col>
    </el-row>

    <el-tabs type="card" value="description" style="padding:20px">
      <el-tab-pane label="商品描述" name="description">
        <p style="text-align: left">{{ goodsInfo.description }}</p>
      </el-tab-pane>
      <el-tab-pane label="服务说明" name="service">服务说明</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import api from "@/utils/api";
import formatTime from "@/utils/formatTime";
import countdown from "@/components/Countdown";
export default {
  data() {
    return {
      goodsInfo: {},
      bidPrice: null,
      tag: {
        type: "success",
        message: "竞拍中"
      },
      timeout: false,
      curUser: ""
    };
  },
  components: {
    countdown
  },
  computed: {
    isSeller: function() {
      if (!this.goodsInfo.sellerUserName) return true;
      if (this.curUser === this.goodsInfo.sellerUserName) return true;
      else return false;
    }
  },
  async created() {
    this.curUser = localStorage.username;
    let res = await api.getGoodsInfo(this.$route.params.id);
    this.goodsInfo = this.processGoodsInfo(res.data);
  },
  methods: {
    processGoodsInfo: function(data) {
      let _this = this;
      let info = data;
      if (info.overTime < new Date().getTime()) {
        this.timeout = true;
        if (info.currentBuyerUserId) {
          this.tag = {
            type: "danger",
            message: "已成交"
          };
        } else {
          this.tag = {
            type: "info",
            message: "已结束"
          };
        }
      }
      //时间戳转时间字符串
      info.modifiedTime = formatTime(info.modifiedTime, "Y/M/D/ h:m:s");

      //通过卖家id获取卖家名字
      /*api.getUserInfo(info.sellerUserId).then(res => {
        _this.$set(_this.goodsInfo, "sellerUser", res.data.username);
      });*/

      //商品类型转换
      /*api.getGoodsType(info.type).then(res => {
        _this.$set(_this.goodsInfo, "typeName", res.data.typeName);
      });*/

      //通过竞价者id获取竞价者名字
      /*if (info.currentBuyerUserId !== null) {
        let _this = this;
        api.getUserInfo(info.currentBuyerUserId).then(res => {
          _this.$set(_this.goodsInfo, "currentBuyer", res.data.username);
        });
      }*/
      info.picUrl = `http://localhost:8081/picUrl/${info.picUrl}`;
      /*for(let i = 0; i < _this.picUrl.length;i++){
        (function(i) {
          _this.picUrl[i] = `http://localhost:8081/picUrl/${_this.picUrl[i]}`
        })(i)
      }*/

      return info;
    },
    bid() {
      if (new Date(this.goodsInfo.overTime) < new Date().getTime()) {
        this.$message.warning("竞拍已结束");
        this.$router.push("/").catch(e => e);
        return;
      }
      if (
        !this.goodsInfo.currentBuyerPrice &&
        this.goodsInfo.minPrice > this.bidPrice
      ) {
        this.$message.warning("出价至少高于最低价");
        return;
      }
      if (
        this.goodsInfo.currentBuyerPrice &&
        this.goodsInfo.currentBuyerPrice > this.bidPrice
      ) {
        this.$message.warning("出价至少高于当前价");
        return;
      }

      let _this = this;
      api.bid(this.goodsInfo.id, this.bidPrice).then(res => {
        _this.goodsInfo.currentBuyerPrice = _this.bidPrice;
        _this.bidPrice = null;
        _this.goodsInfo.currentBuyer = localStorage.username;
        _this.$message.success("竞价成功");
      });
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style></style>
