<template>
  <div class="menu-bar">
    <div class="avatar">
      <img :src="userInfo.avatar" />
    </div>
    <div class="menu">
      <router-link
        tag="span"
        to="/app/chats?"
        exact-active-class="active"
        class="icon-commenting"
      />
    </div>
    <div class="menu">
      <router-link
        tag="span"
        to="/app/contacts"
        exact-active-class="active"
        class="icon-address-book"
      />
    </div>
    <div class="menu">
      <router-link
        tag="span"
        to="/app/functions"
        exact-active-class="active"
        class="icon-th-large2"
      />
    </div>
    <div class="menu last-menu">
      <router-link
        tag="span"
        to="/app/settings"
        exact-active-class="active"
        class="icon-cog"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'menu-bar',
  computed: {
    userInfo() {
      const { main } = this.$store.state
      return main.userInfo
    }
  }
}
</script>

<style scoped lang="less">
.menu-bar {
  position: relative;
  width: 65px;
  background: rgba(255, 255, 255, 0.8);
  -webkit-app-region: drag;
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    filter: blur(50px);
    background: rgb(0, 0, 0);
  }
}
.avatar {
  width: 40px;
  height: 40px;
  margin: 30px auto 20px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;

    &:hover {
      filter: brightness(1.2);
    }
  }
}
.menu {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #9298a8;
  cursor: pointer;

  span {
    transition: all 0.3s;
    height: 100%;
    width: 100%;
    padding: 0.6em 0;
    text-align: center;
  }
  :hover {
    color: #fff;
  }
  .active {
    background: #4277f6;
  }
  .active,
  .router-link-active {
    color: #fff;
  }
}
.last-menu {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  margin-bottom: 20px;
}
</style>
