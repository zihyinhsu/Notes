---
date: 2024-04-30
title: '元件測試'
author: Zihyin Hsu
category: vitest
tags:
  - vitest
---

# 元件測試

vue 的 SFC 檔必須透過 `Vue Test Utils` 解析與渲染過後才能進行測試。

以下是一個簡單的測試範例：

```js
import { mount } from '@vue/test-utils';
import component from './testComponent.vue';

it('一個簡單的元件測試範例', () => {
  const wrapper = mount(component, {
    propsData: {
      msg: 'Hello world',
    },
  });
  expect(wrapper.text()).toBe('Hello World'); // passed
});
```

## 容器 Wrapper

### mount v.s. shallowMount

兩者最大差異在於：**渲染目標元件時，內部其他元件是否會跟著一併渲染**。如果需避免子元件影響到目標元件，則使用 `shallowMount`，若測試案例涉及父子元件之間的互動，則使用 `mount`。

- mount: 會將底下引用到的子元件也一起渲染。
- shallowMount: 只渲染目標元件。

## 容器方法 (wrapper methods)

### 選擇器 (selector)

`Vue test Utils` 提供以下三種選擇器，選取到目標之後會回傳 DOM 實體：

- find: 用來選取單一元素，若找不到會回傳空物件。
- findAll: 將選取到的元素放進陣列，後續透過 `at` 選取目標。
- get: 用來選取單一元素，若找不到會直接報錯。

```js{12,13,14,15}
import { mount } from '@vue/test-utils';
it('選取目標', () => {
  const wrapper = mount({
    template: `
        <div>
            <p> 開頭 </p>
                <span> 中間 </span>
            <p ref="target"> 結尾 </p>
        </div>
        `,
  });
  console.log(wrapper.find('p').html());
  console.log(wrapper.findAll('p').at(0).html());
  console.log(wrapper.get('span'));
  console.log(wrapper.find({ref: 'target'}).html())
});
```

::: danger 提醒
因為使用 find 判斷元素是否存在還需另外搭配 exist 語法，相較之下 get 若無法取得目標會直接報錯，因此官方預計未來會**移除 find 方法**，建議一律使用 `get` 判斷。
:::

#### exist v.s. isVisible

如果是確認元素有沒有被渲染到 DOM 上，該使用 `exist`，若確認該元素渲染在 DOM 上，只是會根據情境隱藏，則該使用 `isVisible`。

### 元件選擇器

- findComponent: 用來選取單一元件，若找不到會回傳空物件。
- findAllComponent: 將選取到的元件放進陣列，後續透過 `at` 選取目標。
- getComponent: 用來選取單一元件，若找不到會直接報錯。

元件還多了以下選取方式：

```js
findComponent({ name: '元件名稱' });
findComponent(testComponent); // 須 import 元件進來
```

### 取得目標資訊

- 屬性 (attribute)
  可以透過以下方式查詢指定屬性的值：

```js
wrapper.findComponent(testComponent).attributes('href'); // https://test.com.tw
```

- class 名稱
  可以透過以下方式查詢指定元件的 class 名稱：

```js
wrapper.findComponent(testComponent).attributes('class'); //  text-md
wrapper.findComponent(testComponent).classes(); // ['text-md']
wrapper.findComponent(testComponent).classes('text-md'); // true
```

- innerHTML、innerText

```js{2}
const wrapper = mount(testComponent)
console.log(wrapper.html()) /* <a href="https://test.com.tw" class ="text-md">Test</a> */
console.log(wrapper.text()) // Test
```

### 模擬事件

---

#### **滑鼠事件**

通常是透過 `trigger` 來觸發事件。

```js{2}
const wrapper = mount(testComponent)
await wrapper.trigger('click.right')
expect(wrapper.text()).toBe(1)
```

1. 點擊：click、click.left、click.right、click.middle
2. 雙擊：dbclick

#### **鍵盤事件**

```js
wrapper.trigger('keydown.enter');
// 多重修飾符
wrapper.trigger('keyup.ctrl.tab');
```

#### **表單事件**

- 模擬 input 輸入

::: danger 提醒
需注意透過 `setValue` 輸入的資料 格式須與 input type 的格式相符，否則會因格式錯誤導致值被清空空字串。
:::

```js{3}
it('模擬 input 輸入',async () => {
    const wrapper = mount(BaseInput)
    await wrapper.find('[data-test="input"]').setValue('輸入的內容')
    expect(wrapper.find('[data-test="content"]').text()).toBe('輸入的內容')
});
```

- 模擬 radio/checkbox 勾選

一樣是透過 `setValue` ，但是是 `true` / `false`。

```js{3}
it('模擬 radio/checkbox 勾選', async () => {
  const wrapper = mount(BaseRadio);
  await wrapper.find('[data-test="radio"]').setValue(true);
  expect(wrapper.find('[data-test="result"]').text()).toEqual('1');
});
```

- 模擬 select 選擇

若要模擬 multiple select，就要傳入陣列，否則為單選。

```js{4}
// 單選
it('模擬 select 選擇', async () => {
  const wrapper = mount(BaseRadio);
  await wrapper.find('[data-test="target"]').setValue('Taipei');
  expect(wrapper.find('[data-test="result"]').text()).toEqual('Taipei');
});
```

```js{4}
// 多選
it('模擬 select 選擇', async () => {
  const wrapper = mount(BaseRadio);
  await wrapper.find('[data-test="target"]').setValue(['Taipei','NewTaipei']);
  expect(wrapper.find('[data-test="result"]').text()).toEqual(['Taipei','NewTaipei']);
});
```

## 模擬元件

`mount` 和 `shallowMount` 其實還有第二個參數：`MountingOptions`，分別為包含以下幾種資料：

```js
mount(Component, MountingOptions);
shallowMount(Component, MountingOptions);
```

### setup (`<script setup>`)

設定模擬初始資料:

```js{6-11}
import { mount } from '@vue/test-utils';
import component from '../BaseComponent.vue';

it('一開始掛載元件時塞入 setup 屬性', () => {
  const wrapper = mount(component, {
    setup() {
      return {
        // text : 'hello', 若不設定 text，會變成 undefined
        text2: 'vue test utils',
      };
    },
  });
  expect(wrapper.text()).not.toBe('hello!'); // passed
  expect(wrapper.text()).toBe('vue test utils'); //passed
});
```

### Props

- 一開始掛載元件時傳入 porps 屬性

```js{6-8}
import { mount } from '@vue/test-utils';
import component from '../BaseComponent.vue';

it('一開始掛載元件時傳入 porps 屬性', () => {
  const wrapper = mount(component, {
    props: {
      text: 'Hello, World!',
    },
  });
  expect(wrapper.text()).toBe('Hello, World!!'); // passed
});
```

- 掛載元件後才傳入 porps 屬性

```js{6-8}
import { mount } from '@vue/test-utils';
import component from '../BaseComponent.vue';

it('掛載元件後才傳入 porps 屬性', async () => {
  const wrapper = mount(component);
   await wrapper.setProps({
    text:'Hello, World!'
   })
  expect(wrapper.text()).toBe('Hello, World!!'); // passed
});
```

- 檢查傳入元件時的 props 是否符合預期

```js{7-8}
import { mount } from '@vue/test-utils';
import component from '../BaseComponent.vue';
import baseTag from '../BaseTag.vue';

it('檢查傳入元件時的 props 是否符合預期', () => {
  const wrapper = mount(component);
  const target = wrapper.getComponent(baseTag)
  expect(target.props('text')).toBe('Hello, Tag!!'); // passed
});
```

### Emits

```vue
<!-- BaseComponent -->
<template>
  <div>
    <button data-test="prev" @click="$emit('changePage', 'prev')">Prev</button>
    <button data-test="next" @click="$emit('changePage', 'next')">Next</button>
  </div>
</template>
```

```js{6,9,12-15}
import { mount } from '@vue/test-utils';
import component from '../BaseComponent.vue';

it('接收對應的emit', async () => {
  const wrapper = mount(component);
  await wrapper.find('[data-test="prev"]').trigger('click');
  console.log(wrapper.emitted()) // [ changePage:[['prev']] ]

  await wrapper.find('[data-test="next"]').trigger('click');
  console.log(wrapper.emitted()) // [ changePage:[['prev'],['next']] ]

  expect(wrapper.emitted()).toHaveProperty('changePage')
  expect(wrapper.emitted().changePage).toHaveLength(2)
  expect(wrapper.emitted().changePage[0][0]).toBe('prev')
  expect(wrapper.emitted().changePage[1][0]).toBe('next')
});
```

### Provide/Inject

```vue
<!-- ParentComponent -->
<template>
  <div>
    <button data-test="button" @click="count++">add</button>
    <ChildComponent />
  </div>
</template>

<script setup>
import ChildComponent from './ChildComponent.vue';
const count = ref(0);
provide('count', readonly(count));
</script>
```

```vue
<!-- ChildComponent -->
<template>
  <p data-test="target">{{ count }}</p>
</template>

<script setup>
const count = inject('count');
</script>
```

- 測試結果

```js{5-6,11-15}
import ChildComponent from './ChildComponent.vue';

it('ParentComponent 應 Provide 正確的資料', async () => {
  const wrapper = mount(ParentComponent);
  await wrapper.find('[data-test="button"]').trigger('click');
  expect(wrapper.find('[data-test="target"]').text()).toBe('1');
});

it('ChildComponent 是否收到 正確的 Inject', () => {
  const wrapper = mount(ChildComponent, {
    global: {
      provide: {
        count: 1,
      },
    },
  });
  expect(wrapper.html()).toBe("<div>1</div>")
});
```

### Slots

#### 預設插槽（Default Slots）

```vue
<!-- BaseComponent -->
<template>
  <div>
    <slot />
  </div>
</template>
```

```js{11-16}
import BaseComponent from './BaseComponent.vue';
import AlternativeComponent from './AlternativeComponent'

it('未傳入內容', () => {
  const wrapper = mount(BaseComponent);
  expect(wrapper.html()).toBe("<div></div>");
});

it('當 slot 傳入內容', () => {
  const wrapper = mount(BaseComponent,()=>{
    slots: {
      default: '<p>Slot</p>' // 方法一
      default: h('div','Slot') // 方法二
      default: { template: '<p>Slot</p>'} // 方法三
      default: AlternativeComponent// 方法四
    }
  });
  expect(wrapper.html()).toMatchInlineSnapShot("<div><p>Slot</p></div>");
});
```

#### 具名插槽（Named Slots）

```vue
<!-- BaseComponent -->
<template>
  <div>
    <slot name="header"></slot>
    <slot name="body"></slot>
    <slot name="footer"></slot>
  </div>
</template>
```

```js{10-14}
import BaseComponent from './BaseComponent.vue';

it('未傳入內容', () => {
  const wrapper = mount(BaseComponent);
  expect(wrapper.html()).toBe("<div></div>");
});

it('當 slot 傳入內容', () => {
  const wrapper = mount(BaseComponent,()=>{
    slots: {
      header: '開頭:',
      body: '中間，',
      footer: '結尾。'
    }
  });
  expect(wrapper.html()).toMatchInlineSnapShot("<div>開頭:中間，結尾。</div>");
});
```

#### 作用域插槽（Scoped Slots）

常見於 UI Library 所提供的 `Table` or `Model` 元件，讓開發者可自行調整資料格式。

```vue
<!-- BaseComponent -->
<template v-for="info in infoList" :key="info.name">
  <details>
    <summary>
      <slot name="title" :profile="info">
        {{ info.name }} : {{ info.age }} 歲，
      </slot>
    </summary>
    <slot name="body" :profile="info"> 興趣是：{{ info.interest }}。</slot>
  </details>
</template>

<script setup>
import { ref } from 'vue';
const infoList = ref([
  {
    name: 'John Doe',
    age: '26',
    interest: '爬山',
  },
  {
    name: 'Jane Doe',
    age: '26',
    interest: '游泳',
  },
]);
</script>
```

基本測試案例：

```js{17-25}
// 未傳入內容
it('未傳入內容', () => {
  const wrapper = mount(BaseComponent);
  expect(wrapper.html()).toMatchInlineSnapShot('
  <details>
    <summary>John Doe:26歲，</summary>興趣是：爬山。
  </details>
  <details>
    <summary>Jane Doe:26歲，</summary>興趣是：游泳。
  </details>
  ');
});

// 當 slot 傳入內容
it('當 slot 傳入內容',() => {
  const wrapper = mount(BaseComponent, () => {
    slots: {
      title:`<template #profile="scope">
        {{ scope.name }} 的介紹
      </template>`,
      body:`<template #profile="scope">
        <div> 年齡：{{ scope.age }} 歲</div>
        <div> 興趣：{{ scope.interest }} </div>
      </template>`
    }
  })

  expect(wrapper.html().toMatchInlineSnapShot(
    "<details>
      <summary>John Doe的介紹</summary>
      <div>年齡：26歲</div>
      <div>興趣：爬山</div>
    </details>
    <details>
      <summary>Jane Doe的介紹</summary>
      <div>年齡：26歲</div>
      <div>興趣：游泳</div>
    </details>"
  ))
})
```

### Custom Directives (客製化指令)

須確認已安裝 `jsdom` 套件。

```vue
<!-- DOM 環境 -->
const dom = document.body

<!-- vue custom directive -->
const VFocus = { mounted(el) { el.focus() } };

<!-- 測試目標 : BaseComponent -->
<template>
  <div>
    <input data-test="target" v-focus />
  </div>
</template>
```

測試案例 :

```js{3-8}
it('使用 v-focus 指令時，載入後應有聚焦效果', () => {
  const wrapper = mount(BaseComponent,()=>{
    attachTo: dom,
    global: {
      directives: {
        Focus: VFocus
      }
    }
  })

  console.log(dom.innerHTML) // <div data-v-app=""><input></input data-test="target" /></div>
  expect(wrapper.find('[data-test="target"]').element).toBe(document.activeElement)
});
```

---

**來源：** [Vue.js 3前端測試入門從這裡開始](https://www.drmaster.com.tw/bookinfo.asp?BookID=MP22333)
