<template>
  <div>
    <el-row>
      <el-col
        :span="12"
        :offset="6"
        label-position="right"
        style="box-shadow:rgba(0, 0, 0, 0.12) 0px 2px 4px, rgba(0, 0, 0, 0.04) 0px 0px 6px; border-radius:5px; padding:20px; background-color:white"
      >
        <div style="font-size:30px;margin-bottom:10px">{{ title }}</div>
        <el-form
          :model="demandForm"
          ref="demandForm"
          status-icon
          label-position="right"
          label-width="80px"
        >
          <el-form-item prop="name" label="商品名">
            <el-input v-model="demandForm.name" clearable></el-input>
          </el-form-item>
          <el-form-item prop="idealPrice" label="心理价位">
            <el-input v-model="demandForm.idealPrice" type="number" clearable>
              <template slot="prepend">￥</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="description" label="商品描述">
            <el-input
              v-model="demandForm.description"
              type="textarea"
              :rows="2"
              clearable
            >
            </el-input>
          </el-form-item>

          <el-form-item prop="type" label="商品类型" style="text-align:left">
            <typeSelector
              v-if="demandForm.type || newGoods"
              @type="getType"
              :defaultType="demandForm.type || null"
            ></typeSelector>
          </el-form-item>
          <el-form-item style="margin-top:20px;margin-bottom:0;text-align:left">
            <el-button type="primary" @click="upload">
              {{ uploadMsg }}
            </el-button>
            <el-button type="primary" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import typeSelector from "@/components/TypeSelector";
import api from "@/utils/api";

export default {
  components: {
    typeSelector
  },
  data() {
    return {
      newGoods: true,
      uploadMsg: "提交",
      title: "填写求购信息",
      demandForm: {
        name: "",
        idealPrice: "",
        type: "",
        description: ""
      }
    };
  },
  async created() {
    if (this.$route.params.id) {
      this.title = "修改求购信息";
      this.uploadMsg = "修改";
      this.newGoods = false;
      let res = await api.getDemandInfo(this.$route.params.id);
      for (let key in this.demandForm) {
        if (res.data[key]) this.demandForm[key] = res.data[key];
      }
    }
  },
  methods: {
    upload: function() {
      let _this = this;

      for (let key in this.demandForm) {
        if (!this.demandForm[key]) {
          this.$message.warning("信息填写不完整");
          return;
        }
      }

      if (this.$route.params.id) {
        api
          .updateDemand(this.$route.params.id, this.demandForm)
          .then(res => {
            _this.$message.success("修改成功");
            _this.$router.push("/MyDemand").catch(e => e);
          })
          .catch(e => e);
      } else {
        api
          .uploadDemand(this.demandForm)
          .then(res => {
            _this.$message.success("提交成功");
            _this.$router.push("/MyDemand").catch(e => e);
          })
          .catch(e => e);
      }
    },
    getType(data) {
      this.demandForm.type = data;
    },
    resetForm: function() {
      this.$refs.demandForm.resetFields();
      this.$refs.files.clearFiles();
    }
  }
};
</script>

<style></style>
