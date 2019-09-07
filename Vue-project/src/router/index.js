import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            component: Home,
            children: [
                {
                    path: '/home',
                    redirect: '/home/music'
                },
                {
                    path: '/home/music',
                    name: 'Music',
                    component: resolve => require(['@/views/Music'], resolve)
                },
                {
                    path: '/home/discovery',
                    name: 'Discovery',
                    component: resolve => require(['@/views/Discovery'], resolve)
                },
                {
                    path: '/home/my',
                    name: 'My',
                    component: resolve => require(['@/views/My'], resolve)
                }
            ]
        },
        {
            path: '/login',
            name: 'Login',
            component: resolve => require(['@/views/Login'], resolve)
        },
        {
            path: '/register',
            name: 'Register',
            component: resolve => require(['@/views/Register'], resolve)
        },
        {
            path: '*',
            name: '404',
            component: resolve => require(['@/views/404'], resolve)
        }
    ],
    linkActiveClass: 'active'
})

let way = ['/home/music']
router.beforeEach((to, from, next) => {
    if (way.includes(to.path)) {
        let token = localStorage.getItem('token')
        if (token) {
            next()
        } else {
            next('/login')
        }
    } else {
        next()
    }
})

export default router;