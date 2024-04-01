import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决 导航栏或者底部导航tabBar 中的vue-router在3.0版本以上频繁点击菜单报错的问题。
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const routes = [
    {
        path: '/login',
        name: 'Login',
        meta: {name: '登录'},
        component: () => import('../views/login/index.vue')
    },
    {
        path: '/register',
        name: 'Register',
        meta: {name: '注册'},
        component: () => import('../views/register/index.vue')
    },
    {
        path: '/',
        name: 'Front',
        redirect: "/home",
        component: () => import('../views/Front.vue'),
        children: [
            {
                path: 'home',
                name: 'Home',
                meta: {name: '系统首页'},
                component: () => import('../views/home')
            },
            {
                path: 'item',
                name: 'Item',
                meta: {name: '失物招领广场'},
                component: () => import('../views/item')
            },
            {
                path: 'suggestion',
                name: 'Suggestion',
                meta: {name: '平台建议'},
                component: () => import('../views/suggestion')
            },
            {
                path: 'myItem',
                name: 'MyItem',
                meta: {name: '我的失物招领'},
                component: () => import('../views/myItem')
            },
            {
                path: 'message',
                name: 'Message',
                meta: {name: '我的消息'},
                component: () => import('../views/message')
            },
        ]
    },
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },
    {
        path: "*",
        redirect: "/404",
        meta: {name: '无法访问'},
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// 注：不需要前台的项目，可以注释掉该路由守卫
// 路由守卫

router.beforeEach((to, from, next) => {
    let user = JSON.parse(localStorage.getItem("xm-user") || '{}');
    if (to.path === '/') {
        if (user.role) {
            if (user.role === 'USER') {
                next('/front/home')
            } else {
                next('/home')
            }
        } else {
            next('/login')
        }
    } else {
        next()
    }
})

export default router
