<template>
  <div>
    <el-row>
      <el-col
        :span="12"
        :offset="6"
        label-position="right"
        style="box-shadow:rgba(0, 0, 0, 0.12) 0px 2px 4px, rgba(0, 0, 0, 0.04) 0px 0px 6px; border-radius:5px; padding:20px; background-color:white"
      >
        <div style="font-size:30px;margin-bottom:10px">注册</div>
        <el-form
          :model="registerForm"
          :ref="registerForm"
          status-icon
          :rules="rules"
        >
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="用户名"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              placeholder="密码"
              type="password"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="realName">
            <el-input
              v-model="registerForm.realName"
              placeholder="真实姓名"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="telephone">
            <el-input
              v-model="registerForm.telephone"
              placeholder="联系电话"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="registerRegion" style="text-align:left">
            <region-selector @region="chooseRegion"></region-selector>
          </el-form-item>
          <el-form-item style="margin-top:20px;margin-bottom:0">
            <el-row type="flex" justify="space-around">
              <el-col :span="6">
                <el-button type="primary" @click="register">注册</el-button>
              </el-col>
              <el-col :span="6">
                <el-button type="primary" @click="resetForm">重置</el-button>
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
import regionSelector from "@/components/RegionSelector";

export default {
  data() {
    let checkPhoneNumber = (rule, value, callback) => {
      if (isNaN(value)) return callback(new Error("请输入电话号码"));
      else {
        if (value.toString().length !== 8 || value.toString().length !== 11)
          return callback(new Error("仅支持11位手机号码或者8位电话号码"));
      }
    };
    return {
      registerForm: {
        username: "",
        password: "",
        realName: "",
        telephone: "",
        registerRegion: ""
      },
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        realName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" }
        ],
        telephone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          { validator: checkPhoneNumber, trigger: "blur" }
        ]
      }
    };
  },
  components: {
    regionSelector
  },
  methods: {
    resetForm: function() {
      this.$refs["registerForm"].resetFields();
    },
    register: function() {
      let _this = this;
      for (let key in this.registerForm) {
        if (!this.registerForm[key]) {
          this.$message.warning("信息填写不完整");
          return;
        }
      }
      api
        .register(this.registerForm)
        .then(res => {
          _this.$message.success("注册成功");
          _this.$router.push("/Login").catch(e => e);
        })
        .catch(e => {
          _this.$message.warnming("注册失败");
        });
    },
    chooseRegion: function(data) {
      this.$set(this.registerForm, "registerRegion", data);
    }
  }
};
</script>

<style></style>
