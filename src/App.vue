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
              <el-menu-item index="/DemandGoods">
                发布求购
              </el-menu-item>
              <el-menu-item index="/SellGoods">
                发布商品
              </el-menu-item>
            </el-menu>
            <el-dropdown
              v-if="login"
              v-show="show"
              style="float:right;display:flex;margin-left:10px"
              @command="handleProfileCommand"
            >
              <el-avatar>
                <img src="./assets/head.png" />
              </el-avatar>
              <el-dropdown-menu slot="dropdown" trigger="click">
                <el-dropdown-item command="Profile">账户信息</el-dropdown-item>
                <el-dropdown-item command="MyBought">我买到的</el-dropdown-item>
                <el-dropdown-item command="MySold">我出售的</el-dropdown-item>
                <el-dropdown-item command="MyDemand">我求购的</el-dropdown-item>
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
                购买区
              </el-menu-item>
              <el-menu-item index="/Demand">
                求购区
              </el-menu-item>
              <el-menu-item index="/AllGoods">
                所有商品
              </el-menu-item>
            </el-menu>
          </div>
        </el-aside>
        <el-main>
          <router-view @login="check"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import api from "@/utils/api";
export default {
  name: "app",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      login: false,
      show: true,
      isRouterAlive: true
    };
  },
  created() {
    if (localStorage.getItem("username")) {
      this.login = true;
      this.show = true;
    } else {
      this.check();
    }
    setInterval(() => {
      this.check();
    }, 10000);
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
    check() {
      let _this = this;
      api
        .getCurUserId()
        .then(res => {
          if (res.data !== "") {
            _this.login = true;
            _this.show = true;
            api.getUserInfo(res.data).then(userInfo => {
              localStorage.username = userInfo.data.username;
            });
          } else {
            _this.login = false;
            _this.show = false;
            localStorage.clear();
          }
        })
        .catch(() => {
          _this.login = false;
          _this.show = false;
          localStorage.clear();
        });
    },
    handleProfileCommand(command) {
      if (command === "logout") {
        if (api.logout()) {
          localStorage.clear();
          this.show = false;
          this.login = false;
          this.$message.success("注销成功");
          this.$router.push("/").catch(err => err);
        } else {
          this.$message.error("注销失败");
        }
      } else {
        this.$router.push(`/${command}`).catch(err => err);
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
  background-color: #f5f6f7;
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
