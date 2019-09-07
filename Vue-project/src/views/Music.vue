<template>
  <div>
    <el-container>
      <el-header class="m-header">
        <h3>xx音乐</h3>
        <span>
          欢迎 :
          <b>{{userName}}</b>
        </span>
        <el-button size="mini" @click="add">添加</el-button>
        <el-button size="mini" type="primary" @click="quit">退出</el-button>
      </el-header>

      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="100px">音乐列表</el-aside>

        <el-main>
          <!-- 表格 -->
          <el-table :data="musicList" style="width: 100%">
            <el-table-column label="序号" type="index"></el-table-column>

            <el-table-column label="歌名" prop="music_name"></el-table-column>

            <el-table-column label="图片">
              <template slot-scope="scope">
                <div>
                  <img :src="scope.row.pic" class="m-img" />
                </div>
              </template>
            </el-table-column>

            <el-table-column label="歌手" prop="singer_name"></el-table-column>

            <el-table-column label="是否上架" prop="isup">
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.isup ? '是':'否'}}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="right">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="edit(scope.row.id)">修改</el-button>
                <el-button size="mini" @click="del(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="limit"
            @current-change="pageChange"
          ></el-pagination>
        </el-main>
      </el-container>
      <!-- 弹窗 -->
      <el-dialog title="添加歌曲" :visible.sync="dialogVisible" width="30%">
        <!-- 弹窗里的表单 -->
        <el-form
          :model="musicForm"
          status-icon
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm m-form"
        >
          <el-form-item label="歌名" prop="music_name">
            <el-input type="text" v-model="musicForm.music_name"></el-input>
          </el-form-item>

          <el-form-item label="歌手" prop="singer_name">
            <el-input type="text" v-model="musicForm.singer_name"></el-input>
          </el-form-item>

          <el-form-item label="图片" prop="pic">
            <input type="file" @change="upload" />
            <img :src="musicForm.pic" class="m-img" />
          </el-form-item>

          <el-form-item label="是否上架" prop="isup">
            <el-radio-group v-model="musicForm.isup">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
            <el-button size="mini" type="primary" @click="operate">{{editId ? '修改':'添加'}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { get, post } from "../service/request";
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      musicList: [],
      dialogVisible: false,
      musicForm: {
        music_name: "",
        singer_name: "",
        pic: "",
        isup: 0
      },
      pagenum: 1, //页数
      limit: 2, //每页展示的条数
      total: 0, //总条数
      editId: ""
    };
  },
  computed: {
    ...mapState(["userName"])
  },
  created() {
    //获取用户信息
    get("/userinfo").then(res => {
      if (res.code === 1) {
        this.getUserName(res.data.username);
      }
    });
    //获取音乐列表
    this.getMusicList();
    // get("/querymusic?pagenum=1&limit=2").then(res => {
    //   if (res.code === 1) {
    //     this.musicList = res.data;
    //   }
    // });
  },
  methods: {
    ...mapMutations(["getUserName"]),
    //封住获取音乐列表
    getMusicList() {
      get(`/querymusic?pagenum=${this.pagenum}&limit=${this.limit}`).then(
        res => {
          console.log(res);
          if (res.code === 1) {
            this.musicList = res.data;
            this.total = res.total;
          }
        }
      );
    },
    //用户退出登陆
    quit() {
      this.$confirm("退出登陆, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //删除token
        localStorage.removeItem("token");
        //跳转页面
        this.$router.push("/login");
      });
    },
    //添加打开弹框
    add() {
      //点击添加先重置
      this.rest();
      this.dialogVisible = true;
    },
    //上传图片
    upload(e) {
      //获取file的相关信息
      let file = e.target.files[0];
      //获取FromData实例
      let fromData = new FormData();
      //添加一个参数 file:file
      fromData.append("file", file);
      //请求数据,传如fromData
      post("/upload", fromData).then(res => {
        if (res.code === 1) {
          this.musicForm.pic = "http://localhost:3000" + res.url;
        }
      });
    },
    operate() {
      //判断editId是否存在 存在就修改 不存在就添加
      if (this.editId) {
        this.editMusic();
      } else {
        this.addMusic();
      }
    },
    //添加音乐
    addMusic() {
      post("/addmusic", this.musicForm).then(res => {
        if (res.code === 1) {
          this.dialogVisible = false;
          this.$message({
            message: "成功",
            type: "success"
          });
          this.getMusicList();
          this.musicForm.music_name = "";
          this.musicForm.singer_name = "";
          this.musicForm.pic = "";
          this.musicForm.isup = 0;
        }
      });
    },
    //修改音乐
    editMusic() {
      post(
        "/updatemusic",
        Object.assign({}, this.musicForm, { id: this.editId })
      ).then(res => {
        console.log(res);
        if (res.code === 1) {
          this.dialogVisible = false;
          this.getMusicList();
        }
      });
    },
    //改变页码
    pageChange(val) {
      console.log(val);
      this.pagenum = val;
      this.getMusicList();
    },
    //删除
    del(id) {
      get(`/deletemusic?id=${id}`).then(res => {
        console.log(res);
        if (res.code === 1) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.musicList.length <= 1 && this.pagenum > 1 ? --this.pagenum : this.pagenum;
          this.getMusicList();
        }
      });
    },
    //修改
    edit(id) {
      //弹框改变状态
      this.dialogVisible = true;
      //拿到对应id的数据
      let editObj = this.musicList.find(item => item.id === id);
      //赋值
      this.musicForm.music_name = editObj.music_name;
      this.musicForm.singer_name = editObj.singer_name;
      this.musicForm.pic = editObj.pic;
      this.musicForm.isup = editObj.isup;
      this.editId = id;
    },
    ///重置
    rest() {
      this.musicForm.music_name = "";
      this.musicForm.singer_name = "";
      this.musicForm.pic = "";
      this.musicForm.isup = 0;
      this.editId = "";
    }
  }
};
</script>

<style scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}

body > .el-container {
  margin-bottom: 40px;
}

.m-header {
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.m-img {
  width: 60px;
  height: 60px;
}
</style>
