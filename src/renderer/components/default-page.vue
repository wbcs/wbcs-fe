<template>
  <div class="default-page">
    <img src="../assets/background.png" alt="background" />
  </div>
</template>

<script>
export default {
  name: 'default-page',
  data() {
    return {}
  },
  methods: {
    chatFunc(e) {
      console.log(e)
    }
  }
}
</script>

<style lang="less">
.default-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  -webkit-app-region: drag;
  -webkit-user-select: none;

  img {
    width: 50%;
    opacity: 0.8;
  }
}
</style>
