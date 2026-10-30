// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://protoplain.com',
  i18n: {
    defaultLocale: 'zh-tw',
    locales: ['zh-tw', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  image: {
    // 封面與內頁圖一律輸出 WebP；原圖留在雲端硬碟／NAS，不進 repo
    layout: 'constrained',
  },
  integrations: [
    // sitemap-index.xml 只列正式建置的頁面（draft 不會產生頁面，自然不在內）
    sitemap({
      filter: (page) => !page.endsWith('/404/'),
      i18n: {
        defaultLocale: 'zh-tw',
        locales: { 'zh-tw': 'zh-Hant-TW', en: 'en' },
      },
    }),
  ],
});
