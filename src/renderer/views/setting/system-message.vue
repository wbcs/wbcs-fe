<template>
  <div class="system-message">
    <header class="head">{{ contentTitle }}</header>
    TODO
  </div>
</template>

<script>
export default {
  name: 'system-message',
  data() {
    return {}
  },
  computed: {
    contentTitle() {
      return this.$store.state.MULTI_LANG_TEXT.settings.system_message
        .main_title
    }
  }
}
</script>

<style lang="less">
.system-message {
  .head {
    width: 100%;
    height: 50px;
    line-height: 50px;

    padding: 0 0 0 20px;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
    color: #666666;
    letter-spacing: 0.09px;
  }
}
</style>
