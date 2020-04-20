<template>
  <div id="menu-functions">
    <function-item
      v-for="item in menuArr"
      :key="item.id"
      :config="item"
      :isActive="activatedId === item.id"
      @active-item="setActiveId"
    ></function-item>
  </div>
</template>

<script>
import FunctionItem from '@/components/function-item'

export default {
  name: 'menu-functions',
  components: {
    FunctionItem
  },
  data() {
    return {
      activatedId: 1,
      menuArr: []
    }
  },
  created() {
    this.menuArr.push(
      {
        id: 1,
        flag: 'AddNewContact',
        icon: 'user-plus',
        title: this.$store.MULTI_LANG_TEXT.functions.add_contact.main_title
      },
      {
        id: 2,
        flag: 'CreateGroup',
        icon: 'plus',
        title: this.$store.MULTI_LANG_TEXT.functions.create_group.main_title
      },
      {
        id: 3,
        flag: 'ManageCategory',
        icon: 'list-ul',
        title: this.$store.MULTI_LANG_TEXT.functions.manage_category.main_title
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
