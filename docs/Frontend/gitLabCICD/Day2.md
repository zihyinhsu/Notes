---
date: 2024-05-12
title: 'gitLab CI/CD'
author: Zihyin Hsu
category: frontend
tags:
  - gitLabCICD
---

# gitLab CI/CD

## gitLab CI & Docker Image

可以使用 `image` 指定 Docker Image 的版本。

```yml{7}
stages:
  - linter
  - testing
  - build
  - deploy

image: alpine:latest // alpine 最新的版本。
```

![dockerImage](img/dockerImage.png)

放在 script 裡面的話，就只會在 script 裡面跑。

```yml
run_ruby_scripts:
  image: ruby:3.1.2-alpine3.16
  stage: testing
  script:
    - ruby -v
    - ruby -e "puts 'Hello world'"
```

![rubyScript](img/rubyScript.png)

## Runner & Executor

### Runner

> 居於 gitlab 與 Executor 之間的協調角色。

<!-- 這通常指的是一種工具或程式，它的工作是執行或運行其他的程式碼或腳本。例如，一個測試 Runner 就是用來執行測試程式碼的工具。 -->

::: info
一般來說，gitlab 都有自己的 Runner 可用，除非我們想自建 Runner。
:::

![runner](img/runner.png)

### Executor

> 主要的執行角色

<!-- 這通常指的是一種在特定的環境或條件下執行程式碼的實體。例如，在 Java 的並行程式設計中，一個 Executor 可以管理一個執行緒池，並控制這些執行緒如何並行地執行任務。 -->

![executor](img/executor.png)

### 在本機自建 gitlab runner

可根據 [Install Gitlab Runner](https://docs.gitlab.com/runner/install/) 安裝適合自己電腦的版本。

```js
sudo curl --output /usr/local/bin/gitlab-runner "https://s3.dualstack.us-east-1.amazonaws.com/gitlab-runner-downloads/latest/binaries/gitlab-runner-darwin-arm64"
```

給予 permission 去執行。

```
sudo chmod +x /usr/local/bin/gitlab-runner
```

```
gitlab-runner install
gitlab-runner start
```

#### 註冊 gitlab-runner

在 gitlab 上的路徑：設定 > CICD > Runners

```
gitlab-runner register // 該指令未來可能被棄用
https://gitlab.com/  // 如果是自建就輸入自建的 url
glrt-TSyCyg5aLnudBiLsqncE  // 輸入 gitlab-runner 的 token
shell // 這裡就端看自己要執行哪個 executor
```

![testRunner](img/testRunner.png)

#### 為流程指定 gitlab-runner

```js{3}
run_unit_tests:
  tags:
    - testRunner //指定 runner
  stage: testing
  script:
    - echo "執行單元測試"
    - uname
```

![runner result](img/runnerResult.png)

## Group runner

一個群組裡面可以包含好幾個專案，而一個 Group runner 可以供同一群組內的專案共同使用。
進入群組後，找到 `一般` > `CICD`。

![GroupCICD](img/groupCICD.png)

::: info
[官方對於 group runners 的說明](https://docs.gitlab.com/ee/ci/runners/runners_scope.html#group-runners)，提到利用令牌新增 runner 的方式已棄用。
:::

::: danger 疑問
目前個人測試開啟 `群組` 的 `CICD` 頁面時，發現沒有地方可以給我新增 group Runner，此項待研究。
:::
![GroupRunner](img/groupRunner.png)

**來源：** [為你自己學 GitLab CI/CD](https://www.youtube.com/watch?v=tcW7rSh_gGI&list=PLBd8JGCAcUAEwyH2kT1wW2BUmcSPQzGcu&index=9&ab_channel=%E9%AB%98%E8%A6%8B%E9%BE%8D)
