<template>
  <el-select v-model="value" placeholder="地区" filterable :size="size">
    <el-option
      v-for="province in provinces"
      :key="province.id"
      :label="province.name"
      :value="province.id"
    ></el-option>
  </el-select>
</template>

<script>
import api from "@/utils/api";

export default {
  props: {
    size: String,
    defaultRegion: {
      type: Number,
      default: ""
    }
  },
  created() {
    let _this = this;
    api.getAllRegion().then(res=>{
      _this.provinces = res.data;
    })
    this.value = this.defaultRegion;
  },
  data() {
    return {
      provinces: [],
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
