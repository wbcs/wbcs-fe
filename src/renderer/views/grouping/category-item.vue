<template>
  <div class="category-item" @click="setCurrentCategoryId">
    <div class="category-title" @click="toggleContacts">
      <span
        v-show="!isShowContacts"
        class="icon icon-keyboard_arrow_right"
      />
      <span
        v-show="isShowContacts"
        class="icon icon-keyboard_arrow_down"
      />

      <span v-if="isGroupCategory">{{
        $store.state.MULTI_LANG_TEXT.contacts.category.my_groups
      }}</span>
      <span v-else-if="isDefaultCategory">{{
        $store.state.MULTI_LANG_TEXT.contacts.category.default_category
      }}</span>
      <span v-else>{{ category.alias }}</span>
    </div>

    <div v-show="isShowContacts" class="category-contacts">
      <grouping-item
        v-for="item in category[isGroupCategory ? 'groups' : 'friends']"
        :key="item[_idName]"
        :data="item"
        :isGroup="isGroupCategory"
        :isActive="
          activatedId === item[_idName] &&
            currentCategoryId === category.cid
        "
        @active-item="setActiveId"
        @dblclick="handleGroupingItemDBClick"
      />
    </div>
  </div>
</template>

<script>
import GroupingItem from './grouping-item'

export default {
  name: 'category-item',
  components: {
    GroupingItem: GroupingItem
  },
  props: {
    category: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      activatedId: null,
      isShowContacts: false
    }
  },
  computed: {
    currentCategoryId() {
      return this.$store.state.grouping.currentCategoryId
    },
    isGroupCategory() {
      return this.category.cid === 0
    },
    isDefaultCategory() {
      return this.category.cid === 1
    },
    _idName() {
      return this.isGroupCategory ? 'gid' : 'uid'
    }
  },
  watch: {
    currentCategoryId() {
      if (this.currentCategoryId !== this.category.cid) {
        this.activatedId = null
      }
    }
  },
  methods: {
    setActiveId(id) {
      this.activatedId = id
    },
    setCurrentCategoryId() {
      this.$store.commit(
        'grouping/setCurrentCategoryID',
        this.category.cid
      )
    },
    toggleContacts() {
      this.isShowContacts = this.isShowContacts ? false : true
    },
    handleGroupingItemDBClick(userOrGroupInfo) {
      const keyOfGidOrUid = userOrGroupInfo.uid ? 'uid' : 'gid'
      const id = userOrGroupInfo[keyOfGidOrUid]
      this.$store.commit('chat/newChat', { id })
      this.$router.push({
        path: `/app/chats/${id}`
      })
    }
  }
}
</script>

<style scoped lang="less">
.category-title {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 6px 15px;
  font-size: 12px;
  color: #666;
  cursor: pointer;

  &:hover {
    background: #dee0e3;
  }

  .icon {
    margin-right: 10px;
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
