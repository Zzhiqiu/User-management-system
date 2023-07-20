<template>
  <!--增加内容@submit.native.prevent-->
  <el-form @submit.native.prevent="saveArticle" ref="form" :model="article" label-width="80px">
    <el-form-item label="文章标题">
      <el-input v-model="article.title"></el-input>
    </el-form-item>
    <el-form-item label="文章内容">
      <el-input type="textarea" v-model="article.body"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit">立即创建</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
    export default {
      name: "CreateArtical",
      data() {
        return {
          // 双向绑定，article命名，v-model表示
          article: {
            title: '',
            body: ''
          }
        }
      },
      methods: {
        cancel() {
          // 在这里执行取消操作
          // 例如：清除表单数据
          this.article = {
            title: '',
            body: ''
          }
          // 或者：将页面重定向到其他页面
          this.$router.push('/articles/index')
        },
        saveArticle() {
          this.$http.post('/articles',this.article).then(res =>{
            console.log(res.data);
            this.$message({
              message: '文章创建成功',
              type: 'success'
            });
            this.$router.push('/articles/index');  // 实现页面跳转
          })
        }
      }
    }
</script>

<style scoped>

</style>
