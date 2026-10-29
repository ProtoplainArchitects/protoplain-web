// @ts-check
import { defineConfig } from 'astro/config';

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
});
