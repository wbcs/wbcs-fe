<template>
  <keep-alive>
    <component :is="currentComponent" />
  </keep-alive>
</template>

<script>
import ProfileSetting from './profile-setting'
import SoftwareSetting from './software-setting'
import SystemMessage from './system-message'

export default {
  name: 'content-settings',
  components: {
    ProfileSetting,
    SoftwareSetting,
    SystemMessage
  },
  data() {
    return {
      currentComponent: 'ProfileSetting'
    }
  },
  computed: {
    currentFunction() {
      return this.$store.state.functions.currentFunction
    }
  },
  watch: {
    currentFunction() {
      const whiteList = ['ProfileSetting', 'SoftwareSetting', 'SystemMessage']
      if (!whiteList.includes(this.currentFunction)) return
      this.currentComponent = this.currentFunction
    }
  }
}
</script>
