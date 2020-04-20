<template>
  <keep-alive>
    <component :is="currentComponent" :id="currentContact.id"></component>
  </keep-alive>
</template>

<script>
import DefaultPage from '@/components/default-page'
import FriendInfo from './friend-info'
import GroupInfo from './group-info'

export default {
  name: 'contact-info',
  components: {
    DefaultPage,
    FriendInfo,
    GroupInfo
  },
  data() {
    return {
      currentComponent: 'DefaultPage'
    }
  },
  computed: {
    currentContact() {
      return this.$store.state.grouping.currentContact
    }
  },
  watch: {
    currentContact() {
      if (this.currentContact.isDefaultPage) {
        this.currentComponent = 'DefaultPage'
        return
      }

      this.currentComponent = this.currentContact.isGroup
        ? 'GroupInfo'
        : 'FriendInfo'
    }
  }
}
</script>

<style lang="less"></style>
