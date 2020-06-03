<template>
  <article ref="dialogBox">
    <MessageBox v-for="msg in messageList" :key="msg.uuid" :data="msg" />
  </article>
</template>

<script>
import MessageBox from './message-box'

export default {
  name: 'dialog-box',
  props: ['messageList'],
  components: {
    MessageBox
  },
  watch: {
    messageList() {
      this.$nextTick(() => {
        const { dialogBox } = this.$refs
        dialogBox.scrollTop = dialogBox.scrollHeight
      })
    }
  }
}
</script>

<style lang="less" scoped>
article {
  flex: 1;
  padding: 0.5em 1em;
  overflow-y: auto;
  user-select: text;
}
</style>
