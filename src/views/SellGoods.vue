<template>
  <div>
    <el-row>
      <el-col
        :span="12"
        :offset="6"
        label-position="right"
        style="box-shadow:rgba(0, 0, 0, 0.12) 0px 2px 4px, rgba(0, 0, 0, 0.04) 0px 0px 6px; border-radius:5px; padding:20px; background-color:white"
      >
        <div style="font-size:30px;margin-bottom:10px">填写出售商品信息</div>
        <el-form
          :model="sellForm"
          ref="sellForm"
          status-icon
          label-position="right"
          label-width="80px"
        >
          <el-form-item prop="name" label="商品名">
            <el-input v-model="sellForm.name"></el-input>
          </el-form-item>
          <el-form-item prop="minPrice" label="起拍价">
            <el-input v-model="sellForm.minPrice" type="number">
              <template slot="prepend">￥</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="description" label="商品描述">
            <el-input v-model="sellForm.description" type="textarea" :rows="2">
            </el-input>
          </el-form-item>

          <el-form-item prop="type" label="商品类型" style="text-align:left">
            <typeSelector @type="getType"></typeSelector>
          </el-form-item>
          <el-form-item
            prop="overTime"
            label="结束时间"
            style="text-align:left"
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
            <el-button type="primary" @click="upload">上架</el-button>
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
      sellForm: {
        name: "",
        overTime: "",
        minPrice: "",
        type: "",
        files: [],
        description: ""
      },
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
  methods: {
    upload: function() {
      let _this = this;
      this.$refs.files.submit();
      let param = new FormData();
      for (let i in this.sellForm) {
        if (i !== "files") {
          param.append(i, this.sellForm[i]);
        } else {
          // this.sellForm[i].forEach(files=>{
          //   param.append(i,files);
          // })
          let temp = this.sellForm[i];
          param.append("file", temp[0]);
        }
      }
      api
        .sellGoods(param)
        .then(res => {
          _this.$message("上架成功");
          _this.$router.push("/").catch(e => e);
        })
        .catch(e => e);
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

      console.log("get out");
    }
  }
};
</script>

<style></style>
