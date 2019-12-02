<template>
  <div>
    <el-row>
      <el-col
        :span="12"
        :offset="6"
        label-position="right"
        style="box-shadow:rgba(0, 0, 0, 0.12) 0px 2px 4px, rgba(0, 0, 0, 0.04) 0px 0px 6px; border-radius:5px; padding:20px; background-color:white"
      >
        <div style="font-size:30px;margin-bottom:10px">调整参数</div>
        <div>
          <div class="demonstration">
            <el-rate
              v-model="zero"
              disabled
              show-score
              score-template="{value}星用户"
            ></el-rate>
          </div>
          <el-slider
            v-model="param.l0cr"
            :format-tooltip="formatTooltipLevel"
          ></el-slider>
        </div>
        <div>
          <div class="demonstration">
            <el-rate
              v-model="one"
              disabled
              show-score
              score-template="{value}星用户"
            ></el-rate>
          </div>
          <el-slider
            v-model="param.l1cr"
            :format-tooltip="formatTooltipLevel"
          ></el-slider>
        </div>
        <div>
          <div class="demonstration">
            <el-rate
              v-model="two"
              disabled
              show-score
              score-template="{value}星用户"
            ></el-rate>
          </div>
          <el-slider
            v-model="param.l2cr"
            :format-tooltip="formatTooltipLevel"
          ></el-slider>
        </div>
        <div>
          <div class="demonstration">
            <el-rate
              v-model="three"
              disabled
              show-score
              score-template="{value}星用户"
            ></el-rate>
          </div>
          <el-slider
            v-model="param.l3cr"
            :format-tooltip="formatTooltipLevel"
          ></el-slider>
        </div>
        <div>
          <div class="demonstration">
            <el-rate
              v-model="four"
              disabled
              show-score
              score-template="{value}星用户"
            ></el-rate>
          </div>
          <el-slider
            v-model="param.l4cr"
            :format-tooltip="formatTooltipLevel"
          ></el-slider>
        </div>
        <div>
          <div class="demonstration">
            <el-rate
              v-model="five"
              disabled
              show-score
              score-template="{value}星用户"
            ></el-rate>
          </div>
          <el-slider
            v-model="param.l5cr"
            :format-tooltip="formatTooltipLevel"
          ></el-slider>
        </div>
        <div>
          <span class="demonstration">成长率</span>
          <el-slider
            v-model="param.lccr"
            :format-tooltip="formatTooltipLC"
          ></el-slider>
        </div>
        <el-button @click="submit" type="primary">提交</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from "@/utils/api";

export default {
  created() {
    let _this = this;
    api.getParam().then(res => {
      for (let key in res.data) {
        if (key !== "lccr") {
          _this.param[key] = _this.toInt(res.data[key]);
        } else {
          _this.param[key] = _this.toIntLC(res.data[key]);
        }
      }
    });
  },
  data() {
    return {
      param: {
        l0cr: 0,
        l1cr: 0,
        l2cr: 0,
        l3cr: 0,
        l4cr: 0,
        l5cr: 0,
        lccr: 0
      },
      zero: 0,
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5
    };
  },
  methods: {
    submit: function() {
      let _this = this;
      let data = {};
      for (let key in this.param) {
        if (key !== "lccr") {
          data[key] = this.toFloat(this.param[key]);
        } else {
          data[key] = this.toFloatLC(this.param[key]);
        }
      }
      console.log(data);
      api.updateParam(data).then(res => {
        _this.$message.success("修改成功");
      });
    },
    toInt(num) {
      return num * 1000;
    },
    toIntLC(num) {
      return num * 1000000;
    },
    toFloat(num) {
      return num / 1000;
    },
    toFloatLC(num) {
      return num / 1000000;
    },
    formatTooltipLevel: function(val) {
      return val / 1000;
    },
    formatTooltipLC: function(val) {
      return val / 1000000;
    }
  }
};
</script>

<style></style>
