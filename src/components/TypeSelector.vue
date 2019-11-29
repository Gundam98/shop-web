<template>
  <el-select v-model="type" placeholder="商品类型" :size="size">
    <el-option
      v-for="item in typeData"
      :key="item.id"
      :label="item.typeName"
      :value="item.id"
    ></el-option>
  </el-select>
</template>

<script>
import api from "@/utils/api";
export default {
  created() {
    let _this = this;
    api.getGoodsType().then(res => {
      _this.typeData = res.data;
    });
    this.type = this.defaultType;
  },
  props: {
    defaultType: {
      type: Number,
      default: null
    },
    size: String
  },
  data() {
    return {
      typeData: {},
      type: ""
    };
  },
  watch: {
    type: function() {
      this.$emit("type", this.type);
    }
  }
};
</script>

<style></style>
