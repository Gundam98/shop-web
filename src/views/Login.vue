<template>
  <div style="position:relative; top:50%; margin-top:-150px;">
    <el-row>
      <el-col
        :span="8"
        :offset="8"
        label-position="right"
        style="box-shadow:rgba(0, 0, 0, 0.12) 0px 2px 4px, rgba(0, 0, 0, 0.04) 0px 0px 6px; border-radius:5px; padding:20px; background-color:white"
      >
        <div style="font-size:30px;margin-bottom:10px">登陆</div>
        <el-form :model="loginForm" status-icon>
          <div>
            <el-form-item>
              <el-input
                v-model="loginForm.name"
                placeholder="用户名"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="loginForm.password"
                placeholder="密码"
                type="password"
                clearable
              >
              </el-input>
            </el-form-item>
          </div>

          <el-form-item style="margin-top:20px;margin-bottom:0">
            <el-row type="flex" justify="space-around">
              <el-col :span="6">
                <el-button type="primary" @click="login">登陆</el-button>
              </el-col>
              <el-col :span="6">
                <el-button type="primary" @click="register">注册</el-button>
              </el-col>
            </el-row>
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
          sessionStorage.username = this.loginForm.name;
          this.$message.success("登陆成功");
          this.$emit("login");
          this.$router.push("/").catch(err => err);
        })
        .catch(() => {
          this.$message.error("登陆失败");
        });
    },
    register: function() {
      this.$router.push("/Register").catch(e => e);
    }
  }
};
</script>

<style></style>
