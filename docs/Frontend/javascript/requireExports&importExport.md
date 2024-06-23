---
date: 2024-06-04
title: 'require & import 的差異'
author: Zihyin Hsu
category: frontend
tags:
  - vue
---

# require/exports & import/export 的差異

`require/exports` 和 `import/export` 是 JavaScript 中兩種不同的模塊系統。它們的主要差異包括語法、加載方式、以及使用場景。

## 語法差異：

`require/exports` 是 CommonJS 模塊規範的一部分，主要用於 Node.js。使用 require 來加載模塊，使用 module.exports 或 exports 來導出模塊。

`import/export` 是 ES6 (ECMAScript 2015) 引入的模塊化語法。使用 import 來加載模塊，使用 export 來導出模塊。

## 加載方式

`require/exports` 進行動態加載，即在運行時加載模塊。這允許根據條件動態導入模塊，但也意味著無法進行靜態優化。

`import/export` 進行靜態加載，即在解析時就確定模塊的依賴關係。這有助於進行樹搖（Tree Shaking）以去除未使用的代碼，優化最終的包大小。

## 使用場景

`require/exports` 廣泛用於 Node.js 環境中，適合於服務器端應用程序和工具的開發。

`import/export` 被設計用於瀏覽器和現代 JavaScript 應用程序，支持模塊化開發和前端工程化。

## 互操作性：

在一定條件下，Node.js 支持 import 語法來導入 CommonJS 模塊，但可能需要額外的配置或使用 .mjs 擴展名。
透過各種工具（如 Babel、Webpack），可以將使用 import/export 的代碼轉換為兼容舊瀏覽器的格式。
導出差異：

module.exports 和 exports 允許導出一個對象、函數、值等。如果需要導出多個值，通常封裝在一個對象中。
export 可以導出多個變量或函數，並且支持導出解構（exporting destructuring），使得導入時可以選擇性地加載所需部分。

## 總結

總結來說，require/exports 和 import/export 分別代表了 JavaScript 在不同時期對模塊化支持的演進。隨著 JavaScript 生態系統的成熟，import/export 正在成為更加普遍和推薦的模塊化解決方案。

---

參考資料： [【Javascript】Require 與 Import 的區別](https://wayne-blog.com/2023-02-22/js-require-vs-import/)
