<template>
  <el-container style="height: 500px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">

      <!--此处必须要写上router，后面的唯一标识index才有效！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！-->
      <el-menu router :default-openeds="['1', '3']">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-tickets"></i>用户管理</template>

          <!--index属性是什么意思？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？-->
          <!--使用 vue-router 模式，则会在激活导航时以 index 作为 path 进行路由跳转-->
<!--          <el-menu-item index="/articles/index">我的博客</el-menu-item>-->
<!--          <el-menu-item index="/articles/create">写文章</el-menu-item>-->

        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown trigger="click" @command="handleCommand">
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userCenter">我的信息</el-dropdown-item>
            <el-dropdown-item command="changepassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="deleteuseremail">用户注销</el-dropdown-item>
            <el-dropdown-item command="loginout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!--<span :data="user">{{user.username}}</span>-->

        <!--头部显示用户的email-->
        <span>{{useremail}}</span>
      </el-header>

      <el-main>
        <el-table :data="articles">
          <el-table-column prop="email" label="用户邮箱" width="300">
          </el-table-column>
          <el-table-column prop="registrationTime" label="注册时间" width="620">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <!--scope表示当前这一行的数据-->
            <template slot-scope="scope">
              <el-button @click="remove(scope.row._id)" type="text" size="small">删除</el-button>
              <el-button @click="edit(scope.row._id)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
  // import UserCenter from "@/components/userCenter";
    export default {
      name: "ListArtical",
      // components: {UserCenter},
      data() {
        return {
          articles:[],
          email: 'wyp@gmail.com'
        }
      },

      computed:{
        useremail(){
          let useremail = sessionStorage.getItem('ms_useremail');
          console.log("ms_useremail:"+useremail)
          return useremail ? useremail : this.email;
        }
      },

      methods:{
        // handleCommand(command) {
        //   if (command === 'loginout') {
        //     sessionStorage.removeItem('ms_useremail');
        //     sessionStorage.removeItem('ms_userId');
        //     this.$router.push('/');
        //   } else if (command === 'userCenter') {
        //     this.$router.push('/articles/index');
        //   } else if (command === 'changepassword') {
        //     // 处理修改密码逻辑
        //   } else if (command === 'deleteuseremail') {
        //     // 处理用户注销逻辑
        //   }
        // },

        async handleCommand(command) {
          if (command === 'loginout') {
            sessionStorage.removeItem('ms_useremail');
            sessionStorage.removeItem('ms_userId');
            this.$router.push('/')
          } else if (command === 'userCenter') {
            this.$router.push('/user');
          } else if (command === 'changepassword') {
            // 获取旧密码和新密码
            const oldPassword = prompt('请输入旧密码');
            const newPassword = prompt('请输入新密码');
            // 发送修改密码请求
            const res = await this.$http.post('changepassword', {
              email: this.useremail,
              oldPassword,
              newPassword
            });
            // 处理响应结果
            if (res.data.code === 0) {
              alert('密码修改成功');
            } else {
              alert(res.data.message);
            }
          } else if (command === 'deleteuseremail') {
            // 发送用户注销请求
            const res = await this.$http.post('deleteuseremail', { email: this.useremail });
            // 处理响应结果
            if (res.data.code === 0) {
              alert('用户注销成功');
              sessionStorage.removeItem('ms_useremail');
              sessionStorage.removeItem('ms_userId');
              this.$router.push('/')
            } else {
              alert(res.data.message);
            }
          } else if (command === 'userCenter'){
            this.$router.push('/user');
          }
        },
        fetch() {

          // 获取当前登录用户的信息
          const user = JSON.parse(sessionStorage.getItem('ms_user'));
          // 判断当前登录用户是否为管理员
          if (user && user.isadmin) {
            // 如果是管理员，则获取所有用户的信息
            this.$http.get('users').then(res => {
              this.articles = res.data;
            });
          } else {
            // 如果不是管理员，则只获取当前登录用户的信息
            const currentUser = {
              email: user.useremail,
              registrationTime: user.registrationTime
            };
            this.articles = [currentUser];
          }
        },

        // fetch(){
        //   // 获取数据
        //   this.$http.get('articles').then(res =>{
        //     this.articles = res.data; // data表示真正的数据，上面template模块里面的:data
        //   })
        // },

        edit(id){
          // 获取当前登录用户的信息
          const user = JSON.parse(sessionStorage.getItem('ms_user'));
          console.log(user)
          // 判断当前登录用户是否为管理员
          if (user && user.isadmin) {
            // 如果是管理员，则允许编辑操作
            this.$router.push(`/articles/${id}/edit`);
          } else {
            // 如果不是管理员，则提示无法使用此功能
            alert('非管理员无法使用');
          }
        },

        remove(id) {
          // 获取当前登录用户的信息
          const user = JSON.parse(sessionStorage.getItem('ms_user'));
          // 判断当前登录用户是否为管理员
          if (user && user.isadmin) {
            // 如果是管理员，则允许删除操作
            this.$http.delete(`users/${id}`).then(res => {
              this.$message({
                message: '用户删除成功',
                type: 'success'
              });
              this.fetch();
            });
          } else {
            // 如果不是管理员，则提示无法使用此功能
            alert('非管理员无法使用');
          }
        }

      },

      // created()生命周期钩子函数，一般用于调用ajax获取页面初始化所需的数据
      created(){
        this.fetch();
      },

    }
</script>

<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>


