---
date: 2024-06-30
title: 'Error Handling'
author: Zihyin Hsu
category: frontend
tags:
  - Nuxt3
---

# Error Handling

## 自訂錯誤頁面

在根目錄新增 `error.vue`，我們可以透過名為 `error` 的 props 物件， 來根據需求客製錯誤頁面。

```vue
<script setup>
const props = defineProps(['error']);
</script>

<template>
  <div>
    <h1>Error : {{ error.statusCode }}</h1>
    <p>{{ error.message }}</p>
  </div>
</template>
```

## createError

`createError` 用於建立帶有錯誤訊息的物件，方便統一處理錯誤。

```vue{8-11}
<script setup>
const route = useRoute();
const id = route.params.id;
const { data: product, error } = await useFetch(
  () => `https://fakestoreapi.com/products/${id}`,
);
if (!product.value) {
  throw createError({
    statusCode: 404,
    message: 'Product not found',
  });
}
</script>

<template>
  <div>
    <div>Results:</div>
    {{ product }}
  </div>
</template>
```

## clearError

`clearError` 用於清除錯誤訊息，並可透過 `redirect` 作重新導向。

```vue
<script setup>
const props = defineProps(['error']);

const handleError = () => {
  clearError({
    redirect: '/',
  });
};
</script>

<template>
  <div>
    <h1>Error : {{ error.statusCode }}</h1>
    <p>{{ error.message }}</p>
    <fwb-button color="default" @click="handleError">Home</fwb-button>
  </div>
</template>
```

---

**參考資料：**

1. [Error Handling](https://nuxt.com/docs/getting-started/error-handling)
2. [Nuxt.js 3.x 自訂 Error Page 與錯誤處理](https://clairechang.tw/2023/09/07/nuxt3/nuxt-v3-error-page/)
