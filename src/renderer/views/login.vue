<template>
  <section class="login">
    <header>wbcs!</header>
    <img src="../assets/logo.png" alt="logo" />
    <div class="form">
      <div>
        <i class="icon-user" />
        <input
          type="text"
          maxlength="11"
          data-key="phone"
          autocomplete="off"
          class="input-phone"
          autofocus
          v-model="phone"
          :placeholder="MULTI_LANG_TEXT.phone_hint"
          @input="handleInput"
        />
      </div>
      <div>
        <i class="icon-key" />
        <input
          type="text"
          maxlength="6"
          autocomplete="off"
          data-key="authcode"
          class="input-authcode"
          v-model="authcode"
          :placeholder="MULTI_LANG_TEXT.authcode_hint"
          @input="handleInput"
          @keydown.enter="login"
        />
        <button
          class="btn-get-authcode"
          :disabled="authcodeLock"
          :class="authcodeLock ? 'disabled' : 'not-disabled'"
        >
          <span v-if="!authcodeLock" @click="getAuthcode">
            {{ MULTI_LANG_TEXT.authcode_button }}
          </span>
          <span v-if="authcodeLock">{{ countDownTime }} s</span>
        </button>
      </div>
      <footer>
        <button
          class="btn-submit"
          :disabled="!isFormFinished"
          :class="isFormFinished ? 'not-disabled' : 'disabled'"
          @click="login"
        >
          {{ MULTI_LANG_TEXT.submit_button }}
        </button>
      </footer>
    </div>
  </section>
</template>

<script>
import * as Vue from 'vue'
import { remote, ipcRenderer } from 'electron'

import { Message } from '@/utils'
import { fetchLogin, fetchAuthcode } from '@/request'
import MULTI_LANGUAGE from '@/config/lang'

const REMOTE_STORE = remote.getGlobal('store')

export default {
  name: 'login',
  data() {
    return {
      phone: '',
      authcode: '',
      countDownTime: 60,
      authcodeLock: false,
    }
  },
  computed: {
    isFormFinished() {
      return this.phone.length === 11 && this.authcode.length === 6
    },
    isPhoneNumberValid() {
      const phoneNumberRegx = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
      const isLegal = phoneNumberRegx.test(this.phone)
      if (!isLegal) {
        this.showIllgalPhoneNumberNotification()
      }
      return isLegal
    },
    MULTI_LANG_TEXT() {
      const currentLanguage = REMOTE_STORE.get('lang')
      return MULTI_LANGUAGE[currentLanguage].login
    }
  },
  methods: {
    handleInput(e) {
      const { key: phoneOrAuthcode } = e.target.dataset
      const prevVal = this[phoneOrAuthcode]
      this[phoneOrAuthcode] = prevVal.replace(/[^\d]/g, '')
    },
    startTiming() {
      const timer = setInterval(() => {
        this.countDownTime--
        if (this.countDownTime) return
        clearInterval(timer)
        this.authcodeLock = false
        this.countDownTime = 60
      }, 1000)
    },
    showIllgalPhoneNumberNotification() {
      const { error } = this.MULTI_LANG_TEXT
      Message.error({
        title: error.title,
        message: error.phone_error,
      })
    },
    getAuthcode() {
      if (!this.isPhoneNumberValid) return
      this.authcodeLock = true
      this.startTiming()
      fetchAuthcode(this.phone)
        .then(data => Message.info({
          message: data.authcode
        }))
    },
    login() {
      if (!this.isPhoneNumberValid) return
      const { phone, authcode } = this
      fetchLogin({ phone, authcode })
        .then(data => {
          Vue.prototype.$uid = data.uid
          ipcRenderer.send('save-user-data', {
            uid: data.uid,
            lang: REMOTE_STORE.get('lang') || 'zh-CN'
          })
          ipcRenderer.send('login')
        })
        .catch(() => {
          const { error } = this.MULTI_LANG_TEXT
          Message.error({
            title: error.title,
            content: error.login_error
          })
        })
    }
  },
  created() {
    if (!remote.getGlobal('isAllowLogin')) return
    this.$router.push({
      path: '/app/chats'
    })
  }
}
</script>

<style scoped lang="less">
.login {
  width: 100vw;
  height: 100vh;
  background: #393f46;
  -webkit-app-region: drag;
  -webkit-user-select: none;
}
header {
  padding: 35px 0 0 30px;
  color: #bbb;
  font-size: 36px;
  font-family: 'local-Flavors';
}
img {
  display: block;
  margin: 15px auto 35px auto;
  width: 130px;
  height: 90px;
  text-align: center;
}
.form {
  -webkit-app-region: no-drag;
  width: 200px;
  margin: auto;
}
.form > div,
.form > footer {
  display: flex;
  padding: 6px 0 3px;
  border-bottom: 1px solid #666;
  &:last-child {
    border-bottom: none;
  }
  .icon-user,
  .icon-key {
    display: block;
    margin-right: 10px;
    height: 26px;
    text-align: center;
    color: #bbb;
    font-size: 18px;
    &.icon-key {
      font-size: 16px;
    }
    &::before {
      vertical-align: sub;
    }
  }
  input {
    display: block;
    height: 26px;
    background: none;
    font-size: 14px;
    color: #9a9a9a;
    caret-color: #898989;
    letter-spacing: 0.6px;
    border: none;
    outline: none;
    &::-webkit-input-placeholder {
      font-size: 0.9em;
      color: #787878;
    }
    &.input-authcode {
      width: 94px;
    }
  }
  .btn-get-authcode,
  .btn-submit {
    display: block;
    height: 26px;
    font-size: 12px;
    cursor: pointer;
    border: none;
    outline: none;
  }
  .btn-get-authcode {
    width: 80px;
    flex-shrink: 0;
    border-radius: 4px;
  }
}
.disabled {
  color: #898989;
  background: #4c4e52;
  cursor: not-allowed;
}
.not-disabled {
  color: #aaa;
  background: #585b5f;
}
.btn-submit {
  width: 100%;
  margin-top: 0.8em;
  border-radius: 2px;
}
</style>
