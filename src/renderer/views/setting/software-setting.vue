<template>
  <div class="software-setting">
    <div class="head">{{ contentTitle }}</div>
    <div class="content">
      <div>
        <select v-model="currentLanguage" @change="changeLanguage">
          <option value="" disabled selected hidden>请选择软件语言</option>
          <option value="zh-CN">中文（简体）</option>
          <option value="en">English</option>
        </select>
      </div>
      <div>
        <button class="wbcs-logout" @click="handleLogout">退出登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { SOCKET } from '@/request'

export default {
  name: 'software-setting',
  data() {
    return {
      currentLanguage: ''
    }
  },
  computed: {
    contentTitle() {
      return this.$store.state.MULTI_LANG_TEXT.settings.software_setting
        .main_title
    },
    userInfo() {
      return this.$store.state.main.userInfo
    }
  },
  created() {
    this.currentLanguage = this.$store.state.REMOTE_STORE.get('lang')
  },
  methods: {
    changeLanguage() {
      this.$store.state.REMOTE_STORE.set('lang', this.currentLanguage)
      location.reload()
    },
    handleLogout() {
      SOCKET.emit('logout', this.userInfo.uid, data => {
        if (data.isLogoutSuccess) {
          SOCKET.emit('user-disconnect', this.userInfo.uid)
          ipcRenderer.send('logout')
        }
      })
    }
  }
}
</script>

<style lang="less">
.software-setting {
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

  .content {
    & > div {
      margin: 20px;
    }
  }

  .wbcs-logout {
    display: block;
    height: 26px;

    padding: 0 12px;
    border: none;
    border-radius: 4px;
    background: #e06c75;
    color: #fff;
  }
}
</style>
