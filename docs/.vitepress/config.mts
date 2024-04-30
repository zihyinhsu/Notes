import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Zihyin's Notes",
  description: '有滋有味的觀劇雜感中夾雜了一點技術文',
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
                { text: 'Day 1', link: '/Frontend/gitLabCICD/CICD-Day1' },
              ],
            },
            {
              text: 'vitest 前端測試',
              collapsed: true,
              items: [
                { text: '單元測試', link: '/Frontend/vitest/unitTest' },
                { text: '元件測試', link: '/Frontend/vitest/componentTest' },
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
                  text: '背著善宰跑 EP1 - 8',
                  collapsed: true,
                  link: '/DramaReview/KoreaDrama/LovelyRunner/ep1-8',
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
