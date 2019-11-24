<template>
  <div>
    <h1>账户信息</h1>
    <el-row>
      <el-col :span="14" :offset="5">
        <el-form
          label-position="right"
          label-width="120px"
          :model="info"
          class="view"
          v-if="!edit && !changePassword"
        >
          <el-form-item label="用户名">
            <el-input v-model="info.username" readOnly="true"></el-input>
          </el-form-item>
          <el-form-item label="账户类型">
            <el-input v-model="info.typeStr" readOnly="true"></el-input>
          </el-form-item>
          <el-form-item label="积分">
            <el-input v-model="info.score" readOnly="true"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="info.realName" readOnly="true"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="info.telephone" readOnly="true"></el-input>
          </el-form-item>
          <el-form-item label="注册城市">
            <el-input v-model="info.registerCity" readOnly="true"></el-input>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-input v-model="info.registerTimeStr" readOnly="true"></el-input>
          </el-form-item>
          <el-form-item label="上次修改时间">
            <el-input v-model="info.modifierTimeStr" readOnly="true"></el-input>
          </el-form-item>
          <el-form-item style="text-align:left">
            <el-button type="primary" @click="editInfo">修改信息</el-button>
            <el-button type="primary" @click="editPassword">修改密码</el-button>
          </el-form-item>
        </el-form>

        <el-form
          label-position="right"
          label-width="120px"
          :model="edInfo"
          class="view"
          v-if="edit"
        >
          <el-form-item label="真实姓名">
            <el-input v-model="edInfo.realName"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="edInfo.telephone"></el-input>
          </el-form-item>
          <el-form-item label="注册城市">
            <el-input v-model="edInfo.registerCity"></el-input>
          </el-form-item>
          <el-form-item style="text-align:left">
            <el-button type="primary" @click="submitInfo">提交</el-button>
            <el-button type="primary" @click="back()">返回</el-button>
          </el-form-item>
        </el-form>

        <el-form
          label-position="right"
          label-width="120px"
          :model="password"
          class="view"
          v-if="changePassword"
        >
          <el-form-item label="原始密码">
            <el-input v-model="password.origin" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input v-model="password.new1" type="password"></el-input>
          </el-form-item>
          <el-form-item label="再次输入">
            <el-input v-model="password.new2" type="password"></el-input>
          </el-form-item>
          <el-form-item style="text-align:left">
            <el-button type="primary" @click="submitPassword">提交</el-button>
            <el-button type="primary" @click="back()">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from "@/utils/api";
import _ from "lodash";
import formatTime from "@/utils/formatTime";
export default {
  data() {
    return {
      info: {},
      edInfo: {},
      password: {
        origin: "",
        new1: "",
        new2: ""
      },
      edit: false,
      changePassword: false
    };
  },
  created() {
    let _this = this;
    api.getCurUserId().then(res => {
      api.getUserInfo(res.data).then(res => {
        let data = _this.processData(res.data);
        _this.info = _.cloneDeep(data);
        _this.edInfo = _.cloneDeep(data);
      });
    });
  },
  methods: {
    processData: function(data) {
      data.registerTimeStr = formatTime(data.registerTime, "Y/M/D/ h:m:s");
      data.modifierTimeStr = formatTime(data.modifierTime, "Y/M/D/ h:m:s");
      if (data.type === 0) {
        data.typeStr = "普通账户";
      } else {
        data.typeStr = "管理员";
      }
      return data;
    },
    editInfo: function() {
      this.edit = true;
    },
    editPassword: function() {
      this.changePassword = true;
    },
    back: function() {
      for (let key in this.password) {
        this.password[key] = "";
      }
      this.edInfo = _.cloneDeep(this.info);
      this.edit = false;
      this.changePassword = false;
    },
    submitInfo: function() {
      let _this = this;
      api
        .changeUserInfo({
          username: this.info.username,
          password: this.info.password,
          type: 0,
          realName: this.edInfo.realName,
          telephone: this.edInfo.telephone,
          score: 0,
          registerCity: this.edInfo.registerCity
        })
        .then(() => {
          api.getCurUserId().then(res => {
            api.getUserInfo(res.data).then(res => {
              _this.info = _.cloneDeep(res.data);
              _this.$message.success("修改成功");
              _this.back();
            });
          });
        })
        .catch(err => {
          console.log(err);
          this.$message.error("修改失败");
        });
    },
    submitPassword: function() {
      let _this = this;
      api
        .changeUserInfo({
          username: this.info.username,
          password: this.password.new1,
          type: 0,
          realName: this.info.realName,
          telephone: this.info.telephone,
          score: 0,
          registerCity: this.info.registerCity
        })
        .then(() => {
          api.getCurUserId().then(res => {
            api.getUserInfo(res.data).then(res => {
              _this.info = _.cloneDeep(res.data);
              for (let key in _this.password) {
                _this.password[key] = "";
              }
              _this.$message.success("修改成功");
              _this.back();
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
