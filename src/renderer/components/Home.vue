<template>
  <div class="home">
    <AppHeader></AppHeader>
  </div>
</template>

<script>
  import { Button } from 'view-design'
  export default {
    name: 'Home',
    components: {
      Button,
      AppHeader: () => import('./parts/AppHeader')
    }
  }
</script>

<style scoped>
</style>