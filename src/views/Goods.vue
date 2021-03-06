<template>
  <div>
    <el-page-header @back="goBack" content="详情"> </el-page-header>
    <el-row>
      <el-col :span="10" style="padding:20px">
        <el-carousel>
          <el-carousel-item
            v-for="(url, index) in goodsInfo.picUrl"
            :key="index"
          >
            <el-image
              v-if="url"
              :src="url"
              fit="fill"
              :preview-src-list="getImgUrlList(goodsInfo.picUrl, index)"
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
        <div style="margin-bottom:20px;" v-if="!timeout && isBidMode">
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
          <span style="color:#ff0036;font-size:30px" v-if="isBidMode">
            ￥{{ goodsInfo.currentBuyerPrice || "暂无出价" }}
          </span>
          <span style="color:#ff0036;font-size:30px" v-if="!isBidMode">
            ￥{{ goodsInfo.minPrice }}
          </span>
          <span v-if="goodsInfo.currentBuyerPrice" style="padding-left:20px">
            <span style="color:grey">竞价用户</span>
            {{ goodsInfo.currentBuyerUserName }}
          </span>
        </div>
        <br />
        <el-form
          :inline="true"
          v-if="!isSeller && (!timeout || !isBidMode) && !isDeal"
        >
          <el-form-item v-if="isBidMode">
            <el-input v-model="bidPrice" clearable>
              <template slot="prepend">￥</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="bid">
              {{ bidButtonText }}
            </el-button>
          </el-form-item>
        </el-form>

        <div style="font-size:12px">
          <span style="margin-right:20px" v-if="isBidMode">
            <span style="color:grey">起拍价</span>
            ￥{{ goodsInfo.minPrice }}
          </span>
          <span style="margin-right:20px">
            <span style="color:grey">卖家</span>
            {{ goodsInfo.sellerUserName }}
          </span>
          <span style="margin-right:20px">
            <span style="color:grey">上次修改时间</span>
            {{ goodsInfo.modifiedTimeStr }}
          </span>
        </div>
      </el-col>
    </el-row>

    <el-tabs type="card" value="description" style="padding:20px">
      <el-tab-pane label="商品描述" name="description">
        <video controls preload="auto" height="250px" v-if="goodsInfo.vidUrl">
          <source :src="goodsInfo.vidUrl" type="video/mp4" />
        </video>
        <p style="text-align: left">{{ goodsInfo.description }}</p>
      </el-tab-pane>
      <el-tab-pane label="服务说明" name="service">
        <p style="text-align: left">
          不同等级会有不同的中介费率：每次交易收取的中介费=物品价格*中介费率。
        </p>
        <p style="text-align: left">
          每次交易，用户等级会增长。增长值和收取的中介费有关：用户等级增长=本次交易中介费*成长率
        </p>
        <p style="text-align: left">
          平台方对成长率和不同等级的中介费有更改的权力。
        </p>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import api from "@/utils/api";
import formatTime from "@/utils/formatTime";
import countdown from "@/components/Countdown";
import { exportDefaultSpecifier } from "@babel/types";

export default {
  data() {
    return {
      goodsInfo: {},
      bidPrice: null,
      tag: {
        type: "success",
        message: "竞拍中"
      },
      timeout: true,
      curUser: "",
      isBidMode: false,
      bidButtonText: "购买",
      isDeal: false
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
  created() {
    this.curUser = sessionStorage.username;
    let _this = this;
    api.getGoodsInfo(this.$route.params.id).then(res => {
      _this.goodsInfo = _this.processGoodsInfo(res.data);
    });
  },
  methods: {
    processGoodsInfo: function(data) {
      let info = data;
      // console.log(info);
      if (data.isBidMode == "true") {
        //是竞价模式
        this.isBidMode = true;
        this.bidButtonText = "竞价";
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
        } else {
          this.timeout = false;
        }
      } else {
        //一口价模式
        this.isBidMode = false;
        this.bidButtonText = "购买";
        if (info.currentBuyerUserId) {
          // 已被购买
          this.isDeal = true;
          this.tag = {
            type: "info",
            message: "已成交"
          };
        } else {
          this.isDeal = false;
          this.tag = {
            type: "primary",
            message: "一口价"
          };
        }
      }

      //时间戳转时间字符串
      info.modifiedTimeStr = formatTime(info.modifiedTime, "Y/M/D/ h:m:s");

      //info.picUrl = `http://localhost:8081/picUrl/${info.picUrl}`;
      info.picUrl = [];
      for (let i = 0; i < info.picUrlList.length; i++) {
        (function(i) {
          info.picUrl.push(
            `http://127.0.0.1:8081/goodsResource/${info.id}/pic/${
              info.picUrlList[i]
            }?t=${Math.random()}`
          );
        })(i);
      }
      info.vidUrl = "";
      if (info.vidUrlList && info.vidUrlList.length > 0) {
        info.vidUrl = `http://127.0.0.1:8081/goodsResource/${info.id}/vid/${
          info.vidUrlList[0]
        }?t=${Math.random()}`;
      }

      return info;
    },
    getImgUrlList: function(list, index) {
      let r1 = list.slice(0, index).reverse();
      let r2 = list.slice(index, list.length).reverse();
      let result = [...r1, ...r2];
      return result.reverse();
    },
    bid: function() {
      let _this = this;
      if (this.isBidMode) {
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

        api.bid(this.goodsInfo.id, this.bidPrice).then(res => {
          if (res.data === true) {
            _this.goodsInfo.currentBuyerPrice = _this.bidPrice;
            _this.bidPrice = null;

            _this.$set(
              _this.goodsInfo,
              "currentBuyerUserName",
              sessionStorage.username
            );
            _this.$message.success("竞价成功");
          } else {
            _this.$message.warning("账户余额不足，竞价失败");
          }
        });
      } else {
        api.buy(this.goodsInfo.id).then(res => {
          if (res.data === true) {
            _this.tag = {
              type: "danger",
              message: "已成交"
            };
            _this.isDeal = true;
            _this.$message.success("购买成功");
          } else {
            _this.$message.warning("余额不足，购买失败");
          }
        });
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style></style>
