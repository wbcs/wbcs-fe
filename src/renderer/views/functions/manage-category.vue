<template>
  <div class="manage-category">
    <header class="head">{{ contentTitle }}</header>
    TODO
  </div>
</template>

<script>
export default {
  name: 'manage-category',
  data() {
    return {}
  },
  computed: {
    contentTitle() {
      return this.$store.state.MULTI_LANG_TEXT.functions.manage_category
        .main_title
    }
  },
  methods: {
    chatFunc(e) {
      console.log(e)
    }
  }
}
</script>

<style lang="less">
.manage-category {
  .head {
    width: 100%;
    height: 50px;
    line-height: 50px;

    padding: 0 0 0 20px;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
    color: #666666;
    letter-spacing: 0.09px;
    -webkit-app-region: drag;
  }
}
</style>
