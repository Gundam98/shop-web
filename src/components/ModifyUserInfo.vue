<template>
  <span class="modifyUserInfoButton">
    <el-button type="primary" @click="dialogVisible = true">修改信息</el-button>
    <el-dialog
      title="修改信息"
      :visible.sync="dialogVisible"
      width="30%"
      center
    >
      <el-form label-position="right" label-width="80px" :model="info">
        <el-form-item label="真实姓名" style="margin-bottom:15px">
          <el-input v-model="info.realName" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话" style="margin-bottom:15px">
          <el-input v-model="info.telephone" clearable></el-input>
        </el-form-item>
        <el-form-item label="注册城市">
          <region-selector
            v-if="info.registerRegion"
            @region="chooseRegion"
            :defaultRegion="info.registerRegion"
          ></region-selector>
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
import regionSelector from "@/components/RegionSelector";
import _ from "lodash";

export default {
  components: {
    regionSelector
  },
  props: {
    infoProp: {
      type: Object,
      default: function() {
        return {
          realName: "",
          telephone: "",
          registerRegion: ""
        };
      }
    }
  },
  created() {
    this.info = _.cloneDeep(this.infoProp);
  },
  data() {
    return {
      info: { realName: "", telephone: "", registerRegion: "" },
      dialogVisible: false
    };
  },
  methods: {
    submitInfo: function() {
      let _this = this;
      console.log(this.info);
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
    },
    chooseRegion: function(data) {
      this.$set(this.info, "registerRegion", data);
    }
  }
};
</script>

<style></style>
