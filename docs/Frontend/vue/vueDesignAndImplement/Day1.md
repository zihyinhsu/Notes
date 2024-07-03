---
date: 2024-06-20
title: '框架設計概覽'
author: Zihyin Hsu
category: Frontend
tags:
  - Vue
---

# 框架設計概覽

## 權衡的藝術

### 命令式和聲明式

Vue 封裝了命令式的過程，對外暴露出了聲明式的結果。

| 命令式   | 聲明式   |
| -------- | -------- |
| 關注過程 | 關注結果 |

::: code-group

```js [命令式]
const button = document.getElementById('myButton');
button.addEventListener('click', function () {
  alert('Hello, Vue!');
});
```

```vue [聲明式]
<button @click="sayHello">點擊我</button>
```

:::

### 性能與可維護性的權衡

| 命令式             | 聲明式         |
| ------------------ | -------------- |
| 直接修改的性能消耗 | 找出差異＋修改 |
| 性能優             | 性能較差       |
| 可維護性較低       | 可維護性高     |

因為命令式是**直接修改的性能消耗**，而聲明式則是**找出差異＋修改**，因此 `命令式的性能會優於聲明式`。那麼為何 Vue 還要採用聲明式的寫法呢？因為聲明式的寫法相對簡潔的多，因此可維護性也較高，於是可得出 `聲明式的可維護性 > 命令式的可維護性`。

#### 原生 Javascript、innerHTML、虛擬 DOM 權衡比較

> 心智負擔：原生 Javascript > innerHTML > `虛擬 DOM`

> 性能： 原生 Javascript > `虛擬 DOM` > innerHTML

> 可維護性： `虛擬 DOM` > innerHTML > 原生 Javascript

| 原生 Javascript | `虛擬 DOM` | innerHTML    |
| --------------- | ---------- | ------------ |
| 心智負擔大      | 心智負擔小 | 心智負擔中等 |
| 可維護性低      | 可維護性高 | 可維護性中等 |
| 性能高          | 性能中等   | 性能差       |

因此 Vue 採用 `虛擬 DOM` 作為渲染的構建。

### 運行時和編譯時

| 運行時 runtime                                | 編譯時 compiler                  | 運行時+ 編譯時                                            |
| --------------------------------------------- | -------------------------------- | --------------------------------------------------------- |
| 利用 render 函數，直接把虛擬 DOM 轉成真實 DOM | 把 template 的內容轉化為真實 DOM | 先把 template 轉成 render 函數，再將虛擬 DOM 轉成真實 DOM |
| 沒有編譯過程，無法分析用戶提供的內容          | 理論上性能會更好                 | 編譯時：分析用戶提供內容;運行時：提供組夠的靈活性         |
|                                               | 如：Svelte                       | 如:Vue                                                    |

## 框架設計的核心要素

### 控制代碼體積

---

#### 環境變數

我們可以透過環境變數來判斷 **是否啟用某些僅在生產環境下所需的優化**，或者 **可根據環境變數進行 tree-shaking 和 code-splitting 來移除未被使用的代碼或模塊**。如此，我們就能根據不同環境生成體積更小的建構產物，進而提高加載速度與性能。

#### Tree-shaking

透過 ES Modules 的 `import` 與 `export` 可導入/導出模塊中的特定功能，而 Tree-shaking 依賴於 ES Modules 的靜態結構特性，因此構建工具（如 Webpack、Rollup）能夠在打包過程中分析出哪些代碼是被使用、或者未被使用的，從而 **實現移除未使用代碼** 的目的，減少應用的載入時間和性能提升。

### 輸出不同的構建產物

我們可以透過輸出不同的構建產物 ( package/vue/dist )，來應對不同的使用場景。

### 錯誤提示與處理

Vue 內部也透過統一的錯誤處理接口 CallWithErrorHandling 函式，來對 Vue 內部的錯誤進行統一處理。

### 提升用戶的開發體驗 與 良好的可維護性

Vue 已全面支援 TypeScript， 透過大量的類型判斷與處理，提升了開發體驗與效率。

## Vue 3 的設計思路

### 初始渲染器

渲染器的本質是 `createRenderer 的返回值` ( renderer Object )，而這個 renderer Object 內就包含了 `render 渲染函式`。

`renderer 渲染器` 主要接收兩個參數：`VNode 虛擬 DOM` 與 `container 掛載真實 DOM 的容器`，我們可以把 VNode 渲染成真實 DOM 並掛載到 container 上。

> **VNode (虛擬 DOM)**：這是一個描述應用界面的虛擬節點（VNode）。它是一個輕量級的對象，代表了 DOM 結構中的節點。

> **container (掛載真實 DOM 的容器)**：這是一個 DOM 元素，Vue 將使用這個元素作為根容器，將虛擬 DOM 渲染成真實 DOM 並掛載到這個容器中。

### 元件的本質

在 Vue 的內部渲染中，本質上是大量的元件渲染。而元件本身就是 **一組 DOM 的集合**，因此 Vue 本質上是以元件為介質，**渲染一組一組的 DOM** 來完成渲染。

### 模板 (template) 的工作原理

---

#### 聲明式的模板描述

template 模板在被編譯器編譯後，會形成渲染函式 ( render )。

```html
<div :id="tId" :class="{ tClass:true }" @click="onTClick"></div>
```

#### 命令式的 render 函式

```js
import { h } from 'vue';
export default {
  render() {
    return h('h1', { onClick: handler }); // 處理 DOM
  },
};
```

---

**來源：**

1. [一小时读完《Vue.js 设计与实现》](https://www.bilibili.com/video/BV1K24y1q7eJ/?spm_id_from=333.999.0.0&vd_source=bf9e31cbb04dcc9c09d7c5869df8ca09)
2. [Vue.js 設計與實現](https://www.tenlong.com.tw/products/9787115583864)
