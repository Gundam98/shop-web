<template>
  <div>
    <el-row>
      <el-col
        :span="14"
        :offset="5"
        style="box-shadow:rgba(0, 0, 0, 0.12) 0px 2px 4px, rgba(0, 0, 0, 0.04) 0px 0px 6px; border-radius:5px; padding:20px; background-color:white"
      >
        <div style="font-size:30px;margin-bottom:10px">账户信息</div>
        <el-form
          label-position="right"
          label-width="120px"
          :model="info"
          class="view"
        >
          <el-form-item label="用户名">
            <el-input
              v-model="info.username"
              readOnly="true"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="账户类型">
            <el-input
              v-model="info.typeStr"
              readOnly="true"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="余额">
            <el-input v-model="info.money" readOnly="true" clearable>
              <template slot="prepend">￥</template>
            </el-input>
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input
              v-model="info.realName"
              readOnly="true"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input
              v-model="info.telephone"
              readOnly="true"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="注册地区">
            <el-input
              v-model="info.registerRegion"
              readOnly="true"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-input
              v-model="info.registerTimeStr"
              readOnly="true"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="上次修改时间">
            <el-input
              v-model="info.modifierTimeStr"
              readOnly="true"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top:20px;margin-bottom:0;text-align:left">
            <charge-button
              v-if="info !== {}"
              style="margin-right:12px"
              @charge="addMoney"
            ></charge-button>
            <modify-user-info-button
              v-if="info.realName"
              style="margin-right:12px"
              :infoProp="info"
              @info="refreshInfo"
            ></modify-user-info-button>
            <modify-password-button
              v-if="info.realName"
              style="margin-right:12px"
              :infoProp="info"
              @pass="changePassword"
            ></modify-password-button>
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
import chargeButton from "@/components/Deposit";
import ModifyUserInfoButton from "@/components/ModifyUserInfo";
import ModifyPasswordButton from "@/components/ModifyPassword";

export default {
  components: {
    chargeButton,
    ModifyUserInfoButton,
    ModifyPasswordButton
  },
  data() {
    return {
      info: {}
    };
  },
  created() {
    let _this = this;
    api.getCurUserId().then(res => {
      api
        .getUserInfo(res.data)
        .then(res => {
          let data = _this.processData(res.data);
          _this.info = data;
        })
        .then(() => {
          api.getUserBalance().then(res => {
            _this.$set(_this.info, "money", res.data);
          });
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
    addMoney(data) {
      this.$set(this.info, "money", parseInt(this.info.money) + parseInt(data));
    },
    refreshInfo: function(data) {
      data.modifierTimeStr = formatTime(data.modifierTime, "Y/M/D/ h:m:s");
      Object.assign(this.info, data);
    },
    changePassword: function(data) {
      this.$set(this.info, "password", data);
    }
  }
};
</script>

<style></style>
