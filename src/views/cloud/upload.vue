<template>
  <div>
    <el-upload class="upload-demo" drag action="http://192.168.0.110:8080/g/upload" multiple on-success="success">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip">上传目录: {{nowPath}}</div>
    </el-upload>
  </div>
</template>
<script>
export default {
  name: "upload",
  props: ["nowPath"],
  data() {
    return {
      fileList: []
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    success(){
      this.$message({
        message: '文件上传成功',
        type: 'success'
      })
    }
  }
};
</script>