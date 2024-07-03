---
date: 2024-05-04
title: 'Vue Ecosystem'
author: Zihyin Hsu
category: Vue
tags:
  - Vitest
---

# Vue Ecosystem

## Vue Router

### 孤立型測試

#### vue-router

```vue
<!-- EditButton -->
<template>
  <button data-test="button" @click="redirect">編輯文章</button>
</template>

<script setup>
const props = withDefaults(
  defineProps<{
    isAuthenticated: boolean;
  }>(),
  {
    isAuthenticated:false
  }
);

const $router = useRouter()
const $route = useRoute()

const redirect = () => {
  if(props.isAuthenticated){
    $router.push(`/posts/${$route.params.id}/edit`)
  }else{
    $router.push('/home')
  }
}
</script>
```

```js{5-12}
import { mount } from '@vue/vue-test-utils';
import { useRoute, useRouter } from 'vue-router';
import EditButton from './EditButton.vue';

vi.mock('vue-router', () => {
  return {
    useRoute: vi.fn(),
    useRouter: vi.fn(() => {
      push: () => {};
    }),
  };
});

it('未登入狀態應導至首頁', () => {
  const push = vi.fn();
  // 重新宣告一個新的測試替身，確保每一次push都重新紀錄
  useRouter.mockImplementationOnce(() => {
    push;
  });
});

const wrapper = mount(EditButton);

await wrapper.find('[data-test-"button"]').trigger('click');

expect(push).toHaveBeenCalledTimes(1);
expect(push).toHaveBeenCalledWith('/home');

it('已登入狀態應導至文章編輯頁', async () => {
  useRoute.mockImplementationOnce(() => {
    params: {
      id: 9527;
    }
  });
});

const push = vi.fn();

useRouter.mockImplementationOnce(() => {
  push;
});

const wrapper = mount(EditButton,{
  props:{
    isAuthenticated:true
  }
})

await wrapper.find('[data-test="button"]').trigger('click')

expect(push).toHaveBeenCalledTimes(1)
expect(push).toHaveBeenCalledWith('/posts/9527/edit')
```

#### router-link

```vue
<!-- EditButton -->
<template>
  <router-link :to="getEditLink" data-test="button">編輯文章</router-link>
</template>

<script setup>
const props = withDefaults(
  defineProps<{
    isAuthenticated: boolean;
  }>(),
  {
    isAuthenticated:false
  }
);

const getEditLink = computed(() => {
  if(props.isAuthenticated){
    $router.push(`/posts/${$route.params.id}/edit`)
  }else{
    $router.push('/home')
  }
});
</script>
```

```js{4-8,25-30}
import { mount } from '@vue/test-utils';

it('未登入狀態應導至首頁', async () => {
  const wrapper = mount(EditButton, {
    global: {
      stubs: ['router-link'],
    },
  });
  expect(
    await wrapper.find('[data-test="button"]').attribute('to').toBe('/Home'),
  );
});

it('已登入狀態應導至文章編輯頁', async () => {
  const mockRoute = {
    params: {
      id: 9527
    }
  }

  const wrapper = mount(EditButton, {
    props: {
      isAuthenticated:true
    },
    global: {
      mocks: {
        $route : mockRoute
      },
      stubs: ['router-link']
    }
  })
 expect(
    await wrapper.find('[data-test="button"]').attribute('to').toBe('/posts/9527/edit'),
  );
});
```

### 社交型測試 : 使用真實路由

> `flushPromises` 用來確保最終的畫面已重新渲染完畢。

```js{18-22,28-32,35}
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from '@/router';
import App from '@/App.vue';

const router = createRouter({
  history: createWebHistory,
  routes: routes,
});

beforeEach(async () => {
  router.push('/');
  await router.isReady();
});

it('初始應留在首頁', async () => {
  const wrapper = mount(App, {
    global: {
      plugin: [router],
    },
  });
});
const page = wrapper.find('[data-test="container"]')
expect(page.html()).toMatchInlineSnapShot("<div data-test=\\"container\\">首頁</div>")

it('點擊關於按鈕登入關於頁',async() => {
  const wrapper = mount(App,{
    global: {
      plugins: [router]
    }
  })

  await wrapper.find('[data-test="about-button"]').trigger('click')
  await flushPromises() // 用來確保最終的畫面已重新渲染完畢

  const page = wrapper.find('[data-test=""container]')
  expect(page.html()).toMatchInlineSnapShot("<div data-test=\\"container\\">關於我</div>")
})
```

## Pinia

### 測試 store 本身行為

```js
// pinia store
export const useCounter = defineStore('counter', () => {
  const count = ref(0);
  const getCount = computed(() => formateText(count.value));
  const formateText = (num) => `Current count is ${num}`;
  return {
    count,
    getCount,
  };
});
```

```js{4-8}
import { setActivePinia, createPinia } from 'pinia';
import { useCounter } from '@/store/useCounter';

let counter;
beforeEach(() => {
  setActivePinia(createPinia());
  counter = useCounter();
});

it('count 應為 0',()=>{
  expect(counter.count).toBe(0)
  expect(counter.getCount).toBe('Current count is 0')
})
```

### 測試 store 與元件的互動

做這類測試建議安裝以下套件，`@pinia/testing` 的 `createTestingPinia` 可以快速建議模擬的 pinia 實體。

```js
npm i -D @pinia/testing
```

```js{3-5}
it('用 createTestingPinia 快速建立模擬 pinia 實體', () => {
  const wrapper = mount(App, {
    global: {
      plugin: [createTestingPinia],
    },
  });

  const counter = useCounter();
  counter.increment();
  expect(counter.count).toBe(1);
});
```

#### initialState

多用於「以某種狀況為前提」的測試情境。

```js{3-11}
it('initialState',()=>{
  const wrapper = mount(App,{
    global:{
      createTestingPinia({
        initialState:{
          counter: {
            count: 100
          }
        }
      })
    }
  })
  expect(wrapper.find('[data-test="count"]')).text().toBe('100')
})
```

#### stubActions

孤立型的測試風格：有監聽到元件呼叫對應的 store 方法即可。
社交型的測試風格：需要觀察元件與 store 互動後的反應。

如果偏好社交型測試，需要把 `stubActions` 設為 false ，否則會因模擬點擊時，實際上是觸發到模擬的方法，而非觸發到方法的實作，而導致測試案例失敗。

```vue
<!-- HomePage -->
<template>
  <div>
    <button data-test="add_button" @click="counter.increment">add</button>
    <p data-test="count">{{ counter.count }}</p>
  </div>
</template>
```

```js{4-8,17-19}
// 社交型測試
it('點擊按鈕後，應顯示正確數值', () => {
  const wrapper = mount(HomePage, () => {
    global: {
      createTestingPinia({
        stubActions: false,
      });
    }
  });
  await wrapper.find('[data-test="add_button"]').trigger('click')
  expect(wrapper.find('[data-test="count"]').text()).toBe(1) // 社交型測試的斷言方式
});

// 孤立型測試
it('點擊按鈕後，會觸發 increment 方法', () => {
  const wrapper = mount(HomePage, () => {
    global: {
      plugin:[createTestingPinia()]
    }
  });
  const counter = useCounter()
  await wrapper.find('[data-test="add_button"]').trigger('click')
  expect(counter.increment).toHaveBeenCalled() // 孤立型測試的斷言方式
});
```

#### createSpy

在使用 vitest 或是 jest 作為測試環境時，createTestingPinia 會根據測試環境決定引入 `vi.fn` 或 `jest.fn` 當作測試替身，但如果有需要使用其他隔離庫如 sinon.js，就要透過 `createSpy` 帶入。

```js{5-8}
import sinon from 'sinon';

it('createSpy', () => {
  const wrapper = mount(HomePage, () => {
    global: {
      createTestingPinia({
        createSpy: sinon,
      });
    }
  });
});
```

#### plugins

如果有用到其他 plugin 來擴充 pinia 功能，就要透過 `createSpy` 加入。

```js{5-9}
import { myPlugin } from './store/plgins';

it('plugins', () => {
  const wrapper = mount(HomePage, () => {
    global: {
      createTestingPinia({
        plgins: [myPlugin],
      });
    }
  });
});
```

---

**來源：** [Vue.js 3前端測試入門從這裡開始](https://www.drmaster.com.tw/bookinfo.asp?BookID=MP22333)
