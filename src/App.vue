<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-row class="header">
          <el-col :span="6">
            <img
              src="@/assets/logo.png"
              class="logo"
              style="width:60px;height:60px;float:left"
            />
          </el-col>
          <el-col
            :span="18"
            style="display:flex;align-items:center;justify-content:flex-end;flex-direction:row;flex-wrap: wrap"
          >
            <el-menu
              class="head-nav"
              router
              mode="horizontal"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              v-if="login"
              v-show="show"
            >
              <el-menu-item index="/WantToBuyGoods">
                我要买
              </el-menu-item>
              <el-menu-item index="/SellGoods">
                我要卖
              </el-menu-item>
            </el-menu>
            <el-dropdown
              v-if="login"
              v-show="show"
              style="float:right;display:flex;margin-left:10px"
              @command="handleProfileCommand"
            >
              <el-avatar :src="circleUrl"></el-avatar>
              <el-dropdown-menu slot="dropdown" trigger="click">
                <el-dropdown-item command="profile">账户信息</el-dropdown-item>
                <el-dropdown-item command="Deposit">充值</el-dropdown-item>
                <el-dropdown-item command="logout">注销</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <router-link
              v-show="!login"
              to="/Login"
              style="text-decoration:none;color:white"
            >
              登陆/注册
            </router-link>
          </el-col>
        </el-row>
      </el-header>
      <el-container class="main-content">
        <el-aside>
          <div class="side-bar">
            <el-menu
              router
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              style="height:100%"
            >
              <el-menu-item index="/">
                主页
              </el-menu-item>
              <el-menu-item index="/WantToBuy">
                求购
              </el-menu-item>
              <el-menu-item index="/AllGoods">
                所有商品
              </el-menu-item>
            </el-menu>
          </div>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import api from "@/utils/api";
export default {
  name: "app",
  components: {},
  data() {
    return {
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      login: false,
      show: true
    };
  },
  created() {
    if (localStorage.getItem("username")) {
      this.login = true;
      this.show = true;
    } else {
      this.login = false;
      let _this = this;
      api
        .checkLogin()
        .then(() => {
          _this.login = true;
        })
        .catch(() => {
          _this.login = false;
        })
        .then(() => {
          _this.login = false;
        });
    }
  },
  updated() {
    if (localStorage.getItem("username")) {
      this.login = true;
      this.show = true;
    } else {
      this.login = false;
      this.show = false;
    }
  },
  methods: {
    handleProfileCommand(command) {
      if (command === "profile") {
        this.$router.push("/Profile").catch(err => err);
      } else if (command === "logout") {
        if (api.logout()) {
          localStorage.removeItem("username");
          this.show = false;
          this.$message.success("注销成功");
          this.$router.push("/").catch(err => err);
        } else {
          this.$message.error("注销失败");
        }
      } else if (command === "Deposit") {
        this.$router.push("/Deposit").catch(err => err);
      } else {
        this.$message.error("系统出错啦");
      }
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
}

body {
  margin: 0;
}

.el-header {
  line-height: 60px;
  height: 60px;
  margin: 0;
  padding: 0;
  background-color: #545c64;
}

.el-aside {
  width: 200px !important;
  line-height: 200px;
}

.head-nav {
  float: right;
}

.side-bar {
  height: 99%;
}

.main-content {
  min-height: 91vh;
}

img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}

[v-cloak] {
  display: none;
}
</style>
