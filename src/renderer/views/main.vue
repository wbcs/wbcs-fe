<template>
  <div class="app">
    <Menu />
    <aside>
      <div class="user-list" ref="sidebar">
        <Search />
        <div id="menu-content">
          <keep-alive>
            <router-view name="menus" />
          </keep-alive>
        </div>
      </div>
    </aside>
    <Resize @resize="handleResize" />
    <main>
      <keep-alive>
        <router-view id="content" name="contents" />
      </keep-alive>
    </main>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { SOCKET } from '@/request'

import Search from '@/components/search'
import Resize from '@/components/resize'
import Menu from './menu.vue'

export default {
  name: 'app',
  components: {
    Menu,
    Resize,
    Search
  },
  created() {
    SOCKET.emit('user-connect', this.$store.state.uid)
    this.getUserInfo()
    this.loadRecentChatList()
  },
  methods: {
    handleResize(offset) {
      const { sidebar } = this.$refs
      const newWidth = sidebar.offsetWidth + offset
      sidebar.style.width = `${newWidth}px`
    },
    getUserInfo() {
      if (!this.$store.state.uid) {
        ipcRenderer.send('logout')
        return
      }
      SOCKET.emit('get-user-info', this.$store.state.uid, data => {
        this.$store.commit('main/setUserInformation', data)
      })
    },
    loadRecentChatList() {
      this.$store.commit('chat/loadRecentChat')
    }
  }
}
</script>

<style scoped lang="less">
.app {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
aside,
main {
  background: #f3f3f3;
}
aside {
  display: flex;
  background: #fff;
}
main {
  flex: 1;
  overflow: hidden;
}
.user-list {
  width: 250px;
  min-width: 200px;
  max-width: 300px;
}
#menu-content {
  overflow-y: auto;
}
#content {
  flex: 1;
}
</style>
