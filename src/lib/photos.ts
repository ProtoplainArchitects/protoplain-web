// 作品照片：放在 src/content/works/<slug>/photos/，檔名決定分組與順序，不必另外登記。
//   done-01.jpg     完工；第一張就是作品頁封面
//   process-01.jpg  施工過程，依先後
//   render-01.jpg   情境模擬（算圖）；沒有完工照的作品，第一張當封面並標「情境模擬」
//   drawing-01.jpg  圖面與模型照
// 說明文字寫在 index.md 的 captions，例如 captions: { done-02: 一樓用餐空間 }；沒寫就不顯示。
// 有列在 src/data/builds.ts 的作品（有模型或說明書）照片仍由 builds.ts 管理。
import type { ImageMetadata } from 'astro';

export type PhotoGroup = 'done' | 'process' | 'render' | 'drawing';
export interface Photo { key: string; group: PhotoGroup; src: ImageMetadata }

const files = import.meta.glob<{ default: ImageMetadata }>('../content/works/*/photos/*.jpg', { eager: true });
const NAME = /\/works\/([^/]+)\/photos\/((done|process|render|drawing)-\d+)\.jpg$/;

const bySlug: Record<string, Photo[]> = {};
for (const path of Object.keys(files).sort()) {
  const m = path.match(NAME);
  if (!m) throw new Error(`照片檔名不符合規則（done|process|render|drawing-NN.jpg）：${path}`);
  (bySlug[m[1]] ??= []).push({ key: m[2], group: m[3] as PhotoGroup, src: files[path].default });
}

export const photosOf = (slug: string): Photo[] => bySlug[slug] ?? [];

import { builds } from '../data/builds';
import type { Work } from './works';

/** 作品的代表圖：完工第一張；沒有完工照用第一張情境模擬圖（render: true）；都沒有才用 cover.jpg */
export function heroOf(w: Work): { src: ImageMetadata; render: boolean } | null {
  const g = builds[w.id]?.gallery.find((x) => x.kind === 'photo' && x.group !== '施工過程' && x.group !== '圖面');
  if (g) return { src: g.src, render: false };
  const ps = photosOf(w.id);
  const done = ps.find((p) => p.group === 'done');
  if (done) return { src: done.src, render: false };
  const render = ps.find((p) => p.group === 'render');
  if (render) return { src: render.src, render: true };
  return w.data.cover ? { src: w.data.cover, render: w.data.coverKind === 'render' } : null;
}
