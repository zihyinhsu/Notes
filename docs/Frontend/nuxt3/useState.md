---
date: 2024-06-28
title: 'useState'
author: Zihyin Hsu
category: frontend
tags:
  - Nuxt3
---

# useState

`useState` 用於在元件間共享響應式狀態，實現全域的狀態管理。

### 基本用法

`useState` 的參數分別為：

1. **key** : 用於識別該函數，須為唯一值。
2. **function** : 用於定義初始值。

::: code-group

```vue [index.vue]{2}
<script setup>
const counter = useState('counterState', () => 1);
</script>

<template>
  <div>
    {{ counter }}
    <fwb-button color="default" @click="counter++">Increment</fwb-button>
  </div>
</template>
```

```vue [about.vue]{2}
<script setup>
const counter = useState('counterState', () => 1);
</script>
<template>
  <div>
    {{ counter }}
  </div>
</template>
```

:::

### 放在 composables 做全域狀態管理

我們可以將狀態管理的檔案放在 composables 資料夾內做管理與**設定預設值**，composables 內的檔案都支援 auto-import。

```js
// composables/state.js
export const useCounter = () => {
  return useState('counter', () => 1);
};
```

::: code-group

```vue [index.vue]{2}
<script setup>
const counter = useCounter();
</script>

<template>
  <div>
    {{ counter }}
    <fwb-button color="default" @click="counter++">Increment</fwb-button>
  </div>
</template>
```

```vue [about.vue]{2}
<script setup>
const counter = useCounter();
</script>
<template>
  <div>
    {{ counter }}
  </div>
</template>
```

:::

## useState 和 pinia 的差異

`useState` 通常用於較小的、局部的狀態管理，或者是跨組件共享簡單的狀態，不具備複雜的狀態管理功能（如模塊化、中間件、插件等）。

`pinia` 除了是官方推薦的狀態管理套件，也主要用於較爲複雜的大型應用，提供了豐富的狀態管理功能（如模塊化、中間件、插件等）。

## shallowRef

`useState` 中的 `shallowRef` 主要用於當我們創建的引用 **不需要深度監聽** 時。當引用指向的對象變化頻繁或內含的資料量很大時，可以有效提升性能，避免了不必要的深度響應式轉換和更新檢查。

依此例來說，即使觸發 `changeRank` 方法，對 `rank.value.num` 的修改是 **不會觸發畫面更新** 的，因為 `shallowRef` 只會對引用本身的變化做出響應。

```vue
<script setup>
const rank = useState('rank', () => {
  return shallowRef({
    num: 3,
  });
});
const changeRank = () => {
  // 這樣的修改不會觸發組件重新渲染
  rank.value.num++;
  console.log(rank.value.num);
};
</script>

<template>
  <div>
    <h1>Rank:{{ rank }}</h1>
    <fwb-button color="default" @click="changeRank">ChangeRank</fwb-button>
  </div>
</template>
```

## clearNuxtState

用於清除、重置 useState 的狀態。

```vue
<script setup>
const counter = useCounter();
const clearCounter = () => {
  clearNuxtState('counter');
};
</script>
<template>
  <div>
    {{ counter }}
    <button @click="clearCounter()">clear</button>
  </div>
</template>
```

---

**參考資料：**

1. [useState](https://nuxt.com/docs/api/composables/use-state)
2. [clearNuxtState](https://nuxt.com/docs/api/utils/clear-nuxt-state)
3. [Nuxt.js 3.x 狀態管理 State Management (1)－useState)](https://clairechang.tw/2023/08/14/nuxt3/nuxt-v3-state-management-usestate/)
