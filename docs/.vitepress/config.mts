import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Zihyin's Notes",
  // description: '有滋有味的觀劇雜感中夾雜了一點技術文',
  base: '/',
  lang: 'zh-TW',
  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    [
      'script',
      { src: 'https://cdn.staticfile.org/twikoo/1.6.32/twikoo.all.min.js' },
    ],
    ['meta', { name: 'robots', content: 'all' }],
    [
      'meta',
      {
        name: 'google-site-verification',
        content: 'MAsRVd0cCvMOIXcm7Ekm9Bdzi2OUS0hAO78NDahhLGM',
      },
    ],
  ],
  sitemap: {
    hostname: 'https://zihyin-notes.vercel.app',
    lastmodDateOnly: false,
    // transformItems: (items) => {
    //   items.push({
    //     url: '/AboutMe/readme.html',
    //     changefreq: 'daily',
    //     priority: 0.8,
    //   });
    //   return items;
    // },
  },

  markdown: {
    image: {
      // 圖片懶加載
      lazyLoading: true,
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    lastUpdated: {
      text: '最後更新於',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short',
      },
    },
    outline: 'deep',
    editLink: {
      pattern: 'https://github.com/zihyinhsu/Notes/edit/main/docs/:path',
      text: '在 GitHub 編輯此頁面',
    },
    search: {
      provider: 'local',
    },
    logo: '/logo.svg',
    footer: {
      // message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Zihyin Hsu',
    },
    nav: [
      { text: 'About', link: '/AboutMe/readme' },
      { text: 'Frontend', link: '/Frontend/index' },
      { text: 'DevOps', link: '/DevOps/index' },
    ],
    sidebar: {
      '/AboutMe/': [
        {
          text: 'About',
          items: [
            {
              text: 'README',
              link: '/AboutMe/readme',
            },
            {
              text: '劇集觀後感',
              link: '/DramaReview/index',
            },
          ],
        },
      ],
      '/Frontend/': [
        {
          text: '關於前端',
          items: [
            {
              text: 'Javascript',
              collapsed: true,
              items: [
                { text: '閉包', link: '/Frontend/javascript/closure' },
                { text: '事件循環', link: '/Frontend/javascript/eventloop' },
                {
                  text: 'require & import 的差異',
                  link: '/Frontend/javascript/require&import',
                },
              ],
            },
            {
              text: 'Type-Challenges',
              collapsed: true,
              items: [
                {
                  text: 'Easy Level',
                  link: '/Frontend/typeChallenges/easyLevel',
                },
                {
                  text: 'type predicates',
                  link: '/Frontend/typeChallenges/typePredicates',
                },
              ],
            },
            {
              text: 'Vue',
              collapsed: true,
              items: [
                {
                  text: 'Vue3 為何用 Proxy 替代 defineProperty?',
                  link: '/Frontend/vue/proxy',
                },
                {
                  text: '虛擬 Dom & Diff 算法',
                  link: '/Frontend/vue/virtualDom＆Diff',
                },
              ],
            },
            {
              text: 'Nuxt 3',
              collapsed: true,
              items: [
                {
                  text: 'SSR、CSR、SSG',
                  link: '/Frontend/nuxt3/renderMode',
                },
              ],
            },
          ],
        },
        {
          text: '讀書筆記',
          items: [
            {
              text: 'Vue 前端測試',
              collapsed: true,
              items: [
                { text: '單元測試', link: '/Frontend/vitest/unitTest' },
                { text: '元件測試', link: '/Frontend/vitest/componentTest' },
                {
                  text: '控制測試環境',
                  link: '/Frontend/vitest/testEnvControl',
                },
                {
                  text: 'vue Ecosystem',
                  link: '/Frontend/vitest/vueEcosystem',
                },
              ],
            },
            {
              text: 'Vue.js 設計與實踐',
              collapsed: true,
              items: [
                {
                  text: '框架設計概覽',
                  link: '/Frontend/vue/vueDesignAndImplement/Day1',
                },
              ],
            },
          ],
        },
      ],
      '/DevOps/': [
        {
          text: '關於 DevOps',
          items: [
            {
              text: 'gitLab CICD',
              // collapsed: true,
              items: [
                { text: 'Day 1', link: '/DevOps/gitLabCICD/Day1' },
                { text: 'Day 2', link: '/DevOps/gitLabCICD/Day2' },
                { text: 'Day 3', link: '/DevOps/gitLabCICD/Day3' },
                { text: 'Day 4', link: '/DevOps/gitLabCICD/Day4' },
              ],
            },
          ],
        },
      ],
      '/DramaReview/': [
        {
          text: '劇集觀後感',
          items: [
            {
              text: '台劇',
              collapsed: true,
              items: [
                {
                  text: '不夠善良的我們',
                  link: '/DramaReview/TaiwanDrama/ImperfectUs/ep1-8',
                },
              ],
            },
            {
              text: '韓劇',
              collapsed: true,
              items: [
                {
                  text: '背著善宰跑',
                  link: '/DramaReview/KoreaDrama/LovelyRunner/ep1-16',
                },
              ],
            },
          ],
        },
      ],
    },

    // socialLinks: [{ icon: 'github', link: 'https://github.com/zihyinhsu' }],
  },
});
