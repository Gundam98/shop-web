<template>
  <span class="modifyPasswordButton">
    <el-button type="info" @click="dialogVisible = true">修改密码</el-button>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="30%"
      center
    >
      <el-form
        label-position="right"
        label-width="120px"
        :model="password"
        class="view"
      >
        <el-form-item label="原始密码" style="margin-bottom:15px">
          <el-input v-model="password.origin" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" style="margin-bottom:15px">
          <el-input v-model="password.new1" type="password"></el-input>
        </el-form-item>
        <el-form-item label="再次输入">
          <el-input v-model="password.new2" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPassword" :info="info">
          提交
        </el-button>
        <el-button type="primary" @click="dialogVisible = false">
          取消
        </el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
import api from "@/utils/api";

export default {
  props: {
    infoProp: Object
  },
  created() {
    this.info = this.infoProp;
  },
  data() {
    return {
      info: {},
      password: { origin: "", new1: "", new2: "" },
      dialogVisible: false
    };
  },
  methods: {
    submitPassword: function() {
      let _this = this;
      api
        .changeUserInfo({
          ...this.info,
          type: 0,
          score: 0
        })
        .then(() => {
          api.getCurUserId().then(res => {
            api.getUserInfo(res.data).then(res => {
              _this.$message.success("修改成功");
              _this.$emit("pass", _this.password.new1);
              _this.dialogVisible = false;
            });
          });
        })
        .catch(err => {
          console.log(err);
          this.$message.error("修改失败");
        });
    }
  }
};
</script>

<style></style>
