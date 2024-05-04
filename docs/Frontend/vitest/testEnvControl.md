---
date: 2024-05-03
title: '控制測試環境'
author: Zihyin Hsu
category: vitest
tags:
  - vitest
---

# 控制測試環境

## 受測物 & 依賴物

### 受測物 是什麼？

> 受測物，意指「測試的主要聚焦對象」，可能會是一個物件、函式、或是 module。

以 **會員登錄** 功能為例，測試的部分為: **登入元件是否有針對使用者輸入做出正確反應**，其中**登入元件** 即為所謂的 `受測物`。

### 依賴物 是什麼？

> 依賴物，意指「非主要目標，但須仰賴這些資料才能順利測試」的內容。

::: info
因此我們需要透過 **測試替身** 來「操控」、「監聽」、「隔離」依賴物，使測試案例可以保持單純與穩定。
:::

## 測試替身類型

### Dummy Value

> 只為了填充的測試替身，通常是一些非測試重點，但為必填的資料。

```js{3-6,12}
import Component from './Component.vue';

const dummyProps = {
  title: '',
  content: '',
};

it('isShow 為 true，打開 model',async () => {
  const wrapper = mount(Component, {
    props: {
      isShow: true,
      ...dummyProps,
    },
  });
  const model = await wrapper.find('[data-test="model"]')
  expect(model.isVisible()).toBe(true)
});
```

### Test Stub

> 操作測試物 > 受測物主動向依賴物取得資料 > 測試替身會替代原本的 **「依賴物」**，代為輸出資訊。

如果今天我們想測試一個容器型元件，可以透過 Vue Test Utils 提供的 `Stub Component` 參數來隔離非測試目標的元件。

```vue
<!-- BaseButton -->
<template>
  <button>
    <slot />
  </button>
</template>
```

```vue
<!-- MainView -->
<template>
  <div>
    <div data-test="target">
      <BaseButton>確認</BaseButton>
    </div>
  </div>
</template>

<script setup>
import BaseButton from './BaseButton.vue';
</script>
```

因 MainView 內有引用 BaseButton，如果希望不受到 BaseButton 的影響，可以在想替換的元件名稱後加入 `-stub` 的後綴，內部的值就會完全被清空。

```js{4-6,8}
import MainView from './MainView.vue';
it('確認 MainView 沒有受到任何更動', () => {
  const wrapper = mount(MainView, () => {
    global: {
      stubs: ['baseButton'];
    }
  });
  expect(wrapper.find('[data-test="target"]').html()).toMatchInlineSnapShot("<div data-test\\="target\\"><BaseButton-stub></BaseButton-stub></div>")
});
```

### Test Spy

> 受測物向依賴物取得資訊 > Test Spy 會附著在依賴物上，主動記錄下互動情形 > 斷言從 Test Spy 取得的資訊是否符合預期

```vue
<!-- HomePage -->
<template>
  <router-link to="/about" data-test="about">about</router-link>
</template>
```

```vue
<!-- About -->
<template>
  <p>About</p>
</template>

<script setup>
const routes = ref([
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
]);
</script>
```

```js{21-23,27,30-31}
import Home from './Home.vue';
import About from './About.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { mount } from '@vue/test-utils';
import { routes } from '@/router';

let router;

beforeEach(async () => {
  router = createRouter({
    history: createHistory(),
    routes: routes,
  });

  router.push('/');
  await router.isReady();
});

it('點擊 about 連結後導向 about 頁面', async() => {
  const wrapper = mount(Home, () => {
    global: {
      plugin: [router];
    }
  });

  // spyOn 只是單純監聽函式，而不影響原先行為。
  const push = vi.spyOn(router,'push') // 捕獲 router 的 push 方法
  await wrapper.find('[data-test="about"]').trigger('click')

  expect(push).toHaveBeenCalledTimes(1)
  expect(push).toHaveBeenCalledWith('/about')
});
```

### Mock Object

> 專注於被受測物呼叫時的使用方式是否符合預期，不在意原先依賴物的實作內容。

其概念與 `Test Spy` 相似，都是「依賴物的替身」，差別在於：

- Ｍock Object : 將依賴物的實作整個替換掉，多用於觀察「受測物」如何使用依賴物，不關心依賴物本身。
- Test Spy : 單純附於依賴物上監聽，多用於觀察受測物與依賴物之間的互動關係。

::: info 情境：
有一個路由導轉邏輯會查看使用者是否擁有權限，來判斷應導向哪個頁面。我們只關心導向的頁面是否正確，不在乎導向之後的狀況。
:::

在該測試案例中，雖有執行按鈕的點擊，但該方法已被測試替身 mockRouter 替換掉了，所以實際上路由沒有被導至 `/404` 或是 `/member`，所以無法測試到導頁後的邏輯。

```js{3-5,8-12,22-24,27-34}
import { mount } from '@vue/test-utils';
it('未登入狀態應導至 404', async () => {
  const mockRouter = {
    push: vi.fn(), // vi.fn 會在 push 方法被呼叫時紀錄使用狀況
  };

  const wrapper = mount(Component, {
    global: {
      mocks: {
        $router: mockRouter, // 取代元件中 ＄router 物件的邏輯
      },
    },
  });

  await wrapper.find('[data-test="button"]').trigger('click');

  expect(mockRouter.push).toHaveBeenCalledTimes(1);
  expect(mockRouter.push).toHaveBeenCalledWith('/404');
});

it('已登入狀態應導至會員頁面',async () => {
 const mockRouter = {
  push: vi.fn()
 }

 const wrapper = mount(Component,{
  props: {
    isAuthenticated:true
  },
  global:{
    mocks:{
      $router: mockRouter
    }
  }
 })

 await wrapper.find('[data-test="button"]').trigger('click')

 expect(mockRouter.push).toHaveBeenCalledTimes(1)
 expect(mockRouter.push).toHaveCalledWith('/member')
})
```

### Fake Object

簡而言之，就是有時候使用真實的依賴物會產生一些與測試內容無關的副作用，為避免這種狀況，我們可以在用 `Fake Object` 作為測試替身代替真實依賴物，呼叫時改使用測試替身準備好的方法即可。

以下為 Vitest 中 與 Fake Object 概念相似的 useFakeTimer API 範例:

```js{12-17,20}
import { vi, beforeEach } from 'vitest';

const getCurrentDate = () => {
  const date = new Date();
  const offset = new Date().getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);

  return date.toISOString().split('T')[0];
};

describe('測試環境的時間控制', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // 每個測試案例前，都改成模擬的時間
  });
  afterEach(() => {
    vi.useRealTimers(); // 每個測試案例後，都改成真實的時間
  });

  it('getCuurentDate 應該回傳 yyyy-mm-dd 格式', () => {
    vi.setSystemTime(new Date(1990, 0, 1)); // 模擬的當前時間
    const actual = getCurrentDate();
    const expected = '1990-01-01'; // 預期的當前時間
    expect(actual).toBe(expected) // 無論在哪天執行此段測試都會 passed
  });
});
```

## 測試替身 in Vue Test Utils

### mount & shallowMount

其中 `mount` 也可以透過設定達成與 `shallowMount` 一樣的效果。

```js
const wrapper = mount(Component, {
  shallow: true,
});
```

### global.renderStubDefaultSlot 強制顯示內容

當我們使用 `shallowMount` 或是 `mount + shallow` 隔離子元件，只要將 `global.renderStubDefaultSlot` 設定為 true，原先被隔離的 slot 內容就會顯示。

```js{2-4}
it('shallowMount，但顯示 slot 中的內容', {
  global: {
    renderStubDefaultSlot: true,
  },
});

expect(wrapper.html()).toMatchInlineSnapShot(
  '<div>
    <ChildComponent-stub>傳入文字</ChildComponent-stub>
  </div>',
);
```

### global.stubs

如果我們希望指定的子元件可以渲染成特定內容，可以透過 `global.stubs` 傳入：

```vue
<!-- StubComponent -->
<template>
  <p>stub</p>
</template>
```

```js{5-9}
import StubComponent from './StubComponent.vue'

it('指定的子元件可以渲染成特定內容',()=>{
  const wrapper = shallowMount(Component,{
    global:{
      stubs: {
        ChildComponent: StubComponent
      }
    }
  })

  expect(wrapper.html()).toMatchInlineSnapShot("
    <div>
      <p>stub content</p>
    </div>
  ")
})
```

### global.mocks

這是 `Vue Test Utils` 中唯一用來控制、模擬 vue 實體方法的 API。其概念與 `Mock Object` 相似，用於檢驗第三方 plugin 是否在元件中正確運作。

> 測試案例請見 <a href='/Frontend/vitest/testEnvControl.html#mock-object'>此處</a>。

## 測試替身 in Vitest

### vi.spyOn

多用於監聽物件方法的使用狀況。

```js{6}
const loadCacheFromLocalStorage = () => {
  localStorage.getItem('cache');
};

it('localStorage.getItem 使用狀況', () => {
  const spy = vi.spyOn(Storage.prototype, 'getItem');

  loadCacheFromLocalStorage();

  expect(spy).toHavebeenCalled(); // 是否有被呼叫
  expect(spy).toHavebeenCalledWith('cache'); // 呼叫帶入的參數
  expect(spy).toHavebeenCalledTimes(1); // 呼叫次數
});
```

### vi.fn

多用於除了有監聽需求，還想控制實作的情況。

```js{2,11}
it('透過 vi.fn 紀錄函式相關訊息', () => {
  const doSomthing = vi.fn() // 取代函式實作
  doSomthing(1,2,3)

  expect(doSomthing).toHaveBeenCalled()
  expect(doSomthing).toHaveBeenCalledWith(1,2,3)
  expect(doSomthing).toHaveBeenCalledTimes(1)
});

it('替換回傳值', () => {
  const doSomthing = vi.fn(() => 4)

  // 傳入什麼都回傳 4
  expect(doSomthing()).toBe(4)
  expect(doSomthing(1,2)).toBe(4)
  expect(doSomthing(3,4,5)).toBe(4)
});
```

### vi.mock

多用於想單獨針對受測物測試，或單純想監聽模組是否被正確使用。

```js
// calc.js
export multiply = (a,b) => a * b
```

```js
// utils
import { multiply } from './calc';

export const power = (a) => multiply(a, a);
```

`vi.mock` 方法本身具有提升(hoisting)特性，執行順序會優先於 import，因此需要藉由 `vi.hoisted` 附值，因為在 `vi.hoisted` 作用域內的程式碼會優先於 `vi.mock`。

```js{3-7,10-15}
import { power } from './utils';

const mocks = vi.hoisted(() => {
  return {
    multiply: vi.fn(),
  };
});

// 模擬目標的相對路徑
vi.mock('./clac',()=>{
  return {
    // 表示接下來有用到 multiply 都由 mocks.multiply 替代
    multiply: mocks.multiply
  }
})

it('透過 vi.mock 監聽依賴的模組方法',()=>{
  power(2)
  expect(mocks.multiply).toHaveBeenCalledTimes(1)
  expect(mocks.multiply).toHaveBeenCalledWith(2,2)
})
```

### mockInstance

`vi.fn`、`vi.spyOn` 之所以可以進行監聽與紀錄，是因為呼叫這兩個方法時，會回傳一個 mockInstance 實體。包含 `properties` 與 `methods` 兩個部分。

- properties

#### mock.calls & mock.lastCall：取得函式帶入參數的歷史紀錄

```js{7,9,11,13,15}
it('mock.calls & lastCall', () => {
  const spy = vi.spyOn(Storage.prototype, 'setItem');

  localStorage.setItem('cache', [1, 2, 3]);
  localStorage.setItem('cache', [4, 5, 6]);

  expect(spy.mock.calls).toEqual([
    // first call
    ['cache', [1, 2, 3]],
    // second call
    ['cache', [4, 5, 6]],
  ]);
  expect(spy.mock.lastCall).toEqual(
    // last call
    ['cachce', [4, 5, 6]],
  );
});
```

#### mock.results : 以陣列形式紀錄所有函數被呼叫的回傳值。

```js{7}
it('mock.results', () => {
  const spy = vi.spyOn(Storage.prototype, 'setItem');

  localStorage.setItem('cache', [1, 2, 3]);
  localStorage.setItem('cache', [4, 5, 6]);

  expect(spy.mock.results).toEqual([
    { type: 'return', value: undefined },
    { type: 'return', value: undefined },
  ]);
});
```

#### mock.instances : 紀錄所有呼叫模擬替身時的物件

```js{10}
it('mock.instances 紀錄所有模擬對象的實例', () => {
  const mockFn = vi.fn();

  const obj1 = { name: 'obj1' };
  const obj2 = { name: 'obj2' };

  mockFn.call(obj1, 1, 2, 3); // first call
  mockFn.call(obj2, 4, 5, 6); // second call

  expect(mockFn.mock.instances).toEqual[
    (obj1, // first call
    obj2) // second call
  ];
});
```

- methods

#### mockClear : 清除模擬紀錄

用於清除 `mock.calls`、`mock.results` 屬性中的紀錄，回傳空陣列。

```js{23}
it('mockClear', () => {
  const mockFn = vi.fn();

  mockFn(1, 2, 3); // first call
  mockFn(4, 5, 6); // second call

  expect(mockFn.mock.calls).toEqual([
    [1, 2, 3],
    [4, 5, 6],
  ]);

  expect(mockFn.mock.results).toEqual([
    {
      type: 'return',
      value: undefined,
    },
    {
      type: 'return',
      value: undefined,
    },
  ]);

  mockFn.mockClear()

  expect(mockFn.mock.calls).toEqual([])
  expect(mockFn.mock.results).toEqual([])
});
```

#### mockReset : 重置模擬替身狀態

會將 `mock.calls` 和 `mock.results` 清除，將原先的實作替換成一個空函式，固定回傳 undefined。

> 使用場景與 mockClear 類似，確保測試替身回傳的值為 undefined。

```js
it('mockReset', () => {
  const mockFn = vi.fn(() => 'mock');

  mockFn(1, 2, 3); // first call
  mockFn(4, 5, 6); // second call

  expect(mockFn.mock.calls).toEqual([
    [1, 2, 3],
    [4, 5, 6],
  ]);

  expect(mockFn.mock.results).toEqual([
    {
      type: 'return',
      value: undefined,
    },
    {
      type: 'return',
      value: undefined,
    },
  ]);

  expect(mockFn()).toBe('mock');

  mockFn.mockReset();

  expect(mockFn.mock.calls).toEqual([]);
  expect(mockFn.mock.results).toEqul([]);
  expect(mockFn()).toBeUndefined();
});
```

#### mockRestore : 恢復模擬替身狀態

會將 `mock.calls` 和 `mock.results` 清除，並恢復成原先的實作。

> 主要確保測試替身在每次測試案例都能恢復到初始模擬狀態。

```js{25}
it('mockRestore', () => {
  const mockFn = vi.fn(() => 'mock');

  mockFn(1, 2, 3); // first call
  mockFn(4, 5, 6); // second call

  expect(mockFn.mock.calls).toEqual([
    [1, 2, 3],
    [4, 5, 6],
  ]);

  expect(mockFn.mock.results).toEqual([
    {
      type: 'return',
      value: undefined,
    },
    {
      type: 'return',
      value: undefined,
    },
  ]);

  expect(mockFn()).toBe('mock');

  mockFn.mockRestore();

  expect(mockFn.mock.calls).toEqual([]);
  expect(mockFn.mock.results).toEqual([]);
  expect(mockFn()).toBeUndefined();
});
```

#### mockImplementation : 改變模擬替身的實作

若想測試在不同依賴物的狀態下，受測物的反應，可透過 `mockImplementation` 改變測試替身的實作。

```js{5}
it('mockImplementation', () => {
  const mockFn = vi.fn(() => 'original');
  expect(mockFn()).toBe('original');

  mockFn.mockImplementation(() => 'mock'); // 改變成替換的值 'mock'

  expect(mockFn()).toBe('mock'); // 接下來都會回傳 'mock'
  mockFn.mockRestore()
  expect(mockFn()).toBe('original')
});
```

#### mockImplementationOnce : 改變當下模擬替身的實作一次

改變測試替身所輸出的內容一次，後續自動恢復到原先測試替身的實作。

```js{5}
it('mockImplementationOnce', () => {
  const mockFn = vi.fn(() => 'original');
  expect(mockFn()).toBe('original');

  mockFn().mockImplementationOnce(() => 'mock');

  expect(mockFn()).toBe('mock'); // 改變成替換的值 'mock' 一次
  expect(mockFn()).toBe('original'); // 接下來會恢復到原先的值
});
```

#### mockReturnValue、mockReturnValueOnce : 改變測試替身的回傳值

```js{3}
it('mockReturnValue', () => {
  const mockFn = vi.fn();
  mockFn.mockReturnValue('mock');
  expect(mockFn()).toBe('mock');

  mockFn.mockRestore()
  expect(mockFn()).toBeUndefined()
});
```

```js{3}
it('mockReturnValueOnce', () => {
  const mockFn = vi.fn();
  mockFn.mockReturnValueOnce('mock');
  expect(mockFn()).toBe('mock'); // 只改變一次輸出值
  expect(mockFn()).toBeUndefined() // 恢復到原先輸出
});
```

#### mockResolvedValue、mockResolvedOnce、mockRejectedValue、mockRejectedValueOnce : 模擬回應資料

若我們想仿造的依賴物本身是 Promise 物件 (如請求伺服器的資料)，在測試中我們通常會仿冒回應資料來斷言，去模擬是 `resolved` 還是 `rejected`。

```js{6-8}
import axios from 'axios';

/*  假設 get API 回傳資料為 { data: { value:'original'} } */
it('mockResolvedValue、mockResolvedOnce', async () => {
  const spy = vi.spyOn(axios, 'get');
  spy.mockResolvedValue({
    data: { value: 'mock' },
  });
  const { data } = await axios.get('https://localhost/list/a');
  expect(data).toEqual({
    value: 'mock'
  })
});
```

### vi.stubGlobal

如果遇到受測物有使用到全域 API，但 `jsdom` 或者 `node` 環境中沒有提供，需要自己模擬或監聽，可透過 `vi.stubGlobal` 在測試環境中模擬出與運行相同的全域環境。

```js
// utils.js
export const enableImgLazyLoad = () => {
  const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
  const lazyImageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        let lazyImage = entry.target;
        lazyImage.src = lazyImage['data-src'];
        lazyImage.classList.remove('lazy');
        lazyImageObserver.unoobserve(lazyImage);
      }
    });
  });

  lazyImages.forEach((lazyImage) => {
    lazyImageObserver.observe(lazyImage);
  });
};
```

```js{10}
import { enableImgLazyLoad } from 'utils.js'

const IntersectionObserverMock =  vi.fn() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecord: vi.fn(),
  unobserve: vi.fn()
})

vi.stubGlobal('IntersectionObserverMock',IntersectionObserverMock)

it('檢查 enableImglazyLoad 觸發後，目標元素是否有被 observe',()=>{
  const div = document.createElement('div')
  const img1 = document.createElement('img')
  img1.className = 'lazy'
  div.appendChild(img1)
  div.appendChild(img2)
  document.body.appendChild(div)

  enableImgLazyLoad()

  const observeMock = IntersectionObserverMock.mock.results[0].value.observe.mock

  expect(IntersectionObserverMock).toHaveBeenCalled()
  expect(observeMock.calls[0][0]).toBe(img1)
  expect(observeMock.calls[1][0]).toBe(img2)
})
```

### 模擬日期：Date

#### useFakeTimers、setSystemTime

`useFakeTimers` 使得當下測試環境與日期相關的 API，會被置換成測試替身版本。

```js{2-3}
it('mock system time', () => {
  vu.useFakeTimers();
  vi.setSystemTime(new Date('2023-08-03'));

  expect(newDate()).toEqual(new Date('2023-08-03'));
});
```

#### useRealTimers

```js{4}
it('restore system time', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2024-8-15'));
  vi.useRealTimers(); // 恢復成原先系統中的日期
  expect(new Date()).not.toEqual(new Date('2024-8-15'));
});
```

#### getMockedSystemTime、getRealSystemTime

```js{10,15}
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2024-08-15'));
});
afterEach(() => {
  vi.useRealTimers();
});

it('getMockedSystemTime', () => {
  expect(vi.getMockedSystemTime()).toEqual(new Date('2024-08-15'));
});

it('getRealSystemTime',()=>{
  // 假設當日為 2024-03-08
  expect(vi.getRealSystemTime()).not.toEqual(new Date('2024-08-15'))
})
```

### 模擬時間：Timer

#### runAllTimers

用於觸發測試案例中所有計時器的實作。

```js{5}
it('runAllTimers', () => {
  vi.useFakeTimers();
  const mockFn = vi.fn();
  setTimeout(mockFn, 1000);
  vi.runAllTimers();

  expect(mockFn).toHaveBeenCalled();
});
```

#### runOnlyPendingTimers

用於當實作的計時器不只一個，並且希望所有等待的計時器都至少執行過一次。

```js{16}
it('runOnlyPendingTimers', () => {
  vi.useFakeTimers()
  let count1 = 0
  let count2 = 0

  const mockFn1 = () => count1++
  const mockFn2 = () => count2++

  setInterVal(() => mockFn1(), 1000)
  setInterVal(() => mockFn2(), 3000)

  expect(count1), toEqual(0)
  expect(count2), toEqual(0)

  // 直到執行完當下等待中的所有計時器，需一次推進 3000 ms
  vi.runOnlyPendingTimers()

  expect(count1).toEqual(3) // 經過 3000 ms 後，執行了 3 次
  expect(count2).toEqual(1) // 經過 3000 ms 後，執行了 1 次
});
```

#### advanceTimersByTime

用於預測執行固定秒數的狀況。

```js{6,10}
it('advanceTimersByTime', () => {
  vi.useFakeTimers();
  const mockFn = vi.fn();
  setTimeout(mockFn, 1000);

  vi.advanceTimersByTime(999)
  // 執行到這行時已過 999 ms
  expect(mockFn).not.HaveBeenCalled()

  vi.advanceTimersByTime(1000)
  // 執行到這行時已過 1000 ms
  expect(mockFn).HaveBeenCalled()
});
```

#### advancedTimersNextTimer

與 `runOnlyPendingTimers` 一樣都是推進時間，差別在於 `advanceTimersByTime` 會推進整個測試環境到下一個應該完成計時器的秒數，而非所有計時器至少執行一次的時間點。

```js{16,22,28}
it('advanceTimersByTime', () => {
  vi.useFakeTimers();
  let count1 = 0;
  let count2 = 0;

  const mockFn1 = () => count1++;
  const mockFn2 = () => count2++;

  setInterVal(() => mockFn1(), 1000);
  setInterVal(() => mockFn2(), 3000);

  expect(count1), toEqual(0);
  expect(count2), toEqual(0);

  // 直到執行完接下來的一個計時器，須一次推進 1000 ms
  vi.advancedTimersNextTimer();

  expect(count1).toEqual(1); // 經過 1000 ms後執行 1 次 (距離下次還有 1000 ms)
  expect(count2).toEqual(0); // 經過 1000 ms後執行 0 次 (距離下次還有 2000 ms)

  // 直到執行完接下來的一個計時器，須一次推進 1000 ms
  vi.advancedTimersNextTimer();

  expect(count1).toEqual(2); // 又經過 1000 ms 後執行 2 次 (距離下次還有 1000 ms)
  expect(count2).toEqual(0); // 又經過 1000 ms後執行 0 次 (距離下次還有 1000 ms)

  // 直到執行完接下來的一個計時器，須一次推進 1000 ms
  vi.advancedTimersNextTimer();

  expect(count1).toEqual(3);
  expect(count2).toEqual(1);
});
```

---

**來源：** [Vue.js 3前端測試入門從這裡開始](https://www.drmaster.com.tw/bookinfo.asp?BookID=MP22333)
