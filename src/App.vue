<template>
  <div id="app">
    <div class="wrapper">
      <Chat />
    </div>
  </div>
</template>

<script>
import Chat from '@/components/Chat.vue'
export default {
  name: 'App',
  components: {
    Chat
  },
}
</script>

<style>
@import url('@/main.css');

.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
