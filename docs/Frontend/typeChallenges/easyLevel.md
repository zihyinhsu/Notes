---
date: 2024-05-13
title: 'Easy Level'
author: Zihyin Hsu
category: Frontend
tags:
  - Typescript
---

# Easy Level

## [Pick](https://github.com/type-challenges/type-challenges/blob/main/questions/00004-easy-pick/README.zh-CN.md)

思路：

1. in Operator
   > 用於檢查一個物件是否包含特定的屬性，或者可遍歷聯合型別(Union Types)的值。

```ts
interface Car {
  brand: string;
  year: number;
}

let myCar: Car = {
  brand: 'Toyota',
  year: 2005,
};

if ('brand' in myCar) {
  console.log('My car has a brand.');
}
```

```ts
type T = 'a' | 'b' | 'c';

type resultObj = {
  [key in T]: number;
};
```

2. Keyof Type Operator

> 用於獲取一個物件類型內所有 key 的聯合型別。

```ts
interface Bag {
  brand: string;
  year: number;
  color: string;
}

type BagKeys = keyof Bag; // "brand" | "year" | "color"
```

3. Indexed Access Types
   > 用於取出物件類型的值。

```ts
interface result {
  id: number;
}

type resultId = resultObj['id']; // number
```

解答：

```ts
type MyPick<T, K extends T> = {
  [key in K]: T[key];
};
```

## [ReadOnly](https://github.com/type-challenges/type-challenges/blob/main/questions/00007-easy-readonly/README.zh-CN.md)

> `readonly` 用於讓物件的屬性變成唯讀，不能修改。

```ts
type MyReadonly<T> = {
  readonly [key in keyof T]: T[key];
};
```

## [Tuple](https://tsch.js.org/11/zh-CN)

> `T[number]` 可以取出 T 中所有 Key 的聯合類型。

```ts
type TupleToObject<T extends readonly any[]> = {
  [P in T[number]]: P;
};
```

## [First](https://github.com/type-challenges/type-challenges/blob/main/questions/00014-easy-first/README.zh-CN.md)

> 以下表示，若Ｔ為一個空陣列，就永遠不會返回值，若非空陣列，就取第一個值。

```ts
type First<T extends any[]> = T extends [] ? never : T[0];
```

---

**參考** ：

1. [type-challenges](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md)
2. [从TS类型体操入手，学习TS](https://juejin.cn/post/7265996663406968844)
