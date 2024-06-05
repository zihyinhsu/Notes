---
date: 2024-06-04
title: 'gitLab CI/CD'
author: Zihyin Hsu
category: frontend
tags:
  - gitLabCICD
---

# gitLab CI/CD - 專案演練

來這邊 clone 這個 [測試專案](https://gitlab.com/kaochenlong/shopping-cat-v2.git)，跟著龍哥的 readme 來跑一次，首先要先在 mac 下載 deno，然後把它 run 起來。

```js
brew install deno
```

## 設定 Pipeline

到 gitlab 新增一個專案，把 clone 下來的 code 上傳到此專案內，並且在根目錄新增 `.gitlab-ci.yml`。

::: info
載下來的時候，其實就已有該檔案，但為練習用，我這裡會把它刪掉，跟著步驟做一次加深記憶～
:::

![createProject](img/createProject.png)

```yml
# 定義兩個 stages
stages:
  - testing
  - build

# job
run-test:
  stage: testing
  script:
    - deno test
```

上傳之後會跳出錯誤。因為此時使用的是預設的 Executor，而這個預設的 Executor 裡並不包含 deno。

![wrongImage](img/wrongImage.png)

於是我們可以來到 [deckerhub](https://hub.docker.com/r/denoland/deno) 找到 deno 的 image，在 yml 檔裡面指定它。

```yml{9}
# 定義兩個 stages
stages:
  - testing
  - build_image

# job
run-test:
  stage: testing
  image: denoland/deno:latest
  script:
    - deno test
```

![rightImage](img/rightImage.png)

## 把專案打包成 Docker Image

首先在根目錄新增一個 Dockerfile。來到 [deno 的 deckerhub tags](https://hub.docker.com/r/denoland/deno/tags)，找到 alpine 的固定版本，這裡選擇 `alpine-1.26.0` 這個版本。

```dockerfile
# 指定基礎的 image 檔
FROM denoland/deno:alpine-1.26.0

# 設定了工作目錄為 /app
WORKDIR /app

# 將當前目錄的所有檔案和目錄複製到容器的 /app 目錄。
COPY . /app

# 指定 8000 port
EXPOSE 8000

# 執行 deno 的指令，會預先下載和編譯 main.ts 檔案的所有依賴，以改善容器啟動時的性能。
RUN deno cache main.ts

# 指定了容器啟動時要執行的指令。
CMD [ "run", "--allow-all", "main.ts" ]
```

```bash
# 根據 dockerfile 建立 image
# hellocat 為 自訂的 dockerImageName
docker build -t hellocat .

# 找到剛剛建立的 image
docker images | grep hellocat
```

新增一個 `.dockerignore` 檔案，指定哪些檔案在建立 image 時，應該被 Docker 忽略。(用法和 `gitignore` 一樣)

```dockerignore
.dockerignore
Dockerfile
.vscode/
.gitlab-ci.yml
README.md
.git/
```

如此，在執行到 `WORKDIR /app` 時，就會忽略以上檔案或目錄到 `/app` 了，可以有效減少 image 的大小。

接著把這個 image run 起來：

```bash
# 代表我們可以透過訪問本地的 8000 port 來訪問容器的 8000 port
docker run -p 8000:8000  hellocat
```

此時我們可以透過修改 yml 檔，讓 CI 可以進行打包。不過就這樣再跑一次 CI 的話還是會報錯，因為用的還是 gitlab 預設的 shared runner，而 shared runner 本身不包含 docker，所以才會出錯。

以下我們有兩種方式來解決：

#### 在本地自建 runner

因此我們可以 [在本地自建 runner](/Frontend/gitLabCICD/Day2.html#註冊-gitlab-runner)，然後 executor 選擇 `shell`。(可以用 which docker 檢查 shell 是否有包含 docker)

![catRunner](img/catRunner.png)

```yml{14-15,18-19}
# 定義兩個 stages
stages:
  - testing
  - build

# job
run-test:
  stage: testing
  script:
    - deno test

build-docker-image:
  # 指定自建 runner 的 tags
  tags:
    - shell
  stage: build
  # 只有當 run-tests有過才會跑 build-docker-image
  needs:
    - run-tests
  script:
    - docker build -t hellocat .
```

#### 指定預設的 shared runner

我們可以指定 gitlab 預設有包含 docker 的 shared runner，並使用 `services` 來定義 job 需要的服務。這些服務會在 job 開始時啟動，並在 job 結束時停止。

```yml{16-17,19,21-22,24-25}
# 定義兩個 stages
stages:
  - testing
  - build

# job
run-test:
  stage: testing
  image: denoland/deno:latest
  script:
    - deno test

build-docker-image:
  stage: build
  # 指定 shared runner 的 tags
  tags:
    - gitlab-org-docker
  # 指定 docker 的 image
  image: docker:latest
  # 允許在 Docker 容器內運行 Docker。(dind = docker in docker)
  services:
    - docker:dind
  # 只有當 run-tests有過才會跑 build-docker-image
  needs:
    - run-test
  script:
    - docker build -t hellocat .
```

## 推上 Docker Registry

## 自動遞增 Image 版號

---

**來源：** [為你自己學 GitLab CI/CD](https://www.youtube.com/watch?v=htTkPwGsT48&list=PLBd8JGCAcUAEwyH2kT1wW2BUmcSPQzGcu&index=14&ab_channel=%E9%AB%98%E8%A6%8B%E9%BE%8D)
