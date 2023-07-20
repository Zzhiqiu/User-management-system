<template>
  <div>
    <h2>个人信息</h2>
    <form>
      <div>
        <label for="email">邮箱:</label>
        <input type="email" id="email" v-model="email" />
      </div>
      <div>
        <label for="avatar">头像:</label>
        <input type="file" id="avatar" @change="onAvatarChange" />
      </div>
      <div><img :src="avatar" alt="Avatar" class="avatar"></div>
      <div>
        <label for="phone">电话:</label>
        <input type="tel" id="phone" v-model="phone" />
      </div>
      <button @click.prevent="updateInfo">更新信息</button>
      <button @click.prevent="cancel">返回</button>
    </form>
  </div>
</template>

<script>

export default {
  data() {
    return {
      email: "wyp@gmail.com",
      avatar: "",
      phone: ""
    };
  },
  methods: {
    fetch() {
      // 获取当前登录用户的信息
      const user = JSON.parse(sessionStorage.getItem('ms_user'));
      // console.log(user)
      this.email=user.useremail
      const res = this.$http.get(`user/else/${this.email}`).then(res => {
        console.log(res.data);
        this.phone = res.data.phone;
        this.avatar = res.data.avatar;
      });
    },
    cancel() {
      this.$router.push('/articles/index');
    },
    onAvatarChange(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          this.avatar = e.target.result;
          console.log(this.avatar)
        };
        reader.readAsDataURL(file);
      }
    },
    updateInfo(){
      const res = this.$http.put('user', {
        email: this.email,
        avatar: this.avatar,
        phone: this.phone
      }).then(res =>{

        // 处理响应结果
        if (res.data.code === 0) {
          alert('资料更新成功');
        } else {
          alert(res.data.message);
        }
      });
    }

  }, created(){
    this.fetch();
  },
};
</script>
<style>
.avatar {
  width: 200px;
  height: 200px;
}

</style>