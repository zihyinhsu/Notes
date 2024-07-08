---
date: 2024-07-06
title: '整合 Supabase'
author: Zihyin Hsu
category: Frontend
tags:
  - Nuxt3
---

# 整合 Supabase

[Supabase](https://supabase.com/) 是一個開源的後端即服務(Baas)平台，使用 PostgreSQL 作為資料庫，包含一系列基礎後端功能如：身份驗證、 資料存儲、websocket 等等，幫助前端工程師快速進行開發。

## 建立 Project

首先註冊一個 Supabase 帳號，並新增一個 New Project。

![addNewProject](img/addNewProject.png)

將 `Project Url`、`API Key`、`Database URL` 存進 .env 檔：

![projectAPI](img/projectAPI.png)

```md
<!-- Database URL -->

postgresql://postgres.aikkoilftwougwymplvd:[DATABASE-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

接著我們可以跟著 [Nuxt Supabase](https://supabase.nuxtjs.org/get-started) 官方文檔來進行整合。

::: code-group

```env [.env]
SUPABASE_URL = ********
SUPABASE_KEY = ********
DATABSE_URL = ********
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false,
  },
});
```

:::

::: danger 坑點紀錄
在安裝 @nuxtjs/supabase 時，如遇到依賴版本管理問題，請記得 npm update。
:::

## 註冊 signUp

我們可以用 [temp-mail](https://temp-mail.org/en/) 當作臨時信箱來收信。

```vue{12-22}
<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
// useState
const userData = useUser()
const notify = useNotify()

if (user.value) await navigateTo('/')

async function handleSignUp() {
  const { email, password } = userData.value
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: userData.value.userName,
        address: userData.value.address,
      },
      emailRedirectTo: 'http://localhost:3000',
    },
  })
  console.log('data', data)
  if (error) {
    notify.value = {
      visible: true,
      status: 'Error',
      message: error?.message,
    }
    return
  }

  notify.value.visible = true
  setTimeout(async () => {
    notify.value.visible = false
    notify.value.message = null
    await navigateTo('/confirm')
  }, 2000)
}
</script>

<template>
  <div>
    <div class="max-w-sm mx-auto">
      <h1 class="p-6 text-center">
        Register
      </h1>

      <form
        class=" flex flex-col space-y-4"
        @submit.prevent="handleSignUp"
      >
        <fwb-input
          v-model="userData.email"
          placeholder="name@gmail.com"
          label="Email"
          type="email"
        />
        <fwb-input
          v-model="userData.password"
          placeholder="********"
          label="Password"
          type="password"
        />
        <fwb-input
          v-model="userData.userName"
          placeholder="enter userName"
          label="userName"
        />
        <fwb-input
          v-model="userData.address"
          placeholder="enter address"
          label="address"
        />
        <fwb-button
          color="default"
          type="submit"
        >
          Register
        </fwb-button>
      </form>
      <div v-if="notify.visible">
        {{ notify.message }}
      </div>
    </div>
  </div>
</template>
```

從信箱 Confirm Email 之後，回到 Supabase 查看就可以找到剛剛註冊的帳號了。

![supabaseSignUp](img/supabaseSignUp.png)

## 登入 signInWithPassword

```vue{12-15}
<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
// useState
const userData = useUser()
const notify = useNotify()

if (user.value) await navigateTo('/')

async function handleLogin() {
  const { email, password } = userData.value
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  console.log('data', data)
  if (error) {
    notify.value = {
      visible: true,
      status: 'Error',
      message: error?.message,
    }
    return
  }

  notify.value.visible = true
  setTimeout(async () => {
    notify.value.visible = false
    notify.value.message = null
    await navigateTo('/')
  }, 1000)
}
</script>

<template>
  <div>
    <div class="max-w-sm mx-auto">
      <h1 class="p-6 text-center">
        Login
      </h1>

      <form
        class=" flex flex-col space-y-4"
        @submit.prevent="handleLogin"
      >
        <fwb-input
          v-model="userData.email"
          placeholder="name@gmail.com"
          label="Email"
          type="email"
        />
        <fwb-input
          v-model="userData.password"
          placeholder="********"
          label="Password"
          type="password"
        />
        <fwb-button
          color="default"
          type="submit"
        >
          Login
        </fwb-button>
      </form>
      <div v-if="notify.visible">
        {{ notify.message }}
      </div>
    </div>
  </div>
</template>
```

## 登出 signOut

```vue{6}
<script setup lang="ts">
const supabase = useSupabaseClient();
const notify = useNotify();

async function handleSignOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    notify.value = {
      visible: true,
      status: 'Error',
      message: error?.message,
    };
    return;
  }

  notify.value.visible = true;
  setTimeout(async () => {
    notify.value.visible = false;
    notify.value.message = null;
    await navigateTo('/');
  }, 2000);
}

// 避免有未登入用戶進入 Logout 頁面，將導至 Login 頁面
definePageMeta({
  middleware: [
    async () => {
      const user = useSupabaseUser();
      if (!user.value) return await navigateTo('/login');
    },
  ],
});
</script>

<template>
  <div>
    <div class="max-w-sm mx-auto">
      <h1 class="p-6 text-center">Logout</h1>

      <fwb-button color="default" @click="handleSignOut"> LogOut </fwb-button>
      <div v-if="notify.visible">
        {{ notify.message }}
      </div>
    </div>
  </div>
</template>
```

## 第三方登入 Google OAuth

首先，先去 [GCP](https://console.cloud.google.com/?hl=zh-tw) 開一個 project。

1. 選擇 APIs and admin > OAuth consent screen > External，填寫相關資料。

2. 回到 Credentials > Create Credentials > OAuth Client ID，繼續填寫相關資料。

3. 當遇到 Authorised redirect URIs 時，回到 Supabase > Auththentication > Providers，找到 **Google**，將 `Callback URL (for OAuth)` 複製起來，貼回剛剛的 `Authorised redirect URIs`。

4. 成功建立 Credentials 之後，將 Clint ID 和 Client secret 貼回 Supabase，Enable Sign in with Google 之後 `建立`。

```vue{3-5}
<script setup lang="ts">
async function handleGoogleLogin() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  console.log('handleGoogleLogin', data);
  if (error) {
    notify.value = {
      visible: true,
      status: 'Error',
      message: error?.message,
    };
    return;
  }

  notify.value.visible = true;
  setTimeout(async () => {
    notify.value.visible = false;
    notify.value.message = null;
    await navigateTo('/');
  }, 1000);
}
</script>
<template>
  <div>
    <fwb-button color="default" @click="handleGoogleLogin">
      Login with Google
    </fwb-button>
  </div>
</template>
```

---

**參考資料：**

1. [Supabase Doc](https://supabase.com/docs/guides/getting-started/tutorials/with-nuxt-3)
2. [Nuxt Supabase](https://supabase.nuxtjs.org/get-started)
3. [Create a new user](https://supabase.com/docs/reference/javascript/auth-signup)
