// 作品頁的「數位構築／組裝說明書／照片」三個區塊。只有列在這裡的作品才會出現這些區塊。
// 模型與 PDF 放在 public/works/<slug>/；說明書逐頁圖與照片放在作品資料夾，由 Astro 轉成 WebP。
import type { ImageMetadata } from 'astro';

export interface BuildStep {
  no: string;
  zh: string;
  en: string;
  detail: string;
  count: string;
  /** 這一步在說明書的頁碼（1 起算） */
  page: number;
}

export interface GalleryItem {
  src: ImageMetadata;
  caption: string;
  /** render 會標「情境模擬」，不能當作實景照片 */
  kind: 'photo' | 'render';
}

export interface Build {
  model: {
    meta: string;
    bin: string;
    /** 下載量，載入按鈕上顯示 */
    size: string;
    /** 構件類別 → 名稱，滑過構件時顯示 */
    labels: Record<string, string>;
    note: string;
  };
  steps: BuildStep[];
  manual: {
    pdf: string;
    size: string;
    version: string;
    pages: ImageMetadata[];
    note: string;
  };
  gallery: GalleryItem[];
}

type Glob = Record<string, { default: ImageMetadata }>;
const sorted = (g: Glob) => Object.keys(g).sort().map((k) => g[k].default);

const blp = {
  manual: sorted(import.meta.glob<{ default: ImageMetadata }>('../content/works/bamboo-light-pavilion/manual/*.jpg', { eager: true })),
  gallery: sorted(import.meta.glob<{ default: ImageMetadata }>('../content/works/bamboo-light-pavilion/gallery/*.jpg', { eager: true })),
};

export const builds: Record<string, Build> = {
  'bamboo-light-pavilion': {
    model: {
      meta: '/works/bamboo-light-pavilion/model.json',
      bin: '/works/bamboo-light-pavilion/model.bin',
      size: '2.6 MB',
      labels: {
        pier: '預鑄墩座', floor: '地板模組', frame: 'A 字竹柱', j1: 'J1 柱頂接合鋼板', cap: 'J2 梁柱接合件',
        beam: '雙竹縱梁', chord: '角側弦組', rod: '中央螺桿', purlin: '木檁條', roof: '屋頂板', table: '桌面',
      },
      note: '模型由 Archicad 經 Lumion LiveSync 匯出（2026-10-22），簡化為網頁網格，不含之後的接頭修改。組裝順序為示意，不是施工計畫。',
    },
    steps: [
      { no: '01', zh: '基礎', en: 'Footings', detail: '預鑄墩座，柱腳鉸座同步就位', count: '12', page: 12 },
      { no: '02', zh: '地板', en: 'Floor', detail: '中央兩片，再四角四片', count: '6', page: 13 },
      { no: '03', zh: 'A 字竹柱', en: 'A-frames', detail: '孟宗竹雙腳柱，由上方落下', count: '6', page: 14 },
      { no: '04', zh: '接合五金', en: 'Connectors', detail: 'J1 柱頂接合鋼板、J2 梁柱接合件', count: '6+6', page: 16 },
      { no: '05', zh: '縱梁', en: 'Beams', detail: '雙竹縱梁，孟宗竹', count: '3', page: 17 },
      { no: '06', zh: '抗剪組合梁', en: 'Shear trusses', detail: '每跨四組弦組，中央螺桿最後串起', count: '8+2', page: 18 },
      { no: '07', zh: '木檁條', en: 'Purlins', detail: '高簷往低簷，同列兩段一起', count: '24', page: 20 },
      { no: '08', zh: '屋頂板', en: 'Roof panels', detail: '由西往東', count: '10', page: 21 },
      { no: '09', zh: '桌面', en: 'Table', detail: '沿柱列滑入兩層繫材之間', count: '1', page: 22 },
    ],
    manual: {
      pdf: '/works/bamboo-light-pavilion/assembly-manual-v03.pdf',
      size: '4.4 MB',
      version: 'v03｜2026.10',
      pages: blp.manual,
      note: '說明書為組裝示意，不是施工圖。開工前請依現場狀況複核並調整。',
    },
    gallery: [
      { src: blp.gallery[0], caption: '挑選竹材', kind: 'photo' },
      { src: blp.gallery[1], caption: '整理竹材', kind: 'photo' },
      { src: blp.gallery[2], caption: '竹材表面處理', kind: 'photo' },
      { src: blp.gallery[3], caption: '鋼構件鑽孔', kind: 'photo' },
      { src: blp.gallery[4], caption: '地板骨架組裝', kind: 'photo' },
      { src: blp.gallery[5], caption: '鋪設地板', kind: 'photo' },
      { src: blp.gallery[6], caption: '市集', kind: 'render' },
      { src: blp.gallery[7], caption: '戶外瑜伽', kind: 'render' },
      { src: blp.gallery[8], caption: '露營', kind: 'render' },
    ],
  },
};
