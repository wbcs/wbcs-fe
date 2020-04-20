<template>
  <keep-alive>
    <component :is="currentComponent" />
  </keep-alive>
</template>

<script>
import AddNewContact from './parts/add-new-contact'
import CreateGroup from './parts/create-group'
import ManageCategory from './parts/manage-category'

export default {
  name: 'content-functions',
  components: {
    AddNewContact,
    CreateGroup,
    ManageCategory
  },
  data() {
    return {
      currentComponent: 'AddNewContact'
    }
  },
  computed: {
    currentFunction() {
      return this.$store.state.Function.currentFunction
    }
  },
  watch: {
    currentFunction() {
      if (!['AddNewContact', 'CreateGroup', 'ManageCategory'].includes(this.currentFunction)) return
      this.currentComponent = this.currentFunction
    }
  }
}
</script>

<style lang="less"></style>
