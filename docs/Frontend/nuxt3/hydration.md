---
date: 2024-06-25
title: 'Hydration'
author: Zihyin Hsu
category: frontend
tags:
  - Nuxt3
---

# Hydration

> 指的是在客戶端將從服務器接收的靜態 HTML 與 JavaScript 結合並渲染到網頁上的過程。

當瀏覽器首次從 server 端加載時，會透過 **「服務器端渲染」** 生成一個靜態的 HTML，當 HTML 被送到客戶端時，Nuxt 3 會使用客戶端的 JavaScript 來「觸發」或「重構」這些靜態內容，使頁面可以讓使用者進行互動，這個過程就是所謂的「Hydration」。

Hydration 使 Nuxt 3 能夠結合 SSR 或 SSG 的性能優勢（如 **更快的首次加載時間** 和 **更好的 SEO**）和 SPA 的豐富交互性。確保了即使在用戶的瀏覽器中禁用 JavaScript 的情況下，就算沒有交互性，客戶端仍然可以看到網頁的基本內容和布局。
