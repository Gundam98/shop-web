<template>
  <span class="chargeButton">
    <el-button type="success" @click="dialogVisible = true">充值</el-button>
    <el-dialog
      title="充值"
      :visible.sync="dialogVisible"
      width="30%"
      ref="dialog"
      center
    >
      <el-input placeholder="充值金额" type="number" v-model="money" clearable>
        <template slot="prepend">￥</template>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="charge">
          确认
        </el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
import api from "@/utils/api";
export default {
  data() {
    return {
      dialogVisible: false,
      money: null
    };
  },
  methods: {
    charge: function() {
      let _this = this;
      api.chargeMoney(this.money).then(res => {
        _this.$message.success("充值成功");
        _this.$emit("charge", _this.money);
        _this.money = null;
        _this.dialogVisible = false;
      });
    }
  }
};
</script>

<style scoped></style>
