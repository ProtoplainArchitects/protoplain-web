// 獲獎與入圍。來源：Format 舊站「Awards + Recognition」中英文頁（擷取日 2026-10-29）
// slug 對應作品頁；作品為 draft 時頁面只顯示名稱、不連結。
// 舊站「臺中南區 劉宅」標題含業主姓氏，依內容規範改寫為「臺中南區住宅」。

export interface Award { zh: string; en: string }
export interface AwardGroup { slug: string | null; zh: string; en: string; items: Award[] }

export const awardsIntro = {
  zh: '建築創作是在解決一切問題之外，還能懷抱熱誠，而這股熱誠是關於環境、土地、風、水與身邊的人們，我們如是相信與實踐著。',
  en: 'Architectural creation, beyond solving every problem, is about carrying passion — a passion for the environment, the land, the wind, the water, and the people around us. This is the belief we hold and the practice we continue.',
};

export const awards: AwardGroup[] = [
  {
    slug: 'liu-house-in-taichung',
    zh: '臺中南區住宅',
    en: 'House in Taichung',
    items: [
      { zh: '第十屆台灣住宅建築獎｜單棟住宅組｜入圍', en: '10th Taiwan Residential Architecture Award | Single House Category | Shortlisted' },
    ],
  },
  {
    slug: 'shibi-bamboo-forest',
    zh: '石壁竹創森 二期計畫',
    en: 'The Shibi Bamboo Forest',
    items: [
      { zh: '第八屆 ADA 新銳建築獎｜新銳獎', en: '8th ADA Awards | Emerging Architect Prize' },
      { zh: '2026 國家卓越建設獎｜最佳環境文化類｜優質獎', en: '2026 FIABCI-Taiwan Real Estate Excellence Awards | Best Environmental and Cultural Heritage Category | Excellence Award' },
      { zh: '2026 建築園冶獎｜公園綠地景觀類', en: '2026 Yuan Ye Awards | Park and Green Space Landscape Category' },
      // 舊站中英文年份與獎名不一致（中文 2025 近零碳、英文 2024 Net Zero），待確認
      { zh: '2025 近零碳建築設計獎｜產業組｜淨零建築卓越獎', en: '2024 Net Zero Building Design Award | Industrial Category | Excellence Award' },
    ],
  },
  {
    slug: 'basianshan-natural-construction',
    zh: '八仙山國家森林遊樂園區 自然構築計畫',
    en: 'Basianshan Nature Construction Project',
    items: [
      { zh: '第十二屆臺中市都市空間設計大獎｜公共環境空間｜卓越獎', en: '12th Taichung Urban Design Awards | Public Environmental Spatial Awards | Excellence Award' },
      { zh: '第七屆 ADA 新銳建築獎｜新銳獎', en: '7th ADA Awards | Emerging Architect Prize' },
      { zh: '2025 台灣光環境獎｜入圍', en: '2025 Taiwan Environment Lighting Award | Shortlisted' },
      { zh: '2025 建築園冶獎｜公共建築類｜零碳永續特別獎', en: '2025 Yuan Ye Awards | Public Architecture | Special Prize for Net-Zero Sustainability' },
      { zh: '2025 建築園冶獎｜公共建築類｜建築園冶獎', en: '2025 Yuan Ye Awards | Public Architecture | Yuan Ye Award' },
      { zh: '2025 建築園冶獎｜公共建築類｜評審特別獎', en: "2025 Yuan Ye Awards | Public Architecture | Jury's Special Award" },
      { zh: '2025 台中建築獎｜評審團特別獎', en: '2025 Taichung Architecture Award | Jury Special Award' },
      { zh: '2024 淨零建築設計獎｜產業組｜淨零建築卓越獎', en: '2024 Net Zero Building Design Award | Industrial Category | Excellence Award' },
    ],
  },
  {
    slug: 'jiji-railway-foothills-market',
    zh: '鐵麓山集',
    en: 'Jiji Railway Foothills Market',
    items: [
      { zh: '2024 淨零建築設計獎｜產業組｜優選獎', en: '2024 Net Zero Building Design Award | Industrial Category | Merit Award' },
    ],
  },
  {
    slug: 'stillness-seats',
    zh: '瀞座',
    en: 'Stillness Seats',
    items: [
      {
        zh: '2024 臺灣建築獎｜決選入圍（石壁竹創森之一，感謝大藏聯合建築師事務所邀約）',
        en: '2024 Taiwan Architecture Award | Finalist (part of the Shibi Bamboo Forest project, in collaboration with D.Z. Architects & Associates)',
      },
    ],
  },
  {
    slug: 'social-housing-in-wuqi',
    zh: '梧棲社宅',
    en: 'Social Housing in Wuqi',
    items: [
      { zh: '2022 建築園冶獎｜公共建築｜獲獎', en: '2022 Yuan Ye Awards | Public Architecture | Winner' },
      { zh: '第八屆台灣住宅建築獎｜中層集合住宅組｜入圍', en: '8th Taiwan Residential Architecture Award | Mid-Rise Housing Category | Shortlisted' },
      { zh: '第十屆臺中市都市空間設計大獎｜入圍', en: '10th Taichung Urban Design Awards | Shortlisted' },
    ],
  },
  {
    slug: 'a-nook',
    zh: '一隅',
    en: 'A Nook',
    items: [
      { zh: '第九屆臺中市都市空間設計大獎｜低層建築組｜卓越獎', en: '9th Taichung Urban Design Awards | Low-Rise Architecture Category | Excellence Award' },
    ],
  },
  {
    slug: 'unflavored',
    zh: '味無味',
    en: 'Unflavored',
    items: [
      { zh: '第七屆台中市都市空間設計大獎｜舊建築空間再造獎｜獲獎', en: '7th Taichung Urban Design Awards | Adaptive Reuse of Existing Architecture | Winner' },
      { zh: '第六屆台灣住宅建築獎｜單棟住宅組｜入圍', en: '6th Taiwan Residential Architecture Award | Single House Category | Shortlisted' },
    ],
  },
  {
    slug: null,
    zh: '事務所',
    en: 'Practice',
    items: [
      { zh: '臺中市大臺中建築師公會｜第一屆新銳建築師獎｜獲獎', en: 'Greater Taichung Architects Association | 1st Emerging Architect Award | Winner' },
    ],
  },
];
