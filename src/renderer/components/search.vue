<template>
  <div id="search-bar">
    <div class="content">
      <input
        type="text"
        v-model="keyword"
        :placeholder="placeholder"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="handleEnter"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'search',
  data() {
    return {
      keyword: '',
      placeholder: ''
    }
  },
  created() {
    this.handleBlur()
  },
  methods: {
    handleFocus() {
      this.placeholder = ''
    },
    handleBlur() {
      this.placeholder = this.$store.state.MULTI_LANG_TEXT.sidebar.search
    },
    handleEnter() {
      console.log('searching...')
    }
  }
}
</script>

<style scoped lang="less">
#search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.7em 0;
  -webkit-app-region: drag;
}
.content,
input {
  transition: all 0.3s;
}

.content {
  width: 90%;
  height: 100%;
  border-radius: 100px;
  border: 1px solid #dee0e3;
  -webkit-app-region: no-drag;
  &:hover {
    border: 1px solid #3e74f6;
    input::placeholder {
      color: #3e74f6;
    }
  }
}

input {
  display: block;
  padding-left: 15px;
  width: 100%;
  height: 30px;
  border: none;
  outline: none;
  background: none;
  font-size: 12px;
  color: #666;
  &::placeholder {
    color: #797979;
    font-family: 'icomoon';
  }
}
</style>
