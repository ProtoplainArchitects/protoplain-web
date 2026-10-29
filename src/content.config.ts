import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 每件作品一個資料夾：src/content/works/<slug>/
//   index.md  中文內文 + 共用欄位（必填）
//   en.md     英文內文（選填，沒有就不產生英文頁）
//   cover.jpg 封面
const slugFromPath = ({ entry }: { entry: string }) => entry.split('/')[0];

const works = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/works', generateId: slugFromPath }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      titleEn: z.string().nullable(),
      subtitle: z.string().nullable(),
      year: z.number().int(),
      kind: z.enum(['work', 'exhibition']),
      axis: z.enum(['人文構築', '自然構築']).nullable(),
      location: z.string().nullable(),
      cover: image().optional(),
      // draft: true 的作品只在 npm run dev 看得到，不進正式建置
      draft: z.boolean().default(false),
      review: z.array(z.string()).default([]),
      legacy: z.object({ zh: z.string().url().nullable(), en: z.string().url().nullable() }).optional(),
    }),
});

const worksEn = defineCollection({
  loader: glob({ pattern: '*/en.md', base: './src/content/works', generateId: slugFromPath }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().nullable(),
  }),
});

export const collections = { works, worksEn };
