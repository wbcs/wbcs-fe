<template>
  <div class="profile-setting">
    <div class="head">{{ contentTitle }}</div>

    <div class="profile-form">
      <div class="form-item-avatar">
        <div class="img">
          <img :src="avatar" />
        </div>
        <div class="input">
          <label for="avatar-input">{{
            $store.state.MULTI_LANG_TEXT.form.changeAvatar
          }}</label>
          <input
            id="avatar-input"
            ref="avatarInput"
            type="file"
            accept="image/*"
            @change="updateUserAvatar"
          />
        </div>
      </div>

      <div class="form-item">
        <div class="label">
          {{
            $store.state.MULTI_LANG_TEXT.contacts.friend_info_titles
              .nickname
          }}
        </div>
        <div class="label-form">
          <input type="text" v-model="userInfo.nickname" />
        </div>
      </div>
      <div class="form-item">
        <div class="label">
          {{
            $store.state.MULTI_LANG_TEXT.contacts.friend_info_titles
              .signature
          }}
        </div>
        <div class="label-form">
          <input type="text" v-model="userInfo.signature" />
        </div>
      </div>
      <div class="form-item">
        <div class="label">
          {{
            $store.state.MULTI_LANG_TEXT.contacts.friend_info_titles.phone
          }}
        </div>
        <div class="label-form">
          <input type="text" disabled v-model="userInfo.phone" />
        </div>
      </div>
      <div class="form-item">
        <div class="label">
          {{
            $store.state.MULTI_LANG_TEXT.contacts.friend_info_titles.gender
          }}
        </div>
        <div class="label-form">
          <div>
            <input
              type="radio"
              v-model="userInfo.gender"
              id="gender-man"
              :value="gender.man"
            />
            <label for="gender-man">{{ gender.man }}</label>
          </div>
          <div>
            <input
              type="radio"
              v-model="userInfo.gender"
              id="gender-woman"
              :value="gender.woman"
            />
            <label for="gender-woman">{{ gender.woman }}</label>
          </div>
        </div>
      </div>
      <div class="form-item">
        <div class="label">
          {{
            $store.state.MULTI_LANG_TEXT.contacts.friend_info_titles.age
          }}
        </div>
        <div class="label-form">
          <input class="age-input" type="text" v-model="userInfo.age" />
        </div>
      </div>
      <div class="form-item">
        <div class="label">
          {{
            $store.state.MULTI_LANG_TEXT.contacts.friend_info_titles.email
          }}
        </div>
        <div class="label-form">
          <input type="text" v-model="userInfo.email" />
        </div>
      </div>
      <div class="form-item">
        <div class="label">
          {{
            $store.state.MULTI_LANG_TEXT.contacts.friend_info_titles
              .birthTime
          }}
        </div>
        <div class="label-form">
          <input type="text" v-model="userInfo.birthTime" />
        </div>
      </div>
      <div class="form-item">
        <div class="label">
          {{
            $store.state.MULTI_LANG_TEXT.contacts.friend_info_titles
              .address
          }}
        </div>
        <div class="label-form">
          <input type="text" v-model="userInfo.address" />
        </div>
      </div>
      <div class="form-item">
        <div class="label">
          {{
            $store.state.MULTI_LANG_TEXT.contacts.friend_info_titles
              .selfIntro
          }}
        </div>
        <div class="label-form">
          <textarea v-model="userInfo.selfIntro" maxlength="150">
          </textarea>
        </div>
      </div>
      <div class="form-item form-item-save">
        <div class="label"></div>
        <div class="label-form">
          <button @click="updateUserInfo">
            {{ $store.state.MULTI_LANG_TEXT.form.save }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SOCKET } from '@/request'

export default {
  name: 'profile-setting',
  data() {
    return {
      avatar: '',
      userInfo: {
        nickname: '',
        signature: '',
        phone: '',
        gender: '',
        age: '',
        email: '',
        birthTime: '',
        address: '',
        selfIntro: ''
      }
    }
  },
  computed: {
    contentTitle() {
      return this.$store.state.MULTI_LANG_TEXT.settings
        .user_profile_setting.main_title
    },
    gender() {
      return this.$store.state.MULTI_LANG_TEXT.form.gender
    }
  },
  created() {
    this.getUserInfo()
  },
  activated() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      SOCKET.emit('get-user-info', this.$store.state.uid, data => {
        this.avatar = data.avatar
        this.userInfo = {
          ...this.userInfo,
          ...data
        }
        this.$store.commit('main/setUserInformation', data)
      })
    },
    updateUserInfo() {
      SOCKET.emit(
        'update-user-info',
        {
          uid: this.$store.state.uid,
          userInfo: this.userInfo
        },
        data => {
          alert(data.message)
        }
      )
    },
    updateUserAvatar() {
      const input = this.$refs.avatarInput

      if (input && input.files.length) {
        const file = input.files[0]

        if (file.size > 500 * 1024) {
          alert(this.$store.state.MULTI_LANG_TEXT.error.imageMaxSize)
          return
        }

        // convert binary file to base64 string
        const reader = new FileReader()
        const that = this

        reader.onload = function() {
          const base64Data = this.result

          SOCKET.emit(
            'update-user-avatar',
            {
              uid: that.$store.state.uid,
              base64Data
            },
            data => {
              that.getUserInfo()
              alert(data.message)
            }
          )
        }

        reader.readAsDataURL(file)
      }
    }
  }
}
</script>

<style lang="less">
.profile-setting {
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

  .profile-form {
    position: relative;
    padding: 24px 20px;
  }

  .form-item-avatar {
    position: absolute;
    top: 25px;
    right: 30px;
    z-index: 2;

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
      label {
        display: block;
        width: 100px;
        margin-top: 15px;
        border: 1px solid #cdcdcd;
        border-radius: 5px;
        color: #898989;
        font-size: 12px;
        font-weight: 400;
        text-align: center;
        cursor: pointer;

        &:hover {
          color: #666;
        }
      }

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

  input,
  textarea {
    color: #686868;
  }

  .form-item {
    display: flex;
    min-height: 26px;
    line-height: 26px;
    margin-bottom: 10px;

    .label {
      width: 50px;
      margin-right: 14px;
      font-size: 12px;
      font-weight: bolder;
      color: #666666;
      letter-spacing: 0.17px;
    }

    .label-form {
      display: flex;

      input[type='text'] {
        display: block;
        width: 240px;
        height: 26px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        padding: 0 8px;
        background: none;
        letter-spacing: 0.7px;

        &:disabled {
          background: #f4f4f4;
          cursor: not-allowed;
        }

        &:focus {
          outline: none;
          border-color: #a2a3a4;
          background: #fff;
        }

        &.age-input {
          width: 50px;
        }
      }

      input[type='radio'] {
        & + label {
          margin-right: 20px;
          font-size: 14px;
          color: #666666;
          letter-spacing: 0;
          line-height: 14px;
        }
      }

      label {
        font-size: 12px;
      }

      textarea {
        display: block;
        width: 480px;
        height: 76px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        padding: 6px 8px;
        background: none;
        resize: none;
        overflow: auto;

        &:focus {
          outline: none;
          border-color: #a2a3a4;
          background: #fff;
        }
      }
    }
  }

  .form-item-save {
    margin-top: 15px;

    button {
      padding: 5px 14px;
      background: #898989;
      border-radius: 4px;
      border: none;
      font-size: 12px;
      color: #ffffff;
      cursor: pointer;

      &:focus {
        outline: none;
      }
    }
  }
}
</style>
