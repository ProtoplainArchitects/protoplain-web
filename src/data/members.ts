// 成員與關係企業。來源：Format 舊站「Members」中英文頁（擷取日 2026-10-29）
// 同仁姓名與經歷依 2026-10-29 回覆「已取得本人同意」照舊站列出；新進或異動同仁須另取得同意。

export interface Member { zh: string; en: string; roleZh: string; roleEn: string; bioZh: string[]; bioEn: string[] }

export const members: Member[] = [
  {
    zh: '葉育鑫', en: 'Yu Hsin, Yeh', roleZh: '主持建築師暨負責人', roleEn: 'Principal Architect',
    bioZh: ['台灣開業建築師', '私立逢甲大學建築系講師', '綠建築 LEED 專業認證人員', '亞利桑那州立大學建築碩士', '淡江大學建築系學士'],
    bioEn: ['Registered Architect in Taiwan', 'Lecturer, Department of Architecture, Feng Chia University', 'LEED Accredited Professional (LEED AP)', 'Master of Architecture, Arizona State University', 'Bachelor of Architecture, Tamkang University'],
  },
  {
    zh: '林潔珊', en: 'Jessi, Lin', roleZh: '執行所長', roleEn: 'Executive Director',
    bioZh: ['初樸建築師事務所 資深設計師', '立聯合建築師事務所 經理設計師', '張景堯建築師事務所 設計師', '國立成功大學環境行為研究室 暨 建築系學士'],
    bioEn: ['Senior Designer, ProtoPlain Architects', 'Design Manager, Ambi Studio', 'Designer, JYCArchitects', 'Bachelor of Architecture, National Cheng Kung University'],
  },
  { zh: '鄭弘毅', en: 'Hung Yi, Cheng', roleZh: '景觀建築經理', roleEn: 'Director of Landscape Architecture', bioZh: ['私立逢甲大學 建築系學士'], bioEn: ['Feng Chia University, B.Arch.'] },
  { zh: '范聿睿', en: 'Yu Ruei, Fan', roleZh: '專案經理', roleEn: 'Project Manager', bioZh: ['國立台灣科技大學 建築系學士'], bioEn: ['National Taiwan University of Science and Technology, B.Arch.'] },
  { zh: '徐子弘', en: 'Tzu Hung, Hsu', roleZh: '建築設計師', roleEn: 'Architectural Designer', bioZh: ['私立逢甲大學 建築系學士'], bioEn: ['Feng Chia University, B.Arch.'] },
  { zh: '許復皓', en: 'Fu Hao, Shiu', roleZh: '建築設計師', roleEn: 'Architectural Designer', bioZh: ['私立逢甲大學 建築系學士'], bioEn: ['Feng Chia University, B.Arch.'] },
  { zh: '廖紫淇', en: 'Zih Ci, Liao', roleZh: '建築設計師', roleEn: 'Architectural Designer', bioZh: ['國立成功大學 建築系碩士'], bioEn: ['National Cheng Kung University, M.Arch. II'] },
  { zh: '鄭宇彤', en: 'Yu Tung, Cheng', roleZh: '建築設計師', roleEn: 'Computational Architect', bioZh: ['國立陽明交通大學 建築所碩士'], bioEn: ['National Yang Ming Chiao Tung University, M.Arch. II'] },
  { zh: '黃承賢', en: 'Cheng Hsien, Huang', roleZh: '建築設計師', roleEn: 'Architectural Designer', bioZh: ['私立逢甲大學 建築系學士'], bioEn: ['Feng Chia University, B.Arch.'] },
  { zh: '林珊姍', en: 'Shan Shan, Lin', roleZh: '建築設計師', roleEn: 'Architectural Designer', bioZh: ['國立金門大學 建築系學士'], bioEn: ['National Quemoy University, B.Arch.'] },
  { zh: '陳肇明', en: 'Chao-Ming, Chen', roleZh: '資深法規顧問', roleEn: 'Senior Regulatory Consultant', bioZh: ['經歷：葉建昌建築師事務所'], bioEn: ['Yeh Chien-Chang Architects'] },
  { zh: '張賢國', en: 'Dagun', roleZh: '監造工程師', roleEn: 'Construction Supervisor', bioZh: ['建國科技大學 土木暨防災研究所碩士'], bioEn: ['Chienkuo Technology University, M.S.'] },
  { zh: '余舜芬', en: 'Annie, Yu', roleZh: '執行企劃', roleEn: 'Planning Specialist', bioZh: ['東京私立慶應義塾大學 国文学専攻学士'], bioEn: ['Keio University, B.A. in Japanese Literature'] },
  { zh: '康華倩', en: 'Hua Qian, Kang', roleZh: '所務行政', roleEn: 'Administration', bioZh: [], bioEn: [] },
];

export const affiliates = [
  {
    zh: '初樸自然構築工程有限公司',
    en: 'ProtoPlain Tectonic Construction Engineering Co., Ltd.',
    bodyZh: ['嘗試從常態轉換至非慣型的實踐，服務範疇從自然材料之構築工程，到各種非慣型文化的探索研究與策展推廣，從建築、室內裝修、景觀到生態系統，在各種尺度下，探索當代非慣型的原型實踐。'],
    bodyEn: ['We seek to transition from conventional norms to innovative, unconventional practices, expanding our scope from natural material construction to the exploration, research, and curation of alternative cultural narratives. Spanning architecture, interior design, landscape, and ecosystems, we explore new prototypes of contemporary, non-traditional design across various scales.'],
    link: null as { href: string; label: string } | null,
  },
  {
    zh: '豐原計畫',
    en: 'Fengyuan Project',
    bodyZh: [
      '在台灣同級的鄉鎮市中，豐原是少數人口仍呈現正成長的城市，且在都市規模上擁有雙環狀道路系統，展現出完整的都會區架構。因此，我們認為豐原在非大都會城市中具有某種代表性。',
      '「豐原計畫」的研究構想，源自於對台灣城市與建築更深層理解的渴望。透過梳理一座台灣城市自戰後以來的發展歷程，試圖理解各時期所留下的建築設計與營建成果，進一步探討是否能從中找出值得當代建築借鏡的脈絡與啟發。',
    ],
    bodyEn: [
      'Among Taiwan’s townships of comparable scale, Fengyuan stands out as one of the few with a steadily growing population. Its urban layout, featuring a dual-ring road system, reflects the structure of a fully developed metropolitan area. Because of this, we believe that Fengyuan holds a certain representative significance among non-metropolitan cities in Taiwan.',
      'The research concept behind the “Fengyuan Project” is driven by a desire to gain a deeper understanding of Taiwan’s cities and architecture. By tracing the developmental trajectory of a single Taiwanese city since the postwar period, the project seeks to understand the architectural designs and infrastructure achievements of each era — and to explore whether they contain patterns or insights that could serve as meaningful references for contemporary architecture.',
    ],
    link: { href: 'https://www.instagram.com/remodernism_tw/', label: 'Instagram @remodernism_tw' },
  },
];

export const contact = {
  addressZh: '臺中市豐原區信義街155號5樓',
  addressEn: '5F., No. 155, Xinyi St., Fengyuan Dist., Taichung City, Taiwan',
  instagram: { href: 'https://www.instagram.com/pparchitects_tw/', label: '@pparchitects_tw' },
  // 舊站表單連到 Google 表單的編輯網址，公開填寫網址回 404；取得正確網址前不顯示按鈕
  formUrl: null as string | null,
  introZh: ['以建築為始，', '我們關心水文、土地、風動與人，', '也能聊聊展覽、景觀、木與竹……', '或是一場採訪、分享的邀約，', '還有那些仍在醞釀的想法。'],
  introEn: [
    'Beginning with architecture,',
    'our concerns go beyond structure and form to water, land, wind, and people.',
    'We also welcome conversations on exhibitions, landscapes, wood and bamboo…',
    'or invitations for interviews, talks,',
    'and ideas still in formation.',
  ],
};
