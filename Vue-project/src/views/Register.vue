<template>
  <div>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm m-form"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="register('ruleForm')">注册</el-button>
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
        username: [
          {
            required: true,
            message: "请输入用户名",
            validator: validateUser,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            validator: validatePass,
            trigger: "blur"
          }
        ]
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
    register(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          post("/registry", {
            username: this.ruleForm.username,
            password: this.ruleForm.password
          }).then(res => {
            if (res.code === 1) {
              this.$message({
                        message: '注册成功',
                        type: 'success'
                    });
              this.$router.replace("/login");
            } else {
              alert("注册失败");
            }
          });
        } else {
          alert("请注册!!");
          return false;
        }
      });
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