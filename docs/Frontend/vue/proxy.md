---
date: 2024-04-21
title: 'Vue3 為何用 Proxy 替代 defineProperty?'
author: Zihyin Hsu
category: vue
tags:
  - vue
---

# Vue3 為何用 Proxy 替代 defineProperty?

## Object.defineProperty 實現雙向綁定

> 定義：用於直接在一個物件上定義一個新屬性，或者修改一個物件的現有屬性，並返回該物件。

Object.defineProperty 透過為每個屬性添加 `getter`、`setter` 來實現響應式：

```js
let person = {
  firstName: 'John',
  lastName: 'Doe',
};
Object.defineProperty(person, 'fullName', {
  get: function () {
    return `${this.firstName} ${this.lastName}`;
  },
  set: function (value) {
    [this.firstName, this.lastName] = value.split(' ');
  },
});

console.log(person.fullName); // 輸出：John Doe

person.fullName = 'Jane Smith';

console.log(person.fullName); // 輸出：Jane Smith
console.log(person.firstName); // 輸出：Jane
console.log(person.lastName); // 輸出：Smith
```

### defineProperty 的限制

---

#### 性能負擔

當我們的物件中有多個key，我們就需要進行 **遍歷** ; 又或者物件的屬性中存在嵌套（一層一層波動拳），我們就需要進行 **深度監聽** 與 **遞歸** 來為每一個屬性添加 getter 和 setter，以上操作都會造成性能上的負擔。

#### 無法檢測到物件屬性的添加和刪除

如同定義所說，它主要是用於 **定義** 或 **修改** 一個物件的屬性，而非屬性的添加和刪除。若想監聽到屬性的添加和刪除，須透過 ES6 的 Proxy 來實現。

#### 無法監聽陣列變化

因為 `Object.defineProperty` 只有在物件屬性被定義或修改時才會觸發，而非被陣列的變化觸發。

對於以上問題， Vue2 透過 hack 陣列方法，規定只監聽 `push`、`pop`、`shift`、`unshift`、`splice`、`sort` 和 `reverse` 等以上七種方法造成的陣列變化。若想直接透過索引改變元素的值（如 array[0] = 'new value'），就需要透過其他方法輔助（如：set、delete）。

## Proxy 實現雙向綁定

Proxy 的原意是代理。我們可以簡單理解成 :

> 我們可以透過 Proxy 對物件進行攔截，外界對物件的任何操作都要通過 Proxy，而 Proxy 也可以對外界的操作進行過濾與改寫。

Proxy 的操作方法多達 13 種，可以代理一整個物件，並且返回一個新的物件(所以不會修改到原物件)。

```
語法 : var proxy = new Proxy(target, handler);
```

Proxy 提供兩個參數，分別為 :

1. target(目標)：可以是陣列、物件或函式。
2. handler(操作) : target 的操作行為 ( 比如 get,set )
   由於 handler 的操作方法實在太多了，詳情可見這裡
   以下來看兩個例子 :

我們必須針對 Proxy 的實例進行操作，才能使 Proxy 起作用。

```js
var proxy = new Proxy(
  {},
  {
    get: function (target, propKey) {
      return 35;
    },
  },
);

proxy.time; // 35
proxy.name; // 35
proxy.title; // 35
```

如果我們在 handler 沒有設置攔截的行為，那外界的操作就會直達原物件。

```js
var target = {};
var handler = {}; // 因為 handler 是空物件，所以操作 Proxy = 操作原物件。
var proxy = new Proxy(target, handler);
proxy.a = 'b';
target.a; // "b"
```

那我們如何透過 Proxy 實現雙向綁定呢? 一樣是使用 get / set 方法 :

```js
let target = {
  myName: 'Yin',
};
const proxy = new Proxy(target, {
  get: (target, key, receiver) => {
    console.log('get:', target, key, receiver);
    // 這裡的 key 是指物件的 key
    return target[key]; //所以 return 的是值
  },
  set: (target, prop, newValue, receiver) => {
    console.log('set:', target, key, newValue, receiver);
    target[prop] = value;
    return true;
  },
});
```

我們實際上是操作代理 data 的 Proxy 物件，而非直接修改原物件。當修改一個對象的屬性時，Proxy 會攔截這個操作，並通知 Vue 數據已經變化，然後 Vue 會隨之更新視圖。

### 所以，Vue3 為何用 Proxy 替代 defineProperty?

---

#### 解決了監聽陣列與監聽物件新增、刪除問題

`Proxy` 的 handler 可以定義各種陷阱（trap），以監聽到物件、陣列的所有變動。因此無論是直接透過索引修改陣列元素的值，還是直接修改陣列的長度，這些變化都可以被 `Proxy` 所捕獲。

#### 效能提升

如上，由於透過 `Proxy` 的陷阱可以監聽到物件、陣列的所有變動，不需要像 `Object.defineProperty` 一樣為每個屬性逐一加上 get 和 set，免去了 **遍歷** 與 **遞歸** 帶來的性能負擔。

---

**參考資料：**

1. [面试官：Vue3.0里为什么要用 Proxy API 替代 defineProperty API ？](https://vue3js.cn/interview/vue3/proxy.html#%E4%B8%80%E3%80%81object-defineproperty)
2. [不只懂 Vue 語法：Vue 3 如何使用 Proxy 實現響應式（Reactivity）？](https://ithelp.ithome.com.tw/articles/10264271)
