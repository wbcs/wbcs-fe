<template>
  <div class="popover" :class="type">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'popover',
  props: {
    type: {
      default: 'left',
      type: String
    }
  }
}
</script>

<style lang="less" scoped>
.popover {
  position: relative;
  margin-left: 1.5em;
  padding: 0.5em;
  max-width: 300px;
  border-radius: 6px;
  font-size: 12px;
  word-break: break-all;
  cursor: text;
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 0;
    height: 0;
    border: 0.5em solid transparent;
  }
}
.left {
  margin-left: 1.5em;
  background: #ffffff;
  &::before {
    left: 0;
    transform: translate(-100%, -50%);
    border-right: 0.5em solid #ffffff;
  }
}
.right {
  margin-right: 1.5em;
  background: #00ff00;
  &::before {
    right: 0;
    transform: translate(100%, -50%);
    border-left: 0.5em solid #00ff00;
  }
}
</style>
