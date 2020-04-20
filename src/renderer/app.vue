<template>
  <router-view />
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'app',
  mounted() {
    ipcRenderer.on('goto-video', ({ uid, type }) => {
      this.$router.push({
        path: '/video-chat',
        query: {
          to: uid,
          type
        }
      })
    })
  }
}
</script>
