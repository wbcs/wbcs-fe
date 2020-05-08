<template>
  <section>
    <div class="foot-tools" @click="emitEvent">
      <span class="icon icon-happy2" data-type="emoji" />
      <span class="icon icon-photo_size_select_actual" data-type="image" />
      <span class="icon icon-folder" data-type="file" v-show="!isGroup" />
      <span
        class="icon icon-microphone"
        data-type="audio"
        v-show="!isGroup"
      />
      <span
        class="icon icon-video-camera"
        data-type="video"
        data-arg="call"
        v-show="!isGroup"
      />
    </div>
    <textarea
      ref="textarea"
      v-model="msg"
      @keydown.enter="handleKeydownOfEnter"
    />
  </section>
</template>

<script>
export default {
  name: 'editor',
  data() {
    return {
      msg: ''
    }
  },
  props: ['isGroup'],
  methods: {
    handleKeydownOfEnter(e) {
      e.preventDefault()
      if (e.metaKey || e.shiftKey) {
        this.msg += '\n'
        return
      }
      if (!this.msg) return
      this.$emit('send', this.msg)
      this.msg = ''
    },
    handleFocus() {
      const { textare } = this.$refs
      textare.focus()
    },
    emitEvent(e) {
      const { type, arg } = e.target.dataset
      if (!type) return
      this.$emit(type, arg || e)
    }
  }
}
</script>

<style lang="less" scoped>
section {
  display: flex;
  flex-direction: column;
  height: 170px;
  border-top: 1px solid #ddd;
}
.foot-tools {
  display: flex;
  width: 100%;
  padding: 0.8em 1em 0.3em 1em;
  color: #666;
  .icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    margin-right: 1em;
    font-size: 1.2em;
    text-align: center;
    cursor: pointer;
    &:hover {
      color: #00ccff;
    }
  }
}
textarea {
  display: block;
  flex: 1;
  padding: 0 1em;
  width: 100%;
  height: 60px;
  border: none;
  font-size: 1em;
  color: #666;
  resize: none;
  outline: none;
  background: none;
}
</style>
