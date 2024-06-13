
<script setup>
import { ref } from 'vue'
const count = ref(1)
</script>

// 內文撐開頁面後就不會抖動了
<template>
  <div>
    <h1>作品集 {{ count }}</h1>
  </div>
</template>
