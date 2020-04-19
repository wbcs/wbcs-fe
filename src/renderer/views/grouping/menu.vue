<template>
  <div id="menu-contacts">
    <category-item
      v-for="item in categoryArr"
      :key="item.cid"
      :category="item"
    >
    </category-item>
  </div>
</template>

<script>
import { socket } from '@/utils'
import CategoryItem from '@/components/category-item'

export default {
  name: 'menu-contacts',
  components: {
    CategoryItem
  },
  data() {
    return {
      categoryArr: []
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
      return this.$store.state.Contact.currentContact
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
      socket
        .emit('get-category-list', this.$store.state.uid)
        .then(data => {
          this.categoryArr = data
        })
    }
  }
}
</script>
