"""一次性匯入：把 Format 舊站歸檔（entries.json）轉成 src/content/works/<slug>/。

用法：
    python3 -I scripts/import_format_archive.py <歸檔資料夾> <notion_匯出.json>

<歸檔資料夾> 內需有 entries.json 與 thumbs/（封面縮圖，已去除 EXIF）。
<notion_匯出.json> 為「官網內容庫」資料庫的匯出（頁面名稱、英文標題、新站處理、備註），
以 Notion 上人工校正過的標題為準。

匯入規則（對應 CLAUDE.md 的內容規範）：
- 刪除「建築師」「策展人」「參與人員」行：對外文件不列建築師人名；同仁姓名待確認同意後再補。
- 刪除空白欄位與業主個人社群連結。
- 標題含業主姓氏、內文需改寫、或無內容的頁面，一律 draft: true，不進正式建置。
"""
import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'src' / 'content' / 'works'

# 舊站索引 -> 新 slug（中英共用；英文頁在 /en/ 底下）
SLUGS = {
    0: 'office-in-yuanlin', 1: 'morning-mist-pavilion', 2: 'crematorium-in-changhua',
    3: 'shibi-bamboo-forest', 4: 'taipower-yuchi-service-office', 5: 'toushe-landscape-project',
    6: 'basianshan-natural-construction', 7: 'toilet-of-bamboo-bathing', 8: 'toilet-of-bamboo-rising',
    9: 'bamboo-mooring', 10: 'bamboo-bridge-pavilion', 11: 'ye-house-in-fengyuan',
    12: 'toilet-of-bamboo-greeting', 13: 'jiji-railway-foothills-market', 14: 'dacun-community-center',
    15: 'ta-ming-art-center', 16: 'ta-ming-shs', 17: 'stillness-seats', 18: 'bamboo-bending',
    19: 'radiant-court', 20: 'zhan-house-in-shigang', 21: 'dormitory-in-tanzi',
    22: 'liu-house-in-taichung', 23: 'zhou-house-in-shengang', 24: 'social-housing-in-wuqi',
    25: 'a-nook', 26: 'unflavored', 27: 'she-house-in-xiaogang',
    28: 'island-bamboo-traces-2025', 29: 'tectonics-of-the-island-2025',
    30: 'tectonics-of-the-island-2023', 31: 'filling-the-void-2021', 32: 'the-miner-2020',
}

DROP_LABELS = {
    '建築師', '參與人員', '策展人',
    'architect', 'architects', 'teammembers', 'teammember', 'participants', 'curator',
}
CREDIT = re.compile(r'^\s*[-•]\s*([^:：\n]{1,40}?)\s*[:：]\s*(.*)$')


def norm_label(s):
    return re.sub(r'\s+', '', s).lower()


def clean_body(text):
    lines = text.split('\n')
    title, subtitle = None, None
    # 第一行是 ## 標題，緊接的非空行（若非連結）視為副標
    while lines and not lines[0].strip():
        lines.pop(0)
    if lines and lines[0].startswith('#'):
        title = lines.pop(0).lstrip('#').strip()
        if lines and lines[0].strip() and not lines[0].lstrip().startswith(('[', '-')):
            subtitle = lines.pop(0).strip()
    out = []
    for ln in lines:
        if re.match(r'^\s*\[\[[^\]]*\]\]\(internal:\d+\)\s*$', ln):
            continue  # 中英切換連結
        if 'instagram.com' in ln:
            continue  # 業主個人社群連結
        m = CREDIT.match(ln)
        if m:
            label, value = m.group(1), m.group(2).strip()
            if norm_label(label) in DROP_LABELS or not value:
                continue
            ln = f"- {re.sub(r' {2,}', ' ', label.strip())}：{re.sub(r' {2,}', ' ', value)}"
        ln = re.sub(r'\[([^\]]*)\]\(internal:\d+\)', r'\1', ln)
        ln = re.sub(r'^(#{1,2}) ', '### ', ln)
        out.append(ln.rstrip())
    # 舊站多用單一換行分句，Markdown 會併成一行；連續文字行改為硬換行
    for k in range(len(out) - 1):
        a, b = out[k], out[k + 1]
        if a.strip() and b.strip() and not a.lstrip().startswith(('-', '#', '|')) \
                and not b.lstrip().startswith(('-', '#', '|')):
            out[k] = a + '\\'
    body = re.sub(r'\n{3,}', '\n\n', '\n'.join(out)).strip()
    return title, subtitle, body


def find_value(text, labels):
    for ln in text.split('\n'):
        m = CREDIT.match(ln)
        if m and norm_label(m.group(1)) in labels and m.group(2).strip():
            return m.group(2).strip()
    return None


def yaml_str(s):
    return json.dumps(s, ensure_ascii=False) if s is not None else 'null'


def main(archive, notion_json):
    archive = Path(archive)
    E = json.loads((archive / 'entries.json').read_text())
    N = {r['中文slug']: r for r in json.loads(Path(notion_json).read_text())}
    rows = []
    for i, slug in SLUGS.items():
        e = E[i]
        n = N.get(e['zh'], {})
        title = n.get('頁面名稱') or e['name']
        title_en = n.get('英文標題') or e['en_name'] or None
        note = n.get('備註') or ''
        _, sub_zh, body_zh = clean_body(e['zh_text'])
        _, sub_en, body_en = clean_body(e['en_text'])
        if body_en and re.search(r'[一-鿿]{20,}', body_en):
            body_en = ''  # 英文版其實是中文複本
        review = []
        if n.get('新站處理') == '改寫':
            review.append('用語改寫')
        if '業主姓氏' in note:
            review.append('標題含業主姓氏')
        if not body_zh and not e['images']:
            review.append('原頁無內容')
        location = find_value(e['zh_text'], {'座落地點', '展區地點'})
        d = OUT / slug
        d.mkdir(parents=True, exist_ok=True)
        thumb = e.get('thumb')
        has_cover = bool(thumb and (archive / thumb).exists())
        if has_cover:
            shutil.copyfile(archive / thumb, d / 'cover.jpg')
        fm = [
            '---',
            f'title: {yaml_str(title)}',
            f'titleEn: {yaml_str(title_en)}',
            f'subtitle: {yaml_str(sub_zh)}',
            f'year: {e["year"]}',
            f'kind: {"exhibition" if e["type"] == "展覽" else "work"}',
            f'axis: {yaml_str(e["axis"] or n.get("作品軸線"))}',
            f'location: {yaml_str(location)}',
        ]
        if has_cover:
            fm.append('cover: ./cover.jpg')
        fm += [
            f'draft: {"true" if review else "false"}',
            'review: [' + ', '.join(yaml_str(r) for r in review) + ']',
            'legacy:',
            f'  zh: {yaml_str(e["zh_url"] or None)}',
            f'  en: {yaml_str(e["en_url"] or None)}',
            '---',
        ]
        (d / 'index.md').write_text('\n'.join(fm) + '\n\n' + (body_zh or '') + '\n')
        if body_en:
            fe = ['---', f'title: {yaml_str(title_en or title)}', f'subtitle: {yaml_str(sub_en)}', '---']
            (d / 'en.md').write_text('\n'.join(fe) + '\n\n' + body_en + '\n')
        rows.append((title, e['zh_url'], e['en_url'], slug, bool(body_en), review))

    md = ['# Slug 對照表（待核可）', '',
          '舊站網址 → 新站路徑。新站中文頁為 `/works/<slug>/`，英文頁為 `/en/works/<slug>/`。',
          '核可前不接正式網域。', '',
          '| 作品 | 舊站中文 | 舊站英文 | 新 slug | 英文頁 | 待處理 |',
          '|---|---|---|---|---|---|']
    for t, zu, eu, s, has_en, rv in rows:
        md.append(f"| {t} | {zu or '—'} | {eu or '—'} | `{s}` | {'有' if has_en else '無'} | {'；'.join(rv) or '—'} |")
    (ROOT / 'docs').mkdir(exist_ok=True)
    (ROOT / 'docs' / 'slug-map.md').write_text('\n'.join(md) + '\n')
    print(f'{len(rows)} works, {sum(1 for r in rows if r[5])} draft')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
