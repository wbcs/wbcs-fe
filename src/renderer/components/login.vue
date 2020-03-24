<template>
  <section id="login">
    <header class="login-title">wbcs!</header>
    <img class="logo-img" src="../assets/logo.png" alt="logo" />
    <div class="login-form">
      <div>
        <i class="icon-user" />
        <input
          type="text"
          class="input-phone"
          maxlength="11"
          autocomplete="off"
          autofocus
          v-model="phone"
          :placeholder="$lang.login.phone_hint"
          @input="onlyNumber('phone')"
        />
      </div>
      <div>
        <i class="icon-key" />
        <input
          type="text"
          class="input-authcode"
          maxlength="6"
          autocomplete="off"
          v-model="authcode"
          :placeholder="$lang.login.authcode_hint"
          @input="onlyNumber('authcode')"
          @keydown.enter="loginFunc"
        />
        <button
          class="btn-get-authcode"
          :disabled="isAlreadyGetAuthcode"
          :class="isAlreadyGetAuthcode ? 'disabled' : 'not-disabled'"
        >
          <span v-if="!isAlreadyGetAuthcode" @click="getAuthcode">
            {{ $lang.login.authcode_button }}
          </span>
          <span v-if="isAlreadyGetAuthcode">{{ countDownTime }} s</span>
        </button>
      </div>
      <div>
        <button
          class="btn-submit"
          :disabled="!isFormFinished"
          :class="isFormFinished ? 'not-disabled' : 'disabled'"
          @click="loginFunc"
        >
          {{ $lang.login.submit_button }}
        </button>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'login',
  data() {
    return {
      phone: '',
      authcode: '',
      isAlreadyGetAuthcode: false,
      countDownTime: 60
    }
  },
  computed: {
    isFormFinished() {
      return this.phone.length === 11 && this.authcode.length === 6
    }
  },
  methods: {
    onlyNumber(value) {
      this[value] = this[value].replace(/[^\d]/g, '')
    },
    // count down
    startCountDown() {
      let timer = setInterval(() => {
        this.countDownTime--
        if (this.countDownTime === 0) {
          clearInterval(timer)
          this.isAlreadyGetAuthcode = false
          this.countDownTime = 60
        }
      }, 1000)
    },
    // check the validity of phone number
    isPhoneNumberValid() {
      // match Chinese phone number
      let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
      if (!reg.test(this.phone)) {
        this.$electron.ipcRenderer.send('show-error-dialog', {
          title: this.$lang.login.error.title,
          content: this.$lang.login.error.phone_error
        })
        return false
      }
      return true
    },
    getAuthcode() {
      if (this.isPhoneNumberValid()) {
        this.isAlreadyGetAuthcode = true
        this.startCountDown()
        this.requestAuthcode()
      }
    },
    requestAuthcode() {
      this.$socket.emit('get-authcode', this.phone, data => {
        // alert(JSON.stringify(data));
        alert(data.authcode)
      })
    },
    loginFunc() {
      if (this.isPhoneNumberValid()) {
        this.requestLogin()
      }
    },
    requestLogin() {
      this.$socket.emit(
        'login',
        {
          phone: this.phone,
          authcode: this.authcode
        },
        data => {
          if (data.isAllowLogin) {
            // reset this.$uid to actual uid
            Object.getPrototypeOf(this).$uid = data.uid
            this.$electron.ipcRenderer.send('save-user-data', {
              uid: data.uid,
              lang: this.$electronStore.get('lang') || 'zh-CN'
            })
            this.$electron.ipcRenderer.send('login')
          } else {
            this.$electron.ipcRenderer.send('show-error-dialog', {
              title: this.$lang.login.error.title,
              content: this.$lang.login.error.login_error
            })
          }
        }
      )
    }
  },
  created() {
    const isAllowLogin = this.$electron.remote.getGlobal('isAllowLogin')
    if (!isAllowLogin) {
      return
    }
    this.$router.push({
      path: '/app/chats'
    })
  }
}
</script>
<style scoped lang="less">
#login {
  width: 100vw;
  height: 100vh;
  background: #393f46;
  -webkit-app-region: drag;
  -webkit-user-select: none;
}
.login-title {
  padding: 35px 0 0 30px;
  color: #bbb;
  font-size: 36px;
  font-family: 'local-Flavors';
}
.logo-img {
  display: block;
  margin: 15px 75px 35px;
  width: 130px;
  height: 90px;
  text-align: center;
}
.login-form {
  -webkit-app-region: no-drag;
  width: 200px;
  margin: auto;
}
.login-form > div {
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
