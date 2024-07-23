---
date: 2024-07-14
title: '整合 Prisma'
author: Zihyin Hsu
category: Frontend
tags:
  - Nuxt3
---

# 整合 Prisma

Prisma 是一個開源的 ORM（物件關係映射）工具，用於 Node.js 和 TypeScript 應用程序。它提供了一種方便、高效的方式來操作資料庫。

## 安裝 Prisma

```bash
pnpm install prisma --save-dev
npx prisma init
```

接著我們可以在產生出的 `schema.prisma` 來定義資料欄位。

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Products {
  id         Int      @id @default(autoincrement())
  title      String
  description String
  image      String
  category   String
  price      Int
  created_at DateTime? @default(now()) @db.Timestamptz(6)
}
```

## 資料庫遷移

然後輸入以下指令，以便根據 schema.prisma 來生成 Prisma Client。

```bash
npx prisma generate
```

接著透過以下指令，創建和遷移應用到開發資料庫上。遷移成功後，這個命令還會自動執行 prisma generate，以確保 Prisma Client是匹配最新的資料庫結構，方便管理資料庫結構的變更。

::: warning
需確認 `DATABASE_URL` 中的 port 為 5432 (因 postgres 的預設 port 為 5432)。

postgresql://postgres.aikkoilftwougwymplvd:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres
:::

```bash
npx prisma migrate dev --name init
```

回到 supabase 就可以看到已建立的 product schema 了。

![product_schema](img/product_schema.png)

## 資料庫初始化

接著在 prisma 資料夾內加上 seed.js，並在 package.json 加上 `prisma-seed` 指令。

通常 `prisma/seed.js` 是拿來做資料庫初始化的相關設定，這裡試著直接打一個 api 並且把 fetch 的資料傳進資料庫。

::: code-group

```json [package.json]
"scripts": {
  "prisma-seed": "node prisma/seed.js"
},
```

```js [prisma/seed.js]
import { PrismaClient } from '@prisma/client';
import { $fetch } from 'ofetch';

const prisma = new PrismaClient();
const productsURL = 'https://fakestoreapi.com/products';

async function seedProducts() {
  const products = await $fetch(productsURL);
  try {
    const productsArray = [];
    products.forEach((product) => {
      productsArray.push({
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
      });
    });
    await prisma.Products.createMany({
      data: productsArray,
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();
```

:::

```bash
pnpm prisma-seed
```

![database](img/database.png)

## 坑點紀錄

要部署到正式環境時，記得在 build 指令上也新增 `prisma generate`，如此每次部署時才會匹配最新的資料庫結構。

```json
"scripts": {
  "build": "prisma generate && nuxt build",
},
```

---

**參考資料：**

1. [Prisma/docs](https://www.prisma.io/docs/getting-started/quickstart)
