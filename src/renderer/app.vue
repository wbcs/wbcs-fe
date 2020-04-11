<template>
  <router-view />
</template>

<script>
export default {
  name: 'app',
  mounted() {
    // window.addEventListener('beforeunload', (e) => {
    //   this.$electron.ipcRenderer.send('beforeunload')
    //   alert()
    //   e.returnValue = false
    // })
  }
}
</script>
