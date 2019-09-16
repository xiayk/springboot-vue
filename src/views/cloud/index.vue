<template>
  <div class="box">
    <el-button @click="doUpload">上传文件</el-button>
    <el-button @click="doUpload">新建文件夹</el-button>
    <el-button @click="doUpload">删除选中</el-button>
    <el-breadcrumb separator="/" style="margin:30px;">
      <el-breadcrumb-item>
        <a @click="dohome">根目录</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="(p,index) in path" v-bind:key="p">
        <a @click="toFolder(index)">{{p}}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      :data="fileList"
      style="width: 100%"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      show-header="false"
      height="900"
    >
      <el-table-column type="selection" width="50" height="50"></el-table-column>
      <el-table-column
        label="文件名"
        width="500"
        show-overflow-tooltip="true"
        row-click="toFile(scope.row)"
      >
        <template slot-scope="scope">
          <i :class="scope.row | getTypes"></i>
          <!-- el-icon-folder
          el-icon-tickets
          el-icon-picture-outline-->
          <a
            style="margin-left: 10px;"
            @click="toFile(scope.row)"
            href="javascript:;"
          >{{ scope.row.key==null?scope.row:scope.row.key}}</a>
          <!-- <el-link icon="el-icon-edit" title="重命名"></el-link> -->
          <el-link
            icon="el-icon-document-copy"
            @click="copyPath(scope.row.key)"
            title="复制链接"
            v-if="scope.row.key!=null"
            style="margin-left:5px;margin-right:5px"
          ></el-link>
          <el-popover
            placement="top-start"
            title="预览"
            width="150"
            trigger="hover"
            v-if="scope.row.key!=null"
          >
            <el-image
              style="width: 150px; height: 150px"
              :src="'https://xiayk-1251881986.cos.ap-chengdu.myqcloud.com/' + scope.row.key"
            ></el-image>
            <el-link icon="el-icon-view" slot="reference">预览</el-link>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="文件大小" width="130">
        <template slot-scope="scope">
          <span v-if="scope.row.size!=null">{{ scope.row.size / 1024 | numFilter}} KB</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.lastModified!=null">{{ scope.row.lastModified | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="editRow(scope.$index, fileList)"
            type="text"
            size="small"
          >编辑</el-button>
          <el-button
            type="text"
            @click.native.prevent="deleteRow(scope.$index, fileList)"
            size="small"
          >移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
      <upload v-bind:message="nowPath"></upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style>
.box {
  padding: 50px 20px;
}

.x_blue {
  color: blue;
}

.x_orange {
  color: orange;
}
.x_green {
  color: green;
}

.x_size_20 {
  font-size: 20px;
}
</style>

<script>
import { http } from "@/api";
import {
  formateDate,
  formateArr,
  getType,
  formateFileName
} from "../../lib/utils";
import upload from "./upload";
export default {
  name: "cloud",
  components: {
    upload
  },
  methods: {
    dohome() {
      this.path = [];
      this.nowPath = "";
      this.getFile("");
    },
    deleteRow(index, rows) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          rows.splice(index, 1)
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    toFile(data) {
      if (data.key) {
        
      } else {
        this.path.push(data);
        console.log(this.path);
        this.nowPath += data + "/";
        this.getFile(this.nowPath);
      }
    },
    copyPath(data) {
      let url = "https://xiayk-1251881986.cos.ap-chengdu.myqcloud.com/" + data;
    },
    doUpload() {
      this.dialogVisible = true;
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    toFolder(e) {
      this.path.splice(e + 1, this.path.length - e);
      this.nowPath = this.path.join("/") + "/";
      this.getFile(this.nowPath);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

    getFile(path) {
      this.loading = true;
      var _this = this;
      http("/g/filelist", { str: path }).then(res => {
        _this.nowPath = res.data.path;
        _this.fileList = res.data.folder_list.concat(res.data.file_list);
        _this.loading = false;
      });
    }
  },
  data() {
    return {
      nowPath: "",
      folders: [],
      loading: true,
      path: [],
      fileList: [],
      dialogVisible: false
    };
  },
  filters: {
    formateName(name) {
      formateFileName(name);
    },

    //时间戳
    formatDate(time) {
      return formateDate(time);
    },
    numFilter(value) {
      // 截取当前数据到小数点后两位
      let realVal = parseFloat(value).toFixed(2);
      return realVal;
    },
    getTypes(data) {
      return getType(data);
    }
  },
  mounted: function() {
    this.getFile(this.nowPath);
  }
};
</script>