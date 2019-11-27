<template>
  <span class="modifyUserInfoButton">
    <el-button type="primary" @click="dialogVisible = true">修改信息</el-button>
    <el-dialog
      title="修改信息"
      :visible.sync="dialogVisible"
      width="30%"
      center
    >
      <el-alert title="以下信息可供修改" type="info" center> </el-alert>

      <el-form label-position="right" label-width="80px" :model="info">
        <el-form-item label="真实姓名" style="margin-bottom:15px">
          <el-input v-model="info.realName"></el-input>
        </el-form-item>
        <el-form-item label="电话" style="margin-bottom:15px">
          <el-input v-model="info.telephone"></el-input>
        </el-form-item>
        <el-form-item label="注册城市">
          <el-input v-model="info.registerCity"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitInfo">提交</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
import api from "@/utils/api";

export default {
  props: {
    info: {
      type: Object,
      default: function() {
        return {
          realName: "",
          telephone: "",
          registerCity: ""
        };
      }
    }
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  methods: {
    submitInfo: function() {
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
              _this.$emit("info", res.data);
              _this.$message.success("修改成功");
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
