<template>
  <section
    class="chat-box-foot"
    @click="handleFooterClick"
  >
    <div>
      <div class="foot-tools">
        <span class="icon icon-happy2" @click="openFaceDialog" />
        <span
          class="icon icon-photo_size_select_actual"
          @click="openImageDialog"
        />
        <span
          v-show="!isGroup"
          class="icon icon-folder"
          @click="openFileDialog"
        />
        <span
          v-show="!isGroup"
          class="icon icon-microphone"
          @click="openVoiceChatDialog"
        />
        <span
          v-show="!isGroup"
          class="icon icon-video-camera"
          @click="openVideoChatDialog('call')"
        />
      </div>
      <div class="foot-input">
        <textarea
          v-model="message"
          ref="textarea"
          placeholder="请输入消息"
          @keydown.enter="sendTextMessage($event)"
        />
      </div>
    </div>
    <div>
      <span class="icon icon-send-o" @click="sendTextMessage" />
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      message: ''
    }
  },
  props: [
    'isGroup',
    'handleFooterClick',
  ]
}
</script>

<style lang="less" scoped></style>
