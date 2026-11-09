# 瀞座 viewer.html（互動檢核 v03 同源）→ 官網 TectonicViewer 的 model.json＋model.bin
# 只取永久構件；鋼筋、模板、防水層、地形、竹林不放。座標 cm → mm（int16），各網格頂點焊接後算稜線。
# 用法：python3 scripts/convert_stillness_seats_model.py <數位構築網頁-v02 解壓後的 viewer.html> public/works/stillness-seats
import sys, re, json, math, struct, base64, gzip

def load(path):
    t = open(path, encoding='utf-8').read()
    i = t.find('const DATA=') + len('const DATA=')
    j = t.find('};', i) + 1
    data = json.loads(t[i:j])
    g0 = t.find('const GEO="') + len('const GEO="')
    g1 = t.find('"', g0)
    raw = gzip.decompress(base64.b64decode(t[g0:g1]))
    nv, ni = data['nv'], data['ni']
    q = struct.unpack('<%dh' % (nv * 3), raw[:nv * 6])
    idx = struct.unpack('<%dH' % ni, raw[nv * 6:nv * 6 + ni * 2])
    return data, q, idx
src, out_dir = sys.argv[1], sys.argv[2]
data, Q16, I16 = load(src)
C0, Q = data['C0'], data['Q']

SKIP = re.compile(r'^(防水層|模板|鋼筋|地形|竹林)')

def classify(name, grp):
    """回傳 (step, unit key, 顯示名稱, sub, 材質)"""
    m = re.match(r'錨栓M25-鋼版A-(西|東)', name)
    if m: return 1, 'anchorA' + m[1], '錨栓 M25 ×13', f'柱腳鋼版 A · {m[1]}端', 'steel'
    m = re.match(r'錨栓M25-背面-(上|下)-(.+?)(?:-\d+)?$', name)
    if m: return 1, 'anchorB' + m[1] + m[2], '錨栓 M25', '椅背背面短柱', 'steel'
    if name.startswith('RC基座'): return 2, 'rc', 'RC 椅身與三角錐基座', '椅背、座椅、端部一次澆置', 'rc'
    m = re.match(r'基礎鋼版A-(西|東)', name)
    if m: return 3, 'plateA' + m[1], '柱腳鋼版 A', f'{m[1]}端三角錐稜線', 'steel'
    m = re.match(r'鋼管B-(P\d[ab])-(西|東)', name)
    if m: return 3, 'pipeB' + m[1] + m[2], '鋼管 B 套管', f'竹肋 {m[1]} · {m[2]}端', 'steel'
    m = re.match(r'背面(接合鋼板|鋼管C|竹材U型鋼板)-(上|下)-(.+)$', name)
    if m: return 3, 'stub' + m[2] + m[3], '背面短柱', '接合鋼板、鋼管 C、竹材承托鋼板', 'steel'
    if name == '級配碎石夯實': return 4, 'base', '級配碎石夯實', '地坪底層', 'stone'
    if name == '露骨材RC鋪面': return 4, 'slab', '露骨材 RC 鋪面', '地坪', 'rc'
    if name == '地坪收邊': return 4, 'edge', '地坪收邊', '地坪', 'rc'
    if name.startswith('鋼管A'): return 5, 'pipeA', '鋼管 A 主樑', 'D139.8，起拱', 'steel'
    m = re.match(r'孟宗竹肋(P\d[ab])', name)
    if m: return 5, 'rib' + m[1], f'孟宗竹肋 {m[1]}', '雙支肋，兩端柱腳往拱頂接上', 'bamboo'
    m = re.match(r'續接卡箍(P\d[ab])', name)
    if m: return 5, 'rib' + m[1], f'孟宗竹肋 {m[1]}', '雙支肋，兩端柱腳往拱頂接上', 'steel'
    m = re.match(r'U型管束-(上|下)-(.+?)(?:-\d+)?$', name)
    if m: return 5, 'uclamp' + m[1] + m[2], 'U 型管束 ×4', 'P4、P5 竹肋鎖固於背面短柱', 'steel'
    if grp == 1:
        nm = {'座椅立面砌卵石': '座椅立面砌卵石', '玄武岩椅面': '玄武岩椅面', '椅背亂石片': '椅背亂石片',
              '椅背頂與背面砌石': '椅背頂與背面砌石'}
        base = re.sub(r'-(西|東)$', '', name)
        side = re.search(r'-(西|東)$', name)
        return 6, 'stone' + name, nm.get(base, base), (f'{side[1]}端' if side else '石作'), 'stone'
    if name.startswith('桂竹'): return 7, 'guizhu', '桂竹次構架', '逐支沿竹肋綁紮', 'bamboo'
    m = re.match(r'綁紮線-(P\d[ab])', name)
    if m: return 7, 'tie' + m[1], f'綁紮線 {m[1]}', '桂竹與竹肋綁紮', 'steel'
    m = re.match(r'(?:次構架角材|杉木瓦)-C(\d+)', name)
    if m: return 8, 'row' + m[1], f'杉木瓦 第 {int(m[1])} 列', '先釘掛瓦條，再鋪該列杉木瓦', 'wood'
    if name.startswith('屋面前緣杉木封邊板'): return 8, 'fascia', '前緣杉木封邊板', '遮住鋼管 A', 'wood'
    raise SystemExit('未分類構件：' + name)

# 收集單元
units = {}
for it in data['items']:
    name, _, grp, t0 = it[0], it[1], it[2], it[3]
    if SKIP.match(name): continue
    step, key, label, sub, mat = classify(name, grp)
    u = units.setdefault(key, {'step': step, 'name': label, 'sub': sub, 't': t0, 'items': [], 'cnt': 0})
    u['t'] = min(u['t'], t0); u['items'].append((it, mat))

# 桂竹 359 支依出場時間每 12 支一批，免得網頁上有幾百個物件
gz = units.pop('guizhu')
gz['items'].sort(key=lambda x: x[0][3])
B = 12
for b in range(0, len(gz['items']), B):
    chunk = gz['items'][b:b + B]
    a, z = b + 1, b + len(chunk)
    units[f'guizhu{b // B:02d}'] = {'step': 7, 'name': f'桂竹 {a:03d}–{z:03d}', 'sub': '逐支沿竹肋綁紮', 't': chunk[0][0][3], 'items': chunk}
# 同名合併的錨栓補上數量
for k, u in units.items():
    if k.startswith('anchorB'): u['name'] = f'錨栓 M25 ×{len(u["items"])}'

def mm(vi):
    s = vi * 3
    return (round((Q16[s] * Q + C0[0]) * 10), round((Q16[s + 1] * Q + C0[1]) * 10), round((Q16[s + 2] * Q + C0[2]) * 10))

POS, IDX, EDG = [], [], []
out_units = []
by_step = {}
for key, u in sorted(units.items(), key=lambda kv: (kv[1]['step'], kv[1]['t'], kv[0])):
    n = by_step.get(u['step'], 0); by_step[u['step']] = n + 1
    meshes = {}
    for it, mat in u['items']:
        vo, nv, io, ni = it[7], it[8], it[9], it[10]
        meshes.setdefault(mat, []).append((vo, nv, io, ni))
    ms = []
    for mat, parts in meshes.items():
        weld, verts, tris = {}, [], []
        for vo, nv, io, ni in parts:
            remap = []
            for j in range(nv):
                p = mm(vo + j)
                if p not in weld: weld[p] = len(verts); verts.append(p)
                remap.append(weld[p])
            for j in range(0, ni - ni % 3, 3):
                a, b, c = remap[I16[io + j]], remap[I16[io + j + 1]], remap[I16[io + j + 2]]
                if a != b and b != c and a != c: tris.append((a, b, c))
        # 稜線：只有一個面（開放邊）或兩面夾角大於 35°
        def nrm(t):
            p0, p1, p2 = verts[t[0]], verts[t[1]], verts[t[2]]
            ux, uy, uz = p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]
            vx, vy, vz = p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]
            x, y, z = uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx
            l = math.sqrt(x * x + y * y + z * z) or 1
            return (x / l, y / l, z / l)
        fn = [nrm(t) for t in tris]
        adj = {}
        for fi, t in enumerate(tris):
            for e in ((t[0], t[1]), (t[1], t[2]), (t[2], t[0])):
                adj.setdefault((min(e), max(e)), []).append(fi)
        cos35 = math.cos(math.radians(35))
        edges = []
        for e, fs in adj.items():
            if len(fs) == 1: edges.append(e)
            elif len(fs) == 2:
                a, b = fn[fs[0]], fn[fs[1]]
                if abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) < cos35: edges.append(e)
        v0, i0, e0 = len(POS), len(IDX), len(EDG)
        POS.extend(verts)
        for t in tris: IDX.extend(t)
        for e in edges: EDG.extend(e)
        ms.append({'g': mat, 'v': [v0, len(verts)], 'i': [i0, len(tris) * 3], 'e': [e0, len(edges) * 2]})
    out_units.append({'id': key, 'step': u['step'], 'n': n, 'name': u['name'], 'sub': u['sub'], 'm': ms})

flat = [c for p in POS for c in p]
assert all(-32768 <= c <= 32767 for c in flat)
pos_b = struct.pack('<%dh' % len(flat), *flat)
pad = (4 - len(pos_b) % 4) % 4
idx_b = struct.pack('<%dI' % len(IDX), *IDX)
edg_b = struct.pack('<%dI' % len(EDG), *EDG)
with open(out_dir + '/model.bin', 'wb') as f: f.write(pos_b + b'\0' * pad + idx_b + edg_b)
meta = {
    'unit': 'mm', 'source': '110151 瀞座 構築過程互動檢核 v03 幾何（Archicad 竣工模型 v10 同源，2026-11-09）',
    'origin': '座椅中軸線∩地坪 ±0 起算之相對座標，+x 東、+y 北（假設）、+z 上',
    'bytes': {'pos': len(pos_b), 'pad': pad, 'idx': len(idx_b), 'edge': len(edg_b)},
    'counts': {str(k): v for k, v in sorted(by_step.items())}, 'units': out_units,
}
with open(out_dir + '/model.json', 'w', encoding='utf-8') as f: json.dump(meta, f, ensure_ascii=False, separators=(',', ':'))
xs, ys, zs = flat[0::3], flat[1::3], flat[2::3]
print('units', len(out_units), 'counts', meta['counts'])
print('verts', len(POS), 'tris', len(IDX) // 3, 'edges', len(EDG) // 2)
print('bin', len(pos_b) + pad + len(idx_b) + len(edg_b), 'bbox mm', (min(xs), max(xs)), (min(ys), max(ys)), (min(zs), max(zs)))
