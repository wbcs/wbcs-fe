import store from '@/store'
import router from '@/router'

export const openUser = uid => {
  store.commit('NEW_CHAT', { uid })
  router.replace({
    path: '/app/chats',
    query: {
      uid
    }
  })
}
export const openGroup = gid => {
  store.commit('NEW_CHAT', { gid })
  router.replace({
    path: '/app/chats',
    query: {
      gid
    }
  })
}
export const openChat = gidOrUid => {
  if (gidOrUid[0] === 'u') {
    openUser(gidOrUid)
    return
  }
  openGroup(gidOrUid)
}
