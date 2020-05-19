<template>
  <div
    class="contact-item"
    :class="{ active: isActive }"
    @click="activeFunc"
    @dblclick="$emit('dblclick', data)"
  >
    <div class="avatar">
      <img :src="data.avatar || __DEFAULT_AVATAR__" alt="avatar" />
    </div>

    <div v-if="isGroup" class="detail">
      <div class="name">
        <span class="icon icon-users"></span>{{ data.nickname }}
      </div>
    </div>

    <div v-else class="detail">
      <div class="name">
        {{ data.alias || data.nickname || data[_idName] }}
      </div>
      <div class="self-signature">
        {{ data.signature }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'contact-item',
  props: {
    data: {
      required: true,
      type: Object
    },
    isGroup: {
      required: true
    },
    isActive: {
      required: true
    },
    dblclick: Function
  },
  data() {
    this.__DEFAULT_AVATAR__ = `http://localhost:3000/upload/default/default-group-avatar.png`
    return {}
  },
  computed: {
    _idName() {
      return this.isGroup ? 'gid' : 'uid'
    }
  },
  methods: {
    activeFunc() {
      this.$emit('active-item', this.data[this._idName])
      this.$store.commit('grouping/setCurrentContact', {
        id: this.data[this._idName],
        isGroup: this.isGroup,
        isDefaultPage: false
      })
    }
  }
}
</script>

<style scoped lang="less">
.contact-item {
  position: relative;
  display: flex;
  align-items: center;
  height: 50px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #dee0e3;
  }

  &.active {
    background: #eff0f1;
    &::before {
      content: '';
      top: 0;
      left: 0;
      position: absolute;
      height: 100%;
      width: 3px;
      background: #3e74f6;
    }
  }
}
.avatar {
  width: 30px;
  height: 30px;
  margin: 0 10px 0 15px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.detail {
  width: 145px;
  font-size: 12px;
  color: #666;

  .name,
  .self-signature {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .name {
    .icon {
      margin-right: 4px;
      font-size: 10px;
    }
  }

  .self-signature {
    font-size: 10px;
    color: #999;
    letter-spacing: 0.07px;
  }
}
</style>
