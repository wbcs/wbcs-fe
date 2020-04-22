<template>
  <div
    class="function-item"
    :class="{ active: isActive }"
    @click="activeFunc"
  >
    <span :class="`icon icon-${config.icon}`"></span>
    <span>{{ config.title }}</span>
  </div>
</template>

<script>
export default {
  name: 'function-item',
  props: {
    config: {
      required: true,
      type: Object,
      default: {
        icon: 'users',
        title: 'Title'
      }
    },
    isActive: {
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    activeFunc() {
      this.$emit('active-item', this.config.id)
      this.$store.commit('functions/setCurrentFunction', this.config.flag)
    }
  }
}
</script>

<style scoped lang="less">
.function-item {
  position: relative;
  display: flex;
  align-items: center;
  height: 50px;
  font-size: 12px;
  cursor: pointer;
  transition: 0.3s;
  color: #666;

  .icon {
    display: block;
    width: 12px;
    text-align: center;
    margin: 7px 10px 7px 16px;
  }
}
.function-item.active {
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
  .icon {
    color: #3e74f6;
  }
}
.function-item:hover {
  background: #dee0e3;
}
</style>
