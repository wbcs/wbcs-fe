<template>
  <div class="group-member-item">
    <div class="avatar">
      <img :src="data.avatar" alt="avatar" />
    </div>

    <div class="name">
      {{ data.alias || data.nickname || data.uid }}
    </div>

    <div v-if="data.flag" class="tag">{{ data.flag }}</div>
  </div>
</template>

<script>
export default {
  name: 'group-member-item',
  props: {
    data: {
      required: true,
      type: Object
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="less">
.group-member-item {
  border: 1px solid red;
  position: relative;
  display: inline-block;
  width: 230px;
  height: 34px;
  margin-bottom: 10px;
  background: #fff;
  border-radius: 4px;
  font-size: 12px;
  color: #666666;

  &:hover {
    background: #ebebeb;
  }

  &:nth-child(odd) {
    margin-right: 15px;
  }

  .avatar {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin: 5px 10px 5px 5px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .name {
    display: inline-block;
    height: 34px;

    vertical-align: top;
  }

  .tag {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 5px;
    height: 10px;
    margin: auto;
    padding: 1px 4px;
    background: #525c68;
    border-radius: 4px;
    font-size: 6px;
    color: #cfcfcf;
    letter-spacing: 0.03px;
  }
}
</style>
