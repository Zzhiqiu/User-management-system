<!--1、先获取指定ID的数据，并渲染到编辑页面-->
<!--2、根据ID修改数据，并同步保存到数据库中-->

<template>
  <el-form @submit.native.prevent="saveUser" ref="form" :model="user" label-width="80px">
    <el-form-item label="邮箱">
      <el-input v-model="user.email"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input type="password" v-model="user.password"></el-input>
    </el-form-item>
    <el-form-item label="是否为管理员">
      <el-switch v-model="user.isadmin"></el-switch>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: "EditUser",
  data() {
    return {
      user: {
        email: '',
        password: '',
        isadmin: false
      }
    }
  },
  methods: {
    cancel() {
      this.$router.push('/articles/index');
    },
    saveUser() {
      this.$http.put(`users/${this.$route.params.id}`, this.user).then(res => {
        this.$message({
          message: '用户信息修改成功',
          type: 'success'
        });
        this.$router.push('/articles/index');
      });
    },
    fetch() {
      this.$http.get(`users/${this.$route.params.id}`).then(res => {
        this.user = res.data;
      });
    }
  },
  created() {
    this.fetch();
  }
}
</script>

<style scoped>

</style>
