<template>
  <div class="create-group">
    <header>{{ contentTitle }}</header>

    <div class="form">
      <div class="form-item form-item-avatar">
        <div class="img">
          <label for="avatar-input"><img :src="avatar"/></label>
        </div>
        <div class="input">
          <input
            id="avatar-input"
            ref="avatarInput"
            type="file"
            accept="image/*"
          />
        </div>
      </div>

      <div class="form-item form-item-input">
        <input
          type="text"
          v-model="nickname"
          placeholder="请输入群组名称"
          required
        />
      </div>

      <div class="form-item form-item-button">
        <button @click="createGroup">创建群组</button>
      </div>
    </div>
  </div>
</template>

<script>
import { SOCKET } from '@/request'

export default {
  name: 'create-group',
  data() {
    return {
      nickname: '',
      avatar:
        'http://localhost:3000/upload/default/default-group-avatar.png'
    }
  },
  computed: {
    contentTitle() {
      return this.$store.state.MULTI_LANG_TEXT.functions.create_group
        .main_title
    }
  },
  methods: {
    createGroup() {
      if (!this.nickname) {
        alert('群组名称不得为空')
        return
      }
      SOCKET.emit(
        'create-group',
        {
          uid: this.$store.state.uid,
          groupInfo: {
            // avatar: '',
            nickname: this.nickname,
            members: [
              {
                uid: this.$store.state.uid,
                flag: '群主'
              }
            ]
          }
        },
        data => {
          alert(data.message)
        }
      )
    }
  }
}
</script>

<style scoped lang="less">
.create-group {
  header {
    width: 100%;
    height: 50px;
    line-height: 50px;

    padding: 0 0 0 20px;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
    color: #666666;
    -webkit-app-region: drag;
  }

  .form-item {
    display: flex;
    justify-content: center;
    padding-top: 30px;
  }

  .form-item-avatar {
    display: block;
    margin: 0 auto;
    width: 100px;

    .img {
      width: 100px;
      height: 100px;

      img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .input {
      input[type='file'] {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
      }
    }
  }

  .form-item-input {
    input {
      padding: 4px 8px;

      &:focus {
        outline: none;
      }
    }
  }

  .form-item-button {
    button {
      width: 100px;
      height: 26px;

      border: none;
      border-radius: 4px;
      background: #696969;
      color: #fff;
    }
  }
}
</style>
