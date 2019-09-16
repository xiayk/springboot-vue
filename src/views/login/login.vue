<template>
  <div class="login layui-anim layui-anim-up">
    <form method="post" class="layui-form" id="login" action="javascript:;" v-if="login_type">
      <div @click="changeType" class="msgText">扫码登录</div>
      <input
        name="username"
        placeholder="用户名"
        type="text"
        v-model="login_data.username"
        lay-verify="required"
        class="layui-input"
      />
      <hr class="hr15" />
      <input
        name="password"
        lay-verify="required"
        v-model="login_data.password"
        placeholder="密码"
        type="password"
        class="layui-input"
      />
      <hr class="hr15" />
      <el-button value="登录" type="primary" style="width:100%;" :loading="load" v-loading.fullscreen.lock="load" @click="login">登录</el-button>
      <hr class="hr20" />
    </form>
    <div v-if="!login_type" class="qrcode">
      <div @click="changeType">账号登录</div>
      <div id="qrcode"></div>
      <div id="msg">
        <i class="layui-icon layui-icon-ok" style="font-size: 20px; color: green;margin-right:5px;"></i>扫描成功
      </div>
      <div id="refresh" @click="getQrcode">
        <i
          class="layui-icon layui-icon-refresh"
          style="font-size: 20px; color: green;margin-right:5px;"
        ></i>刷新二维码
      </div>
    </div>
  </div>
</template>

<style>
#msg {
  display: none;
}
#msg,
#refresh {
  height: 40px;
  line-height: 30px;
  cursor: pointer;
}
.msgText {
  margin-bottom: 30px;
}
#qrcode {
  height: 200px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login {
  margin: 120px auto 0 auto;
  min-height: 420px;
  max-width: 420px;
  padding: 40px;
  background-color: #ffffff;
  margin-left: auto;
  margin-right: auto;
  border-radius: 4px;
  /* overflow-x: hidden; */
  box-sizing: border-box;
}
.login .message {
  margin: 10px 0 0 -58px;
  padding: 18px 10px 18px 60px;
  background: #189f92;
  position: relative;
  color: #fff;
  font-size: 16px;
}

.login input[type="text"],
.login input[type="file"],
.login input[type="password"],
.login input[type="email"],
select {
  border: 1px solid #dcdee0;
  vertical-align: middle;
  border-radius: 3px;
  height: 50px;
  padding: 0px 16px;
  font-size: 14px;
  color: #555555;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}
.login input[type="text"]:focus,
.login input[type="file"]:focus,
.login input[type="password"]:focus,
.login input[type="email"]:focus,
select:focus {
  border: 1px solid #27a9e3;
}
.login input[type="submit"],
.login input[type="button"] {
  display: inline-block;
  vertical-align: middle;
  padding: 12px 24px;
  margin: 0px;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  color: #ffffff;
  background-color: #189f92;
  border-radius: 3px;
  border: none;
  -webkit-appearance: none;
  outline: none;
  width: 100%;
}
.login hr {
  background: #fff url() 0 0 no-repeat;
}
.login hr.hr15 {
  height: 15px;
  border: none;
  margin: 0px;
  padding: 0px;
  width: 100%;
}
.login hr.hr20 {
  height: 20px;
  border: none;
  margin: 0px;
  padding: 0px;
  width: 100%;
}
</style>

<script>
import QRCode from "qrcodejs2";
import { login, http } from "@/api";
var qs = require("qs");
export default {
  name: "login",
  data() {
    return {
      title: "login",
      login_type: true,
      load: false,
      login_data: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    login() {
      this.load = true;
      let _this = this;
      login(_this.login_data)
        .then(res => {
          if (res.success) {
            _this.$message({
              message: "登录成功",
              type: "success"
            });
            window.sessionStorage.setItem("XWEB_TOKEN", res.data);
            _this.$router.replace({ path: "/" });
          } else {
            _this.$message({
              message: res.data.errorMessage,
              type: "warning"
            });
            _this.load = false;
          }
        })
        .catch(failResponse => {});
    },
    changeType() {
      this.login_type = !this.login_type;
      if (!this.login_type) {
        this.getQrcode();
      }
    },
    getQrcode() {
      // var s = [];
      // var hexDigits = "0123456789abcdef";
      // for (var i = 0; i < 36; i++) {
      //   s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      // }
      // s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      // s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      // s[8] = s[13] = s[18] = s[23] = "-";
      layui.use(["layer", "jquery"], function() {
        var layer = layui.layer,
          $ = layui.jquery;
        var loading = layer.load(1, {
          shade: [0.1, "#fff"] //0.1透明度的白色背景
        });
        http("/g/login/scan", {}).then(res => {
          if (res.code == 200) {
            var uuid = res.data;
            $("#qrcode").html("");
            layer.closeAll("loading");
            var qrcode = new QRCode("qrcode", {
              text: uuid,
              width: 200,
              height: 200,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.H
            });
            setInterval(function() {
              http("/g/login/scan/pool", { code: uuid }).then(result => {
                if (result.code == 200) {
                  $("#msg").show();
                  layer.msg("登录成功", { icon: 1 });
                } else if (result.code == 40099) {
                  layer.msg("二维码过期", { icon: 5 });
                  _this.getQrcode();
                }
              });
            }, 3000);
          }
        });
      });
    }
  }
};
</script>