<template>
  <div class="friend-info">
    <div class="info-head">
      <div class="avatar">
        <img :src="friendInfo.avatar" alt="avatar" />
      </div>
      <div class="name">
        {{ friendInfo.nickname || friendInfo.uid }}
      </div>

      <div class="self-signature">
        {{ friendInfo.signature }}
      </div>
    </div>

    <div class="info-details">
      <div class="detail-item" v-for="item in titleArr" :key="item">
        <div class="item-title">{{ infoTitles[item] }}</div>
        <div class="item-content">
          <input
            type="text"
            v-if="item === 'alias'"
            v-model="friendInfo.alias"
            :disabled="locks.alias"
            @blur="handleAliasBlur"
          />
          <span v-else :class="{ 'default-content': !friendInfo[item] }">{{
            friendInfo[item] ? friendInfo[item] : defaultInfoContent
          }}</span>
          <span v-if="item === 'alias'" class="icon icon-edit" @click="handleEditClick" />
        </div>
      </div>
    </div>

    <div class="info-foot">
      <span class="icon icon-commenting" @click="readyToChat"/>
      <span class="icon icon-delete" @click="deleteFriend"/>
    </div>
  </div>
</template>

<script>
import { SOCKET } from '@/request'

export default {
  name: 'friend-info',
  props: {
    id: {
      required: true
    }
  },
  data() {
    return {
      titleArr: [
        'alias',
        'phone',
        'gender',
        'age',
        'email',
        'birthTime',
        'address',
        'selfIntro'
      ],
      friendInfo: {},
      locks: {
        alias: true,
      }
    }
  },
  computed: {
    infoTitles() {
      return this.$store.state.MULTI_LANG_TEXT.contacts.friend_info_titles
    },
    defaultInfoContent() {
      return this.$store.state.MULTI_LANG_TEXT.contacts.info_content
        .default
    }
  },
  watch: {
    id() {
      this.getFriendInfo()
    }
  },
  created() {
    this.getFriendInfo()
  },
  activated() {
    this.getFriendInfo()
  },
  methods: {
    handleEditClick() {
      this.locks.alias = false
    },
    handleAliasBlur() {
      if (this.copyFriendInfo.alias === this.friendInfo.alias) {
        return
      }
      this.locks.alias = true
      this.copyFriendInfo.alias = this.friendInfo.alias
      SOCKET.emit('UPDATE_ALIAS', {
          uid: this.$store.state.uid,
          friendUid: this.id,
          alias: this.friendInfo.alias
      })
    },
    getFriendInfo() {
      SOCKET.emit(
        'get-friend-info',
        {
          uid: this.$store.state.uid,
          friendUid: this.id
        },
        data => {
          this.friendInfo = data
          this.copyFriendInfo = { ...data }
        }
      )
    },
    readyToChat() {
      const id = this.friendInfo.uid
      this.$store.commit('chat/newChat', { id })
      this.$router.push({
        path: `/app/chats/${id}`
      })
    },
    deleteFriend() {
      SOCKET.emit(
        'DELETE_FRIEND',
        {
          uid: this.$store.state.uid,
          friendUid: this.id
        },
        data => {
          if (data.code === 0) {
            this.$store.commit('grouping/setCurrentContact', {
              isDefaultPage: true
            })
          }
          alert(data.message)
        }
      )
    }
  }
}
</script>

<style lang="less">
.friend-info {
  position: relative;

  .info-head {
    position: relative;
    width: 100%;
    height: 173px;
    background: #414952;
    overflow: hidden;
    background-image: url('../../assets/smell.png');
    background-size: 50%;
    background-position: 30% 50%;
    -webkit-app-region: drag;

    & > div {
      position: absolute;
      z-index: 3;
    }
    .avatar,
    .name {
      -webkit-app-region: none;
    }

    .avatar {
      left: 120px;
      top: 30px;
      width: 100px;
      height: 100px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .name {
      left: 250px;
      top: 45px;
      font-size: 24px;
      color: #ddd;
      letter-spacing: 0.17px;
      word-break: break-all;
    }

    .self-signature {
      left: 250px;
      top: 85px;
      width: 310px;
      font-size: 12px;
      color: #bbb;
      letter-spacing: 0.09px;
      line-height: 1.5;
      word-break: break-all;
    }

    .info-background {
      bottom: 0;
      z-index: 2;
      display: block;
      width: 100%;
      height: 67px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .info-details {
    width: 100%;
    height: 300px;
    overflow-y: auto;
    margin: 30px 0 10px;
    padding: 0 20px;

    .detail-item {
      display: flex;
      margin-bottom: 5px;
      font-size: 12px;
      color: #666666;
      letter-spacing: 0.17px;

      .item-title {
        flex-shrink: 0;
        width: 60px;
        font-weight: bold;
      }

      .item-content {
        width: 485px;
        word-break: break-all;

        .default-content {
          color: #dfdcdc;
        }

        .icon {
          margin-left: 10px;
          color: #a7b0bb;
          font-size: 14px;
          cursor: pointer;
          transition: 0.2s;

          &:hover {
            color: #686868;
          }
        }
      }
    }
  }

  .info-foot {
    position: absolute;
    bottom: 0;
    z-index: 2;
    width: 100%;
    height: 45px;

    .icon {
      position: absolute;
      bottom: 10px;
      z-index: 3;
      display: block;
      width: 24px;
      height: 24px;

      text-align: center;
      font-size: 20px;
      color: #a7b0bb;
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        color: #686868;
      }
    }

    .icon-commenting {
      right: 54px;
    }

    .icon-delete {
      font-size: 22px;
      right: 20px;
    }
  }
}
input:disabled {
  cursor: not-allowed;
}
</style>
