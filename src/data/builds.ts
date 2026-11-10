// 作品頁的「構築過程影片／數位構築／組裝說明書／照片」區塊。只有列在這裡的作品才會出現這些區塊。
// 模型與 PDF 放在 public/works/<slug>/；說明書逐頁圖與照片放在作品資料夾，由 Astro 轉成 WebP。
import type { ImageMetadata } from 'astro';
import ssPoster from '../content/works/stillness-seats/video-poster.jpg';

export interface BuildStep {
  no: string;
  zh: string;
  en: string;
  detail: string;
  count: string;
  /** 這一步在說明書的頁碼（1 起算）；沒有說明書的作品不填 */
  page?: number;
}

export interface GalleryItem {
  src: ImageMetadata;
  caption: string;
  /** render 會標「情境模擬」，不能當作實景照片 */
  kind: 'photo' | 'render';
  /** 分組：「施工過程」排進過程段；其餘實景照片排進完工段（第一張當作品頁封面，其餘進橫卷），「完工」以外的組名會標在說明前 */
  group: string;
}

export interface Build {
  model: {
    meta: string;
    bin: string;
    /** 下載量，載入按鈕上顯示 */
    size: string;
    /** 構件類別 → 名稱；模型構件自帶 name 時可省略 */
    labels?: Record<string, string>;
    /** 模型座標（m）中要移到原點的平面位置 [x, y] */
    center: [number, number];
    /** 初始視角與距離；target 為注視點高度（m） */
    view: { yaw: number; pitch: number; dist: number; target: number };
    /** 每一步構件落位前的位移 [dx, dy]（m），依步驟順序 */
    drops: [number, number][];
    /** 拆解時每一步之間拉開的高度（m） */
    gap: number;
    /** true：平滑著色（曲面多的模型）；false：平面著色 */
    smooth: boolean;
    note?: string;
  };
  steps: BuildStep[];
  manual?: {
    pdf: string;
    size: string;
    version: string;
    pages: ImageMetadata[];
    note: string;
  };
  gallery: GalleryItem[];
  /** 構築過程影片（YouTube）；按下播放才連到 YouTube */
  video?: {
    youtube: string;
    title: string;
    /** 片長，顯示用，例如 2:00 */
    length: string;
    poster: ImageMetadata;
    note: string;
  };
}

type Glob = Record<string, { default: ImageMetadata }>;
const sorted = (g: Glob) => Object.keys(g).sort().map((k) => g[k].default);

const bbp = sorted(import.meta.glob<{ default: ImageMetadata }>('../content/works/bamboo-bridge-pavilion/gallery/*.jpg', { eager: true }));

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
      center: [3.0, 2.4],
      view: { yaw: 0.72, pitch: 0.36, dist: 17.5, target: 1.5 },
      drops: [[0, -0.5], [0, 0.6], [0, 1.4], [0, 1.4], [0, 1.4], [0, 1.4], [0, 1.4], [0, 1.4], [2.2, 0]],
      gap: 0.95,
      smooth: false,
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
      { src: blp.gallery[0], caption: '挑選竹材', kind: 'photo', group: '施工過程' },
      { src: blp.gallery[1], caption: '整理竹材', kind: 'photo', group: '施工過程' },
      { src: blp.gallery[2], caption: '竹材表面處理', kind: 'photo', group: '施工過程' },
      { src: blp.gallery[3], caption: '鋼構件鑽孔', kind: 'photo', group: '施工過程' },
      { src: blp.gallery[4], caption: '地板骨架組裝', kind: 'photo', group: '施工過程' },
      { src: blp.gallery[5], caption: '鋪設地板', kind: 'photo', group: '施工過程' },
      { src: blp.gallery[6], caption: '市集', kind: 'render', group: '情境模擬' },
      { src: blp.gallery[7], caption: '戶外瑜伽', kind: 'render', group: '情境模擬' },
      { src: blp.gallery[8], caption: '露營', kind: 'render', group: '情境模擬' },
    ],
  },
  'bamboo-bridge-pavilion': {
    model: {
      meta: '/works/bamboo-bridge-pavilion/model.json',
      bin: '/works/bamboo-bridge-pavilion/model.bin',
      size: '2.6 MB',
      center: [9.63, 3.22],
      view: { yaw: 0.62, pitch: 0.2, dist: 26, target: 2.2 },
      drops: [[0, -1.2], [0, 2.5], [0, 1.6], [0, 1.6], [0, 1.6], [0, 1.6]],
      gap: 1.5,
      smooth: true,
    },
    steps: [
      { no: '01', zh: '基礎', en: 'Footings', detail: 'F1 大底＋墩座一體灌漿', count: '2' },
      { no: '02', zh: '鋼管樹柱', en: 'Steel tree columns', detail: 'P165.2×7，兩座各四支，加 PL6 加勁板', count: '8+4' },
      { no: '03', zh: '橫向樑', en: 'Cross beams', detail: '柳杉 D90，依單元高程疊 1～3 支', count: '21' },
      { no: '04', zh: '竹虹單元', en: 'Bamboo arch units', detail: '兩組人由樹柱頂部往外組，中跨合攏', count: '120' },
      { no: '05', zh: '屋面次構架', en: 'Roof sub-frame', detail: '竹短柱掃過，竹檁兩兩一組', count: '281+40' },
      { no: '06', zh: '屋面與檯面', en: 'Roof & counters', detail: '由兩端低處往屋脊鋪，最後裝竹集成材檯面', count: '11+2' },
    ],
    gallery: [
      { src: bbp[2], caption: '兩座鋼管樹柱撐起整片竹虹', kind: 'photo', group: '完工' },
      { src: bbp[4], caption: '停車場轉角', kind: 'photo', group: '完工' },
      { src: bbp[3], caption: '竹虹單元錯位滿鋪', kind: 'photo', group: '完工' },
      { src: bbp[1], caption: '簷下', kind: 'photo', group: '完工' },
      { src: bbp[7], caption: '霧裡的竹虹', kind: 'photo', group: '完工' },
      { src: bbp[0], caption: '屋簷與竹虹單元', kind: 'photo', group: '細部' },
      { src: bbp[5], caption: '柳杉橫向樑與竹材端部', kind: 'photo', group: '細部' },
      { src: bbp[6], caption: '錯層搭接的屋面', kind: 'photo', group: '細部' },
      { src: bbp[8], caption: '屋簷轉角', kind: 'photo', group: '細部' },
      { src: bbp[9], caption: '由下往上看竹虹單元', kind: 'photo', group: '細部' },
    ],
  },
  'stillness-seats': {
    model: {
      meta: '/works/stillness-seats/model.json',
      bin: '/works/stillness-seats/model.bin',
      size: '4.9 MB',
      center: [6.22, 0.3],
      view: { yaw: 0.4, pitch: 0.22, dist: 19, target: 1.1 },
      drops: [[0, 1.0], [0, -1.2], [0, 1.0], [0, -0.4], [0, 1.6], [0, 0.8], [0, 1.2], [0, 1.2]],
      gap: 0.9,
      smooth: false,
      note: '模型依竣工圖、細部設計圖與施工照片建立（Archicad 竣工模型 v12，2026-11-09），簡化為網頁網格。鋼筋、模板、防水層、地形與竹林不在模型中；杉木瓦板寬與部分金屬件尺寸為推估值。組裝順序依施工照片日期排列，為示意，不是施工計畫。',
    },
    steps: [
      { no: '01', zh: '預埋錨栓', en: 'Anchor embeds', detail: '綁筋立模後以樣板定位，柱腳兩端各 13 支、椅背背面 20 支', count: '46' },
      { no: '02', zh: 'RC 一次澆置', en: 'Monolithic casting', detail: '椅背、座椅與兩端三角錐同一套模板一次澆置', count: '1' },
      { no: '03', zh: '柱腳鋼版與背面短柱', en: 'Base plates & back stubs', detail: '鋼版 A 焊上鋼管 B 套管；椅背背面五處上下各一組短柱', count: '2+20+10' },
      { no: '04', zh: '地坪', en: 'Floor slab', detail: '級配夯實，澆置露骨材 RC 鋪面', count: '3' },
      { no: '05', zh: '竹結構', en: 'Primary structure', detail: '鋼管 A 起拱，孟宗竹雙支肋 P5→P1 由低往高就位；背面 U 型管束上下兩竹各一、左右錯開', count: '10+20' },
      { no: '06', zh: '砌石', en: 'Stonework', detail: '卵石、玄武岩椅面、椅背與端部亂石片', count: '10' },
      { no: '07', zh: '竹次結構', en: 'Secondary structure', detail: '桂竹逐支放上，邊放邊沿竹肋綁紮', count: '359' },
      { no: '08', zh: '屋面', en: 'Roofing', detail: '每列先釘掛瓦條再鋪杉木瓦，上列壓下列', count: '18+1,286' },
    ],
    gallery: [],
    video: {
      youtube: 'nWOoEHmdPfQ',
      title: '竹創森 瀞座 構築過程動畫',
      length: '2:00',
      poster: ssPoster,
      note: '依竣工模型製作，施工順序與動作為示意；最後一段為秋冬上午的日照縮時示意。音樂與音效以程式合成。',
    },
  },
};
