---
date: 2024-06-12
title: '框架設計概覽'
author: Zihyin Hsu
category: frontend
tags:
  - vue
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

## 框架設計的核心要素

## Vue 3 的設計思路

---

**來源：**

1. [一小时读完《Vue.js 设计与实现》](https://www.bilibili.com/video/BV1K24y1q7eJ/?spm_id_from=333.999.0.0&vd_source=bf9e31cbb04dcc9c09d7c5869df8ca09)
2. [Vue.js 設計與實現](https://www.tenlong.com.tw/products/9787115583864)
