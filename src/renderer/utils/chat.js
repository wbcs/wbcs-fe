import store from '@/store'
import router from '@/router'

export const openChat = id => {
  store.commit('chat/newChat', { id })
  router.push({
    path: `/app/chats/${id}`
  })
}
