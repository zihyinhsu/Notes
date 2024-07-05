---
date: 2024-07-05
title: '測試 Testing'
author: Zihyin Hsu
category: Frontend
tags:
  - Nuxt3
---

# 測試 Testing

以下將使用 Vitest 作為測試框架。

## 安裝環境

```bash
pnpm i --save-dev @nuxt/test-utils @vue/test-utils vitest
```

在 package.json 設置 script：

```json{2}
  "scripts": {
    "test": "vitest"
  },
```

然後到 nuxt.config.ts 新增 module：

```ts{4}
// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/test-utils/module'],
});
```

## 配置 vitest.config.ts

```ts
import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    // 設置測試環境
    environment: 'nuxt',
    // 指定測試文件的位置
    include: ['test/**/*.test.ts'],
    // Nuxt.js 相關的配置
    globals: true,
    setupFiles: './test/setup.ts', // 該檔案用於配置測試環境，比如設置全局變數、配置 mock 函數
  },
});
```

## Vitest & Vue Test Utilities

可參考 [Vue 前端測試](/Frontend/vitest/unitTest.html) 系列。

## Nuxt Test Utilities

我們可以透過 Nuxt Test Utilities 非同步掛載元件，並透過 toMatchInlineSnapshot 顯示快照結果。

更多詳情可見 [官網](https://nuxt.com/docs/getting-started/testing#%EF%B8%8F-helpers) 解說

```ts
// tests/components/SomeComponents.nuxt.spec.ts
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { SomeComponent } from '#components';

it('can mount some component', async () => {
  const component = await mountSuspended(SomeComponent);
  expect(component.text()).toMatchInlineSnapshot(
    '"This is an auto-imported component"',
  );
});
```

---

**參考資料：**

1. [Testing](https://nuxt.com/docs/getting-started/testing)
