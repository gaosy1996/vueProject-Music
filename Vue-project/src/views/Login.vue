<template>
  <div>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm m-form">

          <el-form-item label="用户名" prop="username">
              <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item>
              <el-button type="primary" @click="login('ruleForm')">登陆</el-button>
              <el-button @click="memberRegister('ruleForm')">立即注册</el-button>
          </el-form-item>

      </el-form>
  </div>
</template>

<script>
import { post } from "../service/request";
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ required: true, message: "请输入用户名", validator: validateUser, trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", validator: validatePass, trigger: "blur" }]
      }
    };
    //验证用户名
    var validateUser = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    //验证密码
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
  },
  methods: {
    //登陆发起请求
    login(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          post("/login", {
            username: this.ruleForm.username,
            password: this.ruleForm.password
          }).then(res => {
            if (res.code === 1) {
              this.$message({
                   message: '登录成功',
                   type: 'success'
              });
              window.localStorage.setItem("token", res.token);
              this.$router.replace("/home/music");
            } else {
              alert("登陆失败");
            }
          });
        } else {
          alert("用户没有登陆!!");
          return false;
        }
      });
    },
    //没有注册 跳转注册页面
    memberRegister(formName) {
      this.$refs[formName].resetFields();
      this.$router.push("/register");
    }
  }
};
</script>

<style scoped>
.m-form {
  width: 65%;
  margin-top: 50px;
}
</style>