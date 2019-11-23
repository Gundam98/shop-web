<template>
  <div>
    <el-row>
      <el-col :span="12">
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
        :span="12"
        style="display:flex;flex-direction:column;flex-wrap: wrap;align-items:flex-start;justify-content:flex-start;padding:20px"
      >
        <h1 style="font-size:30px">{{ goodsInfo.name }}</h1>
        <div>
          <span style="color:grey">当前价</span>
          <span style="color:#ff0036;font-size:30px">
            ￥{{ goodsInfo.currentBuyerPrice || "暂无出价" }}
          </span>
          <span v-if="goodsInfo.currentBuyerPrice" style="padding-left:20px">
            <span style="color:grey">竞价用户</span>
            {{ goodsInfo.currentBuyer }}
          </span>
        </div>
        <br />
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="bidPrice"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="bid">竞价</el-button>
          </el-form-item>
        </el-form>
        <div>
          <span style="margin-right:20px">
            <span style="color:grey">起拍价</span>
            ￥{{ goodsInfo.minPrice }}
          </span>
          <span style="margin-left:20px">
            <span style="color:grey">上次修改时间</span>
            {{ goodsInfo.modifiedTime }}
          </span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from "@/utils/api";
import formatTime from "@/utils/formatTime";
export default {
  data() {
    return {
      goodsInfo: {},
      bidPrice: 0
    };
  },
  created() {
    let _this = this;
    api.getGoodsInfo(this.$route.params.id).then(res => {
      _this.goodsInfo = this.processGoodsInfo(res.data);
      console.log(_this.goodsInfo);
    });
  },
  methods: {
    processGoodsInfo: function(data) {
      let info = data;
      let i = 0;
      if (info.overTime < new Date().getTime()) {
        console.log("竞拍结束");
      } else {
        //时间戳转时间字符串
        info.overTime = formatTime(info.overTime, "Y/M/D/ h:m:s");
        info.modifiedTime = formatTime(info.modifiedTime, "Y/M/D/ h:m:s");
        api.getUserInfo(info.sellerUserId).then(res => {
          //通过卖家id获取卖家名字
          info.sellerUser = res.data.username;
        });
        api.getGoodsType(info.type).then(res => {
          //商品类型转换
          info.type = res.data.typeName;
        });
        if (info.currentBuyerUserId !== null) {
          //通过竞价者id获取竞价者名字
          let _this = this;
          api.getUserInfo(info.currentBuyerUserId).then(res => {
            _this.$set(_this.goodsInfo, "currentBuyer", res.data.username);
          });
        }
        info.picUrl = `http://localhost:8081/picUrl/${info.picUrl}`;
        /*for(let i = 0; i < _this.picUrl.length;i++){
        (function(i) {
          _this.picUrl[i] = `http://localhost:8081/picUrl/${_this.picUrl[i]}`
        })(i)
      }*/
      }
      return info;
    },
    bid() {
      let _this = this;
      api.bid(this.goodsInfo.id, this.bidPrice).then(res => {
        _this.goodsInfo.currentBuyerPrice = _this.bidPrice;
        _this.bidPrice = null;
        _this.currentBuyerUser = localStorage.username;
        _this.$message({ message: "竞价成功", type: "success" });
      });
    }
  }
};
</script>

<style></style>
