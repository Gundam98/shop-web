<template>
  <el-select v-model="value" placeholder="地区" filterable :size="size">
    <el-option
      v-for="province in provinces"
      :key="province"
      :label="province"
      :value="province"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    size: String,
    defaultRegion: {
      type: String,
      default: ""
    }
  },
  created() {
    this.value = this.defaultRegion;
  },
  data() {
    return {
      provinces: [
        "北京",
        "浙江",
        "天津",
        "安徽",
        "上海",
        "福建",
        "重庆",
        "江西",
        "山东",
        "河南",
        "内蒙古自治区",
        "湖北",
        "新疆维吾尔自治区",
        "湖南",
        "宁夏回族自治区",
        "广东",
        "西藏自治区",
        "海南",
        "广西壮族自治区",
        "四川",
        "河北",
        "贵州",
        "山西",
        "云南",
        "辽宁",
        "陕西",
        "吉林",
        "甘肃",
        "黑龙江",
        "青海",
        "江苏"
      ],
      value: ""
    };
  },
  watch: {
    value: function() {
      this.$emit("region", this.value);
    }
  }
};
</script>

<style></style>
