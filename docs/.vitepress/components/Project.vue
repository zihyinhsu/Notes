
<script setup>
import { ref } from 'vue'
const count = ref(1)
</script>
// 參考用：https://johnnywang1994.github.io/book/project.html
<template>
  <div>
    <h1>作品集</h1>
     <div class="flex items-center justify-center h-screen bg-gray-200">
    <button @click="count++" class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
      點我 {{ count }} 次
    </button>
  </div>
  </div>
</template>
