<template>
  <div ref="resize" @mousedown="handleMouseDown" />
</template>

<script>
export default {
  methods: {
    handleMouseDown(e) {
      window.addEventListener('mousemove', this.handleMouseMove)
      window.addEventListener('mouseup', this.handleMouseUp)
    },
    handleMouseMove(e) {
      const { resize } = this.$refs
      const offset = e.pageX - resize.offsetLeft
      if (!offset) return
      this.$emit('resize', offset)
    },
    handleMouseUp() {
      window.removeEventListener('mousemove', this.handleMouseMove)
      window.removeEventListener('mouseup', this.handleMouseUp)
    }
  }
}
</script>

<style scoped lang="less">
div {
  width: 5px;
  border-right: 1px solid #d9dbde;
  &:hover {
    cursor: ew-resize;
  }
}
</style>
