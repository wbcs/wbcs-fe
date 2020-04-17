<template>
  <router-view />
</template>

<script>
export default {
  name: 'app',
  mounted() {
    const { ipcRenderer } = this.$electron
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
