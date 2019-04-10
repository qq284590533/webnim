import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const index = r => require.ensure([], () => r(require('@/views/index')), 'index'); // 配送员首页

export default new Router({
    routes: [{
            path: '/',
            redirect: {
                name: 'index'
            }
        },
        {
            path: '/index',
            name: 'index',
            component: index
        },
    ]
})
