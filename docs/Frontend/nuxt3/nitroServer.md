---
date: 2024-07-04
title: 'Nitro Server'
author: Zihyin Hsu
category: frontend
tags:
  - Nuxt3
---

# Nitro Server

Nuxt 3 配置了新的 Nitro Engine，優點包含 `HMR`、`自動生成 API 路由`、`跨平台支援 Node.js、瀏覽器、service-workers`、 `支援 Serverless / 靜態 ＋ Serverless 混合模式`、`配置 Server API`、`自動分割程式碼和非同步載入區塊`，以實現完整的全端應用。

## 實現一個簡單的 Server API

首先在 `server` 資料夾下建立 `api` 資料夾，再新增 `default.js` 檔。

因為 Nitro Engine 會自動生成API路由，當我們訪問 `http://localhost:3000/api/default` 就會獲得回傳內容了。

```
server/
|—— api/
  |—— default.js
```

```js
export default defineEventHandler(() => {
  {
    return 'default Data!';
  }
});
```

而當我們想要在頁面呼叫這支 API 時，可以這樣做：

```vue
<script setup>
const { data } = await useFetch('/api/default');
</script>

<template>
  {{ data }}
</template>
```

若我們希望創建一個沒有 **api 前綴** 的伺服器路由，我們可以將 api 檔案改存放在 **routes** 資料夾底下即可。

```
server/
|—— routes/
  |—— default.js
```

## getRouterParam

首先更改檔案結構，將檔案名稱改為動態參數的形式。

```
server/
|—— default/
  |—— [name].js
```

這裡使用 `getRouterParam` 來取得路由中的 Params。

```js
export default defineEventHandler((event) => {
  {
    const name = getRouterParam(event, 'name');
    return name;
  }
});
```

最後我們可以透過訪問 `http://localhost:3000/api/default/jenny` 取得返回結果。

![getRouterParams](img/getRouterParams.png)

## readBody

在 Nuxt3 中， Nitro 透過 [unjs/h3](https://github.com/unjs/h3) 作為 HTTP 服務器的框架，為 Nitro 提供高效靈活的 server 端功能。

而 `readBody` 為 `unjs/h3` 提供的 utility，我們可以透過 `readBody` 讀取前端所傳來 body 的值。

::: code-group

```vue [user.vue]
<script setup>
let userName;
if (process.client) {
  userName = prompt('What is your name?');
}

const { data: name } = await useFetch('/users/findName', {
  server: false,
  method: 'post',
  body: {
    name: userName,
  },
});
</script>

<template>
  <div>
    <h1 v-if="name">
      {{ name }}
    </h1>
  </div>
</template>
```

```js [server/routes/users/findName.js]
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name } = body;
  return name;
});
```

:::

## getQuery

同理，我們也可以用 `getQuery` 來取得 Query 的值。

除了用 prompt，也可訪問 `http://localhost:3000/users/findName?name=jenny` 來測試，應可正確取得 `jenny`。

::: code-group

```vue [user.vue]
<script setup>
let userName;
if (process.client) {
  userName = prompt('What is your name?');
}

const { data: name } = await useFetch('/users/findName', {
  server: false,
  method: 'post',
  query: {
    name: userName,
  },
});
</script>

<template>
  <div>
    <h1 v-if="name">
      {{ name }}
    </h1>
  </div>
</template>
```

```js [server/routes/users/findName.js]
export default defineEventHandler((event) => {
  const body = getQuery(event);
  const { name } = body;
  return name;
});
```

:::

## Http Method

我們可以將請求方法寫在檔名後綴，來表示該檔案是採用哪個 http method。

```
server/
|—— api/
  |—— posts.json // 拿來當測試資料庫
  |—— posts.get.js
  |—— posts.post.js
  |—— posts.patch.js
  |—— posts.delete.js
```

以下來實作一個簡單的 CRUD :

::: code-group

```json [posts.json]
[
  {
    "id": 1,
    "title": "post1"
  },
  {
    "id": 2,
    "title": "post2"
  }
]
```

```js [posts.get.js]
import posts from './posts';

export default defineEventHandler(() => {
  return posts;
});
```

```js [posts.post.js]
import posts from './posts';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (body) posts.push(body);
  return posts;
});
```

```js [posts.patch.js]
import posts from './posts';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const index = posts.findIndex((post) => post.id === Number(body.id));
  if (index) posts[index] = body;
  return posts;
});
```

```js [posts.delete.js]
import posts from './posts';

export default defineEventHandler(async (event) => {
  const id = getQuery(event).id;
  const deleteIndex = posts.findIndex((post) => post.id === Number(id));
  if (deleteIndex !== -1) posts.splice(deleteIndex, 1);
  return posts;
});
```

```vue [posts.vue]
<script setup>
const result = ref(null);
// 取得資料
const getPosts = async () => {
  const { data } = await useFetch('/api/posts', {
    method: 'get',
  });
  result.value = data.value;
};
// 新增資料
const addPost = async () => {
  const { data } = await useFetch('/api/posts', {
    method: 'post',
    body: {
      id: 3,
      title: 'post 3',
    },
  });
  result.value = data.value;
};
// 編輯資料
const editPost = async () => {
  const { data } = await useFetch('/api/posts', {
    method: 'patch',
    body: {
      id: 3,
      title: 'post 3 edit',
    },
  });
  result.value = data.value;
};
// 刪除資料
const deletePost = async () => {
  const { data } = await useFetch('/api/posts?id=3', {
    method: 'delete',
  });
  result.value = data.value;
};
</script>

<template>
  <div>
    <fwb-button color="default" @click="getPosts">Get Post</fwb-button>
    <fwb-button color="default" @click="addPost">Add Post</fwb-button>
    <fwb-button color="default" @click="editPost">Edit Post</fwb-button>
    <fwb-button color="default" @click="deletePost">Delete Post</fwb-button>
    <h1>{{ result }}</h1>
  </div>
</template>
```

:::

## Server Middleware

Server Middleware 會在每個請求運行之前 / 之後執行自定義邏輯。如：`新增或檢查標頭`、`處理 cors`、`記錄請求` 或 `擴展請求物件`。

```
server/
|—— middleware/
  |—— log.js
```

```js
export default defineEventHandler((event) => {
  console.log('server middleware', getRequestURL(event));
});
```

## Runtime Config & .env file

我們可以透過 `runtimeConfig` 來根據開發/生產環境動態更改設定值，多用於儲存敏感訊息。可分為 `Public Runtime Config`、`Private Runtime Config`。

> **Public Runtime Config** : 可以在 client 端和 server 端訪問，放置較不敏感資訊。

> **Private Runtime Config** : 只在 server 端訪問，放置敏感資訊。

::: code-group

```js [nuxt.config.js]{5-10}
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  plugins: ['~/plugins/flowbite-vue.js'],
  runtimeConfig: {
    secretKey: 'secretKey key content',
    public: {
      publicKey: 'public key content',
    },
  },
});
```

```js [server/api/test.js]{2}
export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const { secretKey } = config;
  console.log('config secretKey', secretKey); // secretKey key content
});
```

```vue [user.vue]{2}
<script setup>
const config = useRuntimeConfig();
console.log('config publicKey', config.public.publicKey); // public key content
console.log('config secretKey', config.secretKey); // undefined
</script>
```

:::

## parseCookies

`parseCookies` 可用來解析請求所夾帶的 Cookie 字串。

```
server/
|—— api/
  |—— cookies.js
```

```js
export default defineEventHandler((event) => {
  const cookies = parseCookies(event);
  return cookies;
});
```

## sendRedirect

我們可以透過 `sendRedirect` 在 server 端來實現重定向。

```js
export default defineEventHandler(async (event) => {
  await sendRedirect(event, '/about');
});
```

---

**參考資料：**

1. [Server Engine](https://nuxt.com/docs/guide/concepts/server-engine)
2. [Server](https://nuxt.com/docs/guide/directory-structure/server)
