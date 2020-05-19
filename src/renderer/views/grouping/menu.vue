<template>
  <div id="menu-contacts">
    <category-item
      v-for="item in categoryList"
      :key="item.cid"
      :category="item"
    />
  </div>
</template>

<script>
import { SOCKET } from '@/request'
import CategoryItem from './category-item'

export default {
  name: 'menu-contacts',
  components: {
    CategoryItem
  },
  data() {
    return {
      categoryList: []
    }
  },
  created() {
    this.init()
  },
  activated() {
    this.init()
  },
  computed: {
    currentContact() {
      return this.$store.state.grouping.currentContact
    }
  },
  watch: {
    currentContact: {
      deep: true,
      handler() {
        this.getCategoryList()
      }
    }
  },
  methods: {
    init() {
      this.getCategoryList()
    },
    getCategoryList() {
      SOCKET.emit('GET_CATEGORY_LIST', this.$store.state.uid, data => {
        this.categoryList = data
      })
    }
  }
}
</script>
