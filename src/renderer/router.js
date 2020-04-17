import Vue from 'vue'
import Router from 'vue-router'

import MenuOfChat from '@/views/chat/menu'
import Chat from '@/components/content/chat-box'

import MenuOfGrouping from '@/views/grouping/menu'

import MenuOfSetting from '@/views/setting/menu'
import Setting from '@/views/setting'

import Login from '@/components/login.vue'
import Main from '@/components/main.vue'

import MenuFunctions from '@/components/sidebar/functions'

import ContentContactInfo from '@/components/content/contact-info'
import ContentFunctions from '@/components/content/functions'

import VideoChat from '@/components/content/chat-box/special-pages/video-chat.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
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
          path: 'contacts',
          name: 'contacts',
          components: {
            menus: MenuOfGrouping,
            contents: ContentContactInfo
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
      path: '/video-chat',
      name: 'video-chat',
      component: VideoChat
    }
  ]
})
