import Vue from 'vue'
import Router from 'vue-router'

// 导入组件
import ListArtical from '@/components/ListArtical'
import CreateArtical from '@/components/CreateArtical'
import EditArtical from '@/components/EditArtical'
import loginRegister from '@/components/loginRegister'
import userCenter from '@/components/userCenter'

Vue.use(Router);

export default new Router({
  routes: [
    { // 此处表示一打开网址所显示的页面，即首页默认展示页面
      path: '/', // 默认进入路由[写在第一个]
      name: 'login',
      component: loginRegister
    },
    { // 个人中心，公共组件（此路由未使用，因为这个组件封装得有问题）
      path:'/user',
      name:'usercenter',
      component:userCenter
    },
    { // 文章列表页
      path: '/articles/index',
      name: 'list-article',
      component:ListArtical
    },
    { // 创建文章页
      path: '/articles/create',
      name: 'create-article',
      component:CreateArtical
    },
    { // 修改编辑文章页
      path: '/articles/:id/edit',
      name: 'edit-article',
      component:EditArtical
    }
  ]
})
