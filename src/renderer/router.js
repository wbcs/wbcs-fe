import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/login'

import MenuOfChat from '@/views/chat/menu'
import Chat from '@/components/content/chat-box'

import MenuOfGrouping from '@/views/grouping/menu'

import MenuOfSetting from '@/views/setting/menu'
import Setting from '@/views/setting'

import Main from '@/views/main.vue'

import MenuFunctions from '@/components/sidebar/functions'

import ContentContactInfo from '@/components/content/contact-info'
import ContentFunctions from '@/components/content/functions'
import VideoChat from '@/components/content/chat-box/special-pages/video-chat.vue'

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
        },
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
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'login' }
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

export default router

// const routes = [
//   {
//     path: "/",
//     name: "Home",
//     component: Home
//   },
//   {
//     path: "/about",
//     name: "About",
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () =>
//       import(/* webpackChunkName: "about" */ "../views/About.vue")
//   }
// ];
