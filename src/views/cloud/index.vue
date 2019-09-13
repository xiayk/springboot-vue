<template>
  <div class="box">
    <el-button @click="doUpload">上传文件</el-button>
    <el-button @click="clearFilter">新建文件夹</el-button>
    <el-button @click="clearFilter">删除选中</el-button>
    <el-breadcrumb separator="/" style="margin-left:30px;">
      <el-breadcrumb-item>
        <a>根目录</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="folder in folders" v-bind:key="folder">
        <a v-if="folder != nowPath" @click="toFolder(folder)">{{folder}}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="fileList" style="width: 100%">
      <el-table-column type="selection" width="50" height="50"></el-table-column>
      <el-table-column label="文件名" width="500">
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
              :src="'https://xiayk-1251881986.cos.ap-chengdu.myqcloud.com/'+scope.row.key"
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
      <el-table-column label="操作" minwidth="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-popover placement="top" width="160" v-model="visible">
            <p>确定删除这个文件吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
              >确定</el-button>
            </div>
            <el-button slot="reference" size="mini" type="danger">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
      <upload></upload>
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
import { formateDate, formateArr, getType } from "../../lib/utils";
import upload from "./upload";
export default {
  name: "cloud",
  components: {
    upload
  },
  methods: {
    toFile(data) {
      if (data.key) {
      } else {
        let path = this.nowPath + data;
        this.nowPath = path;
        this.getFile(path)
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
      console.log(e);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    getFile(path) {
      var _this = this;
      http("/g/filelist", { str: path }).then(res => {
        _this.folders = formateArr(res.data.folder);
        _this.fileList = formateArr(res.data.folder).concat(res.data.file_list);
      });
    }
  },
  data() {
    return {
      nowPath: "/",
      folders: [],
      fileList: [],
      dialogVisible: false
    };
  },
  filters: {
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