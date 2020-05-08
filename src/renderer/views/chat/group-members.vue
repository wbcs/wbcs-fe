<template>
  <section class="group-members" @click.stop>
    <header>
      <span class="title">
        <span>{{ groupMember }}</span>
        <span>[{{ memberList.length }}]</span>
      </span>
      <i class="icon icon-close" @click.stop="handleCloseIconClick" />
    </header>
    <div class="sidebar-content">
      <GroupMemberItem
        v-for="member in memberList"
        :key="member.uid"
        :data="member"
      />
    </div>
  </section>
</template>

<script>
import GroupMemberItem from '@/components/group-member-item'

export default {
  name: 'group-members',
  props: ['memberList'],
  components: {
    GroupMemberItem
  },
  computed: {
    groupMember() {
      const { state } = this.$store
      return state.MULTI_LANG_TEXT.chat.groupMember
    }
  },
  methods: {
    handleCloseIconClick() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.group-members {
  position: absolute;
  top: 0;
  right: 0;
  transform: translateX(100%);
  width: 240px;
  height: 100%;
  background: #ffffff;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.5);
  transition: 0.2s;
  &.show-group-sidebar {
    transform: initial;
  }
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.88em;
  border-bottom: 1px solid #dddddd;
}
.title {
  color: #666666;
  :last-child {
    font-size: 0.8em;
  }
}
.icon-close {
  color: #999999;
  cursor: pointer;
}
.sidebar-content {
  overflow: auto;
}
</style>
