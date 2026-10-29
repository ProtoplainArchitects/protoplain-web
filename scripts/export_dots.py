"""把 pp-archive 統計頁的點狀圖資料匯出成網站可公開的版本。

用法：
    python3 -I scripts/export_dots.py <elevation-data.json> <photo-points.json> [--check]

只輸出白名單欄位：點座標與色調、重量（取到 0.1）、年份、對上網站作品時的 slug。
專案名稱、代碼、業主類別、得獎明細、金額都不寫出。--check 只印對照結果（代碼與 slug），不寫檔。
對照用的關鍵字全部取自網站上已公開的作品名稱。
"""
import json
import sys
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / 'src' / 'data' / 'dots.json'

# 網站作品 slug -> 名稱關鍵字（皆為公開作品名或地名）
SITE = {
    'office-in-yuanlin': ['員林'],
    'morning-mist-pavilion': ['招霧'],
    'crematorium-in-changhua': ['火化'],
    'taipower-yuchi-service-office': ['臺電', '台電'],
    'toushe-landscape-project': ['頭社'],
    'bamboo-mooring': ['竹泊'],
    'toilet-of-bamboo-bathing': ['沐竹'],
    'toilet-of-bamboo-greeting': ['迎竹'],
    'bamboo-bridge-pavilion': ['竹虹'],
    'jiji-railway-foothills-market': ['鐵麓', '集集'],
    'dacun-community-center': ['大村'],
    'ta-ming-art-center': ['大明文創', '文創會館'],
    'ta-ming-shs': ['大明高中'],
    'bamboo-bending': ['竹粼'],
    'radiant-court': ['洸庭'],
    'dormitory-in-tanzi': ['移工'],
    'social-housing-in-wuqi': ['梧棲'],
    'a-nook': ['一隅'],
    'unflavored': ['味無味'],
    'the-miner-2020': ['鑛客'],
    'filling-the-void-2021': ['填冶'],
}


# 名稱裡沒有網站作品名的專案，依 pp-archive data/works-match.csv（CH8 實績對照）指定代碼
# 110149A 大明文創會館為 CH8 對照推定，待確認
CODES = {
    '114188A': 'crematorium-in-changhua',
    '114190L': 'toushe-landscape-project',
    '111156A': 'dacun-community-center',
    '103039A': 'a-nook',
    '110149A': 'ta-ming-art-center',
}


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    check = '--check' in sys.argv
    projects = json.loads(Path(args[0]).read_text(encoding='utf-8'))
    photo = json.loads(Path(args[1]).read_text(encoding='utf-8'))

    # 一個 slug 只給一個專案：同名多案時取重量最高者。
    # 一個專案對到多件網站作品（例：八仙山一案含竹泊、沐竹軒、迎竹軒）時，點連到 SITE 中排在前面的那件。
    slug_of = {p['k']: CODES[p['code']] for p in projects if p['code'] in CODES}
    for slug, words in SITE.items():
        if slug in slug_of.values():
            continue
        cands = [p for p in projects if any(w in p['name'] or any(w in x for x in p['works']) for w in words)]
        if cands:
            best = max(cands, key=lambda p: p['w'] or 0)
            slug_of.setdefault(best['k'], slug)
    if check:
        code = {p['k']: p['code'] for p in projects}
        for k, slug in sorted(slug_of.items(), key=lambda x: x[1]):
            print(f'{slug}: {code[k]}')
    if check:
        print('未對上：', [s for s in SITE if s not in slug_of.values()])
        return

    # 與統計頁相同：重量高的專案落在最暗（色調值最高）的關鍵點
    keys = sorted(range(len(photo['key'])), key=lambda i: -photo['key'][i][2])
    ranked = sorted(projects, key=lambda p: -(p['w'] or 0))
    dots = []
    for p, ki in zip(ranked, keys):
        u, v, t = photo['key'][ki]
        y = p['y'][:4] if p['y'][:4].isdigit() else None
        dots.append({'u': u, 'v': v, 't': t, 'w': round(p['w'] or 0, 1), 'y': int(y) if y else None, 's': slug_of.get(p['k'])})
    out = {'aspect': photo['aspect'], 'air': photo['air'], 'dots': dots}
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print(f'寫入 {OUT.name}：{len(dots)} 個專案點、{len(photo["air"])} 個背景點、{sum(1 for d in dots if d["s"])} 件對上網站作品')


if __name__ == '__main__':
    main()
