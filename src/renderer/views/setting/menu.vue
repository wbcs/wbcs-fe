<template>
  <div id="menu-settings">
    <FunctionItem
      v-for="item in menuList"
      :key="item.id"
      :config="item"
      :isActive="activatedId === item.id"
      @active-item="setActiveId"
    />
  </div>
</template>

<script>
import FunctionItem from '@/components/function-item'

export default {
  name: 'menu-settings',
  components: {
    FunctionItem
  },
  data() {
    return {
      activatedId: 1,
      menuList: []
    }
  },
  created() {
    this.menuList.push(
      {
        id: 1,
        flag: 'ProfileSetting',
        icon: 'drivers-license-o',
        title: this.$store.state.MULTI_LANG_TEXT.settings
          .user_profile_setting.main_title
      },
      {
        id: 2,
        flag: 'SoftwareSetting',
        icon: 'cogs',
        title: this.$store.state.MULTI_LANG_TEXT.settings.software_setting
          .main_title
      },
      {
        id: 3,
        flag: 'SystemMessage',
        icon: 'info',
        title: this.$store.state.MULTI_LANG_TEXT.settings.system_message
          .main_title
      }
    )
  },
  methods: {
    setActiveId(id) {
      this.activatedId = id
    }
  }
}
</script>
