import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Zihyin's Notes",
  description: '有滋有味的觀劇雜感中夾雜了一點技術文',
  base: '/',
  lang: 'zh-TW',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    [
      'script',
      { src: 'https://cdn.staticfile.org/twikoo/1.6.32/twikoo.all.min.js' },
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
      { text: 'Drama-Review', link: '/DramaReview/index' },
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
          ],
        },
      ],
      '/Frontend/': [
        {
          text: '關於前端',
          items: [
            {
              text: 'gitLab CICD',
              collapsed: true,
              items: [
                { text: 'Day 1', link: '/Frontend/gitLabCICD/Day1' },
                { text: 'Day 2', link: '/Frontend/gitLabCICD/Day2' },
                { text: 'Day 3', link: '/Frontend/gitLabCICD/Day3' },
              ],
            },
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
                  collapsed: true,
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
                  collapsed: true,
                  link: '/DramaReview/KoreaDrama/LovelyRunner/ep1-16',
                },
              ],
            },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/zihyinhsu' }],
  },
});
