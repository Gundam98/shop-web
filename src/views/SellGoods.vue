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
          :model="sellForm"
          ref="sellForm"
          status-icon
          label-position="right"
          label-width="80px"
        >
          <el-form-item prop="name" label="商品名">
            <el-input v-model="sellForm.name" clearable></el-input>
          </el-form-item>
          <el-form-item prop="isbidMode" style="text-align:left">
            <el-switch
              v-model="sellForm.isBidMode"
              active-text="拍卖"
              inactive-text="一口价"
              @change="bidModeChange"
            >
            </el-switch>
          </el-form-item>
          <el-form-item prop="minPrice" :label="minPriceLabel">
            <el-input v-model="sellForm.minPrice" type="number" clearable>
              <template slot="prepend">￥</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="description" label="商品描述">
            <el-input
              v-model="sellForm.description"
              type="textarea"
              :rows="2"
              clearable
            >
            </el-input>
          </el-form-item>

          <el-form-item prop="type" label="商品类型" style="text-align:left">
            <typeSelector
              v-if="sellForm.type || newGoods"
              @type="getType"
              :defaultType="sellForm.type || null"
            ></typeSelector>
          </el-form-item>
          <el-form-item
            prop="overTime"
            label="结束时间"
            style="text-align:left"
            v-if="sellForm.isBidMode"
          >
            <el-date-picker
              v-model="sellForm.overTime"
              type="datetime"
              align="right"
              :picker-options="pickerOptions"
              value-format="timestamp"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="files" label="商品图片" style="text-align:left">
            <el-upload
              action=""
              ref="files"
              list-type="picture-card"
              multiple
              :on-preview="handlePictureCardPreview"
              :on-remove="handlePictureCardRemove"
              :file-list="picPreview"
              :auto-upload="false"
              :http-request="picUploadRequest"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
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
      uploadMsg: "上架",
      title: "填写商品信息",
      sellForm: {
        name: "",
        overTime: "",
        minPrice: "",
        type: "",
        files: [],
        description: "",
        isBidMode: false
      },
      minPriceLabel: "售价",
      picPreview: [],
      dialogImageUrl: "",
      dialogVisible: false,
      pickerOptions: {
        shortcuts: [
          {
            text: "明天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  async created() {
    if (this.$route.params.id) {
      this.title = "修改商品信息";
      this.uploadMsg = "修改";
      this.newGoods = false;
      let res = await api.getGoodsInfo(this.$route.params.id);
      for (let key in this.sellForm) {
        if (res.data[key]) {
          if (key !== "isBidMode") {
            this.sellForm[key] = res.data[key];
          } else {
            if (res.data[key] === "true") {
              this.sellForm[key] = true;
            } else {
              this.sellForm[key] = false;
            }
          }
        }
      }
    }
  },
  methods: {
    bidModeChange: function(isBidMode) {
      if (isBidMode) {
        this.minPriceLabel = "起拍价";
      } else {
        this.minPriceLabel = "售价";
      }
    },
    upload: function() {
      let _this = this;
      this.$refs.files.submit();
      let param = new FormData();
      for (let i in this.sellForm) {
        if (i === "files") {
          this.sellForm[i].forEach(file => {
            param.append("pics", file);
          });
        } else {
          console.log(this.sellForm[i]);
          param.append(i, this.sellForm[i]);
        }
      }
      if (this.$route.params.id) {
        api
          .updateGoods(this.$route.params.id, param)
          .then(res => {
            _this.$message.success("修改成功");
            _this.$router.push("/MySold").catch(e => e);
          })
          .catch(e => e);
      } else {
        api
          .sellGoods(param)
          .then(res => {
            _this.$message.success("上架成功");
            _this.$router.push("/MySold").catch(e => e);
          })
          .catch(e => e);
      }
    },
    limitWarning: function() {
      this.$message.warning("最多允许上传9张照片");
    },
    handlePictureCardRemove(file) {
      for (let i = 0; i < this.sellForm.files.length; i++) {
        if (this.sellForm.files[i].uid === file.uid) {
          this.sellForm.files.splice(i, 1);
          return;
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    getType(data) {
      this.sellForm.type = data;
    },
    resetForm: function() {
      this.$refs.sellForm.resetFields();
      this.$refs.files.clearFiles();
    },
    picUploadRequest: function(data) {
      let newPic = true;
      this.sellForm.files.forEach(file => {
        if (file.uid === data.file.uid) {
          newPic = false;
        }
      });
      if (newPic) {
        this.sellForm.files.push(data.file);
      }
    }
  }
};
</script>

<style></style>
