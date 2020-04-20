import * as Vue from 'vue'
import * as Router from 'vue-router'

import Main from '@/views/main'
import MenuOfChat from '@/views/chat/menu'
import Chat from '@/views/chat'
import MenuOfGrouping from '@/views/grouping/menu'
import Grouping from '@/views/grouping'
import MenuOfSetting from '@/views/setting/menu'
import Setting from '@/views/setting'
import MenuFunctions from '@/views/functions/menu'
import ContentFunctions from '@/views/functions'

import Login from '@/views/login'
import VideoChat from '@/views/video-chat'

Vue.use(Router)

const routes = [
  {
    path: '/app',
    name: 'app',
    component: Main,
    children: [
      {
        path: 'chats',
        name: 'chats',
        components: {
          menus: MenuOfChat,
          contents: Chat
        }
      },
      {
        path: 'contacts', // grouping
        name: 'contacts',
        components: {
          menus: MenuOfGrouping,
          contents: Grouping
        }
      },
      {
        path: 'functions',
        name: 'functions',
        components: {
          menus: MenuFunctions,
          contents: ContentFunctions
        }
      },
      {
        path: 'settings',
        name: 'settings',
        components: {
          menus: MenuOfSetting,
          contents: Setting
        }
      }
    ]
  },
  {
    path: '*',
    redirect: { name: 'login' }
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/video-chat',
    name: 'video-chat',
    component: VideoChat
  }
]

const router = new Router({
  mode: 'history',
  routes,
})

export default router
