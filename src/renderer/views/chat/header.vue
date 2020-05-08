<template>
  <header>
    <span class="title">{{ title }}</span>
    <span
      class="icon icon-users"
      v-show="isGroup"
      @click.stop="handleIconClick"
    />
  </header>
</template>

<script>
export default {
  name: 'chat-header',
  props: ['title', 'isGroup'],
  methods: {
    handleIconClick() {
      this.$emit('iconClick')
    }
  }
}
</script>

<style lang="less" scoped>
header {
  position: relative;
  padding: 0.8em 20px;
  border-bottom: 1px solid #ddd;
  -webkit-app-region: drag;
}
.title {
  font-size: 1.1em;
  font-weight: 400;
}
.icon {
  position: absolute;
  top: 50%;
  right: 1em;
  transform: translateY(-50%);
  cursor: pointer;
}
</style>
