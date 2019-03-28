import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Chat = r => require.ensure([], () => r(require('@/views/Chat')), 'Chat'); // 配送员首页

export default new Router({
    routes: [{
            path: '/',
            redirect: {
                name: 'Chat'
            }
        },
        {
            path: '/chat',
            name: 'Chat',
            component: Chat
        },
    ]
})
