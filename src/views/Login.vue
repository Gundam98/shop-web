<template>
  <div>
    <el-row>
      <el-col :span="8" :offset="8" label-position="right">
        <el-form :model="loginForm" status-icon>
          <el-form-item>
            <el-input v-model="loginForm.name" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="loginForm.password"
              placeholder="密码"
              type="password"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login()">登陆</el-button>
            <el-button type="primary" @click="register()">注册</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from "@/utils/api";
export default {
  data() {
    return {
      loginForm: {
        name: "",
        password: ""
      }
    };
  },
  methods: {
    login: function() {
      api
        .login(this.loginForm)
        .then(res => {
          localStorage.username = this.loginForm.name;
          this.$message.success("登陆成功");
          this.$router.push("/").catch(err => err);
        })
        .catch(() => {
          this.$message.error("登陆失败");
        });
    }
  }
};
</script>

<style></style>
