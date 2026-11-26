/* Arbeitsfaden der Photogrammetrie (photogrammetrie.html): Merkmale, Zuordnung, Kameraausrichtung, Tiefenkarten, Netz */
'use strict';
// ---------- Lineare Algebra (Zeilen-Matrizen als flache Arrays) ----------
function m3(a, b) { // 3x3 · 3x3
  return [a[0] * b[0] + a[1] * b[3] + a[2] * b[6], a[0] * b[1] + a[1] * b[4] + a[2] * b[7], a[0] * b[2] + a[1] * b[5] + a[2] * b[8],
    a[3] * b[0] + a[4] * b[3] + a[5] * b[6], a[3] * b[1] + a[4] * b[4] + a[5] * b[7], a[3] * b[2] + a[4] * b[5] + a[5] * b[8],
    a[6] * b[0] + a[7] * b[3] + a[8] * b[6], a[6] * b[1] + a[7] * b[4] + a[8] * b[7], a[6] * b[2] + a[7] * b[5] + a[8] * b[8]];
}
function m3v(a, v) { return [a[0] * v[0] + a[1] * v[1] + a[2] * v[2], a[3] * v[0] + a[4] * v[1] + a[5] * v[2], a[6] * v[0] + a[7] * v[1] + a[8] * v[2]]; }
function m3t(a) { return [a[0], a[3], a[6], a[1], a[4], a[7], a[2], a[5], a[8]]; }
function m3det(a) { return a[0] * (a[4] * a[8] - a[5] * a[7]) - a[1] * (a[3] * a[8] - a[5] * a[6]) + a[2] * (a[3] * a[7] - a[4] * a[6]); }
function m3inv(a) {
  const d = m3det(a); if (Math.abs(d) < 1e-300) return null;
  const i = 1 / d;
  return [(a[4] * a[8] - a[5] * a[7]) * i, (a[2] * a[7] - a[1] * a[8]) * i, (a[1] * a[5] - a[2] * a[4]) * i,
    (a[5] * a[6] - a[3] * a[8]) * i, (a[0] * a[8] - a[2] * a[6]) * i, (a[2] * a[3] - a[0] * a[5]) * i,
    (a[3] * a[7] - a[4] * a[6]) * i, (a[1] * a[6] - a[0] * a[7]) * i, (a[0] * a[4] - a[1] * a[3]) * i];
}
function v3sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function v3add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function v3mal(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
function v3dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function v3kreuz(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function v3len(a) { return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]); }
function v3norm(a) { const l = v3len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
function schief(v) { return [0, -v[2], v[1], v[2], 0, -v[0], -v[1], v[0], 0]; }
function rodrigues(w) {
  const th = v3len(w);
  if (th < 1e-12) return [1, -w[2], w[1], w[2], 1, -w[0], -w[1], w[0], 1];
  const k = [w[0] / th, w[1] / th, w[2] / th], c = Math.cos(th), s = Math.sin(th), v = 1 - c;
  return [c + k[0] * k[0] * v, k[0] * k[1] * v - k[2] * s, k[0] * k[2] * v + k[1] * s,
    k[1] * k[0] * v + k[2] * s, c + k[1] * k[1] * v, k[1] * k[2] * v - k[0] * s,
    k[2] * k[0] * v - k[1] * s, k[2] * k[1] * v + k[0] * s, c + k[2] * k[2] * v];
}
// Orthonormieren (nächste Drehmatrix)
function drehungNahe(a) {
  const s = svd3(a); let r = m3(s.U, m3t(s.V));
  if (m3det(r) < 0) { const V = s.V.slice(); V[2] = -V[2]; V[5] = -V[5]; V[8] = -V[8]; r = m3(s.U, m3t(V)); }
  return r;
}
// Jacobi-Eigenzerlegung einer symmetrischen n×n-Matrix; Eigenwerte aufsteigend, Vektoren als Spalten
function eigenSym(Ain, n) {
  const A = Float64Array.from(Ain), V = new Float64Array(n * n);
  for (let i = 0; i < n; i++) V[i * n + i] = 1;
  for (let sweep = 0; sweep < 60; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p * n + q] * A[p * n + q];
    if (off < 1e-26) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      const apq = A[p * n + q]; if (Math.abs(apq) < 1e-300) continue;
      const app = A[p * n + p], aqq = A[q * n + q], th = (aqq - app) / (2 * apq);
      const t = (th >= 0 ? 1 : -1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) {
        const akp = A[k * n + p], akq = A[k * n + q];
        A[k * n + p] = c * akp - s * akq; A[k * n + q] = s * akp + c * akq;
      }
      for (let k = 0; k < n; k++) {
        const apk = A[p * n + k], aqk = A[q * n + k];
        A[p * n + k] = c * apk - s * aqk; A[q * n + k] = s * apk + c * aqk;
      }
      for (let k = 0; k < n; k++) {
        const vkp = V[k * n + p], vkq = V[k * n + q];
        V[k * n + p] = c * vkp - s * vkq; V[k * n + q] = s * vkp + c * vkq;
      }
    }
  }
  const idx = []; for (let i = 0; i < n; i++) idx.push(i);
  idx.sort(function (a, b) { return A[a * n + a] - A[b * n + b]; });
  const werte = idx.map(function (i) { return A[i * n + i]; }), vek = new Float64Array(n * n);
  idx.forEach(function (i, j) { for (let k = 0; k < n; k++) vek[k * n + j] = V[k * n + i]; });
  return { werte: werte, V: vek };
}
// kleinster rechter Singulärvektor einer m×n-Matrix (Zeilen)
function nullvektor(A, m, n) {
  const M = new Float64Array(n * n);
  for (let r = 0; r < m; r++) for (let i = 0; i < n; i++) { const a = A[r * n + i]; if (a === 0) continue; for (let j = i; j < n; j++) M[i * n + j] += a * A[r * n + j]; }
  for (let i = 0; i < n; i++) for (let j = 0; j < i; j++) M[i * n + j] = M[j * n + i];
  const e = eigenSym(M, n), v = new Float64Array(n);
  for (let k = 0; k < n; k++) v[k] = e.V[k * n];
  return v;
}
// SVD einer 3x3-Matrix: A = U·diag(S)·V^T, S absteigend
function svd3(A) {
  const AtA = m3(m3t(A), A), e = eigenSym(AtA, 3);
  const V = [e.V[2], e.V[1], e.V[0], e.V[5], e.V[4], e.V[3], e.V[8], e.V[7], e.V[6]];
  const S = [Math.sqrt(Math.max(0, e.werte[2])), Math.sqrt(Math.max(0, e.werte[1])), Math.sqrt(Math.max(0, e.werte[0]))];
  const sp = function (i) { return [V[i], V[3 + i], V[6 + i]]; };
  const u0 = S[0] > 1e-300 ? v3mal(m3v(A, sp(0)), 1 / S[0]) : [1, 0, 0];
  let u1 = S[1] > 1e-12 * (S[0] || 1) ? v3mal(m3v(A, sp(1)), 1 / S[1]) : null;
  if (!u1) { const h = Math.abs(u0[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]; u1 = v3norm(v3kreuz(u0, h)); }
  u1 = v3norm(v3sub(u1, v3mal(u0, v3dot(u0, u1))));
  let u2 = v3kreuz(u0, u1);
  if (S[2] > 1e-12 * (S[0] || 1) && v3dot(m3v(A, sp(2)), u2) < 0) u2 = v3mal(u2, -1);
  return { U: [u0[0], u1[0], u2[0], u0[1], u1[1], u2[1], u0[2], u1[2], u2[2]], S: S, V: V };
}
// Cholesky-Lösung (überschreibt nichts), A n×n symmetrisch positiv definit
function cholLoesen(A, b, n) {
  const L = new Float64Array(n * n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = A[i * n + j];
      for (let k = 0; k < j; k++) s -= L[i * n + k] * L[j * n + k];
      if (i === j) { if (s <= 1e-300) s = 1e-12; L[i * n + i] = Math.sqrt(s); }
      else L[i * n + j] = s / L[j * n + j];
    }
  }
  const y = new Float64Array(n);
  for (let i = 0; i < n; i++) { let s = b[i]; for (let k = 0; k < i; k++) s -= L[i * n + k] * y[k]; y[i] = s / L[i * n + i]; }
  const x = new Float64Array(n);
  for (let i = n - 1; i >= 0; i--) { let s = y[i]; for (let k = i + 1; k < n; k++) s -= L[k * n + i] * x[k]; x[i] = s / L[i * n + i]; }
  return x;
}
function sym3inv(a) { return m3inv(a); }
// Zufall mit Startwert (reproduzierbar)
function zufallMit(s) { let x = s >>> 0 || 1; return function () { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
function stichprobe(n, k, zf) { const r = []; while (r.length < k) { const i = Math.floor(zf() * n); if (r.indexOf(i) < 0) r.push(i); } return r; }
function median(a) { if (!a.length) return 0; const s = Array.prototype.slice.call(a).sort(function (x, y) { return x - y; }); return s[s.length >> 1]; }
function quantil(a, q) { if (!a.length) return 0; const s = Array.prototype.slice.call(a).sort(function (x, y) { return x - y; }); return s[Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))))]; }
// ---------- Merkmale: FAST-Ecken auf einer Bildpyramide, Harris-Bewertung, gedrehte BRIEF-Beschreiber (ORB-ähnlich) ----------
const KREIS = [[0, -3], [1, -3], [2, -2], [3, -1], [3, 0], [3, 1], [2, 2], [1, 3], [0, 3], [-1, 3], [-2, 2], [-3, 1], [-3, 0], [-3, -1], [-2, -2], [-1, -3]];
const MUSTER = (function () { // 256 Vergleichspaare, Gauß-verteilt (σ ≈ 6,2 px), Radius höchstens 13
  const zf = zufallMit(20251126), m = [];
  const g = function () { let u = 0, v = 0; while (u === 0) u = zf(); v = zf(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  while (m.length < 256 * 4) { const a = Math.round(g() * 6.2), b = Math.round(g() * 6.2), c = Math.round(g() * 6.2), d = Math.round(g() * 6.2); if (Math.max(Math.abs(a), Math.abs(b), Math.abs(c), Math.abs(d)) > 13 || (a === c && b === d)) continue; m.push(a, b, c, d); }
  return m;
})();
const WINKEL_STUFEN = 30;
const MUSTER_GEDREHT = (function () {
  const l = [];
  for (let s = 0; s < WINKEL_STUFEN; s++) {
    const a = s * 2 * Math.PI / WINKEL_STUFEN, c = Math.cos(a), si = Math.sin(a), r = new Int8Array(1024);
    for (let i = 0; i < 1024; i += 2) { r[i] = Math.round(c * MUSTER[i] - si * MUSTER[i + 1]); r[i + 1] = Math.round(si * MUSTER[i] + c * MUSTER[i + 1]); }
    l.push(r);
  }
  return l;
})();
function grauAus(rgba, w, h) { const g = new Float32Array(w * h); for (let i = 0, j = 0; i < g.length; i++, j += 4) g[i] = 0.299 * rgba[j] + 0.587 * rgba[j + 1] + 0.114 * rgba[j + 2]; return g; }
function weichzeichnen(src, w, h) { // Binomial 1-4-6-4-1, zweimal getrennt
  const t = new Float32Array(w * h), o = new Float32Array(w * h);
  for (let y = 0; y < h; y++) { const r = y * w; for (let x = 0; x < w; x++) { const a = src[r + Math.max(0, x - 2)], b = src[r + Math.max(0, x - 1)], c = src[r + x], d = src[r + Math.min(w - 1, x + 1)], e = src[r + Math.min(w - 1, x + 2)]; t[r + x] = (a + 4 * b + 6 * c + 4 * d + e) / 16; } }
  for (let y = 0; y < h; y++) { const y0 = Math.max(0, y - 2) * w, y1 = Math.max(0, y - 1) * w, y3 = Math.min(h - 1, y + 1) * w, y4 = Math.min(h - 1, y + 2) * w, r = y * w; for (let x = 0; x < w; x++) o[r + x] = (t[y0 + x] + 4 * t[y1 + x] + 6 * t[r + x] + 4 * t[y3 + x] + t[y4 + x]) / 16; }
  return o;
}
function verkleinern(src, w, h, f) {
  const nw = Math.max(1, Math.round(w / f)), nh = Math.max(1, Math.round(h / f)), o = new Float32Array(nw * nh), b = weichzeichnen(src, w, h);
  for (let y = 0; y < nh; y++) {
    const sy = Math.min(h - 1.001, (y + 0.5) * f - 0.5), y0 = Math.max(0, Math.floor(sy)), fy = Math.max(0, sy - y0);
    for (let x = 0; x < nw; x++) {
      const sx = Math.min(w - 1.001, (x + 0.5) * f - 0.5), x0 = Math.max(0, Math.floor(sx)), fx = Math.max(0, sx - x0), i = y0 * w + x0;
      o[y * nw + x] = (b[i] * (1 - fx) + b[i + 1] * fx) * (1 - fy) + (b[i + w] * (1 - fx) + b[i + w + 1] * fx) * fy;
    }
  }
  return { b: o, w: nw, h: nh };
}
function popcount(v) { v = v - ((v >>> 1) & 0x55555555); v = (v & 0x33333333) + ((v >>> 2) & 0x33333333); return (((v + (v >>> 4)) & 0x0F0F0F0F) * 0x01010101) >>> 24; }
function merkmale(rgba, w, h, nMax, schwelle) {
  const RAND = 20, F = 1.25;
  const ebenen = [{ b: grauAus(rgba, w, h), w: w, h: h, s: 1 }];
  while (ebenen.length < 8) {
    const e = ebenen[ebenen.length - 1]; if (Math.min(e.w, e.h) / F < 90) break;
    const n = verkleinern(e.b, e.w, e.h, F); n.s = e.s * F; ebenen.push(n);
  }
  const fa = 1 / (F * F); let summe = 0; ebenen.forEach(function (e, l) { summe += Math.pow(fa, l); });
  const xs = [], ys = [], ls = [], ws = [], rs = [], ds = [];
  ebenen.forEach(function (e, l) {
    const B = e.b, W = e.w, H = e.h, ziel = Math.round(nMax * Math.pow(fa, l) / summe * 1.0) + 10;
    const off = KREIS.map(function (k) { return k[1] * W + k[0]; });
    let t = schwelle || 18;
    let kand;
    for (let versuch = 0; versuch < 3; versuch++) {
      kand = [];
      const score = new Float32Array(W * H);
      for (let y = RAND; y < H - RAND; y++) for (let x = RAND; x < W - RAND; x++) {
        const p = y * W + x, v = B[p], hi = v + t, lo = v - t;
        let nh = 0, nl = 0;
        for (let k = 0; k < 16; k += 4) { const q = B[p + off[k]]; if (q > hi) nh++; else if (q < lo) nl++; }
        if (nh < 2 && nl < 2) continue;
        let lauf = 0, best = 0, typ = 0, s = 0;
        for (let k = 0; k < 25; k++) {
          const q = B[p + off[k & 15]], c = q > hi ? 1 : q < lo ? -1 : 0;
          if (c !== 0 && c === typ) lauf++; else { typ = c; lauf = c !== 0 ? 1 : 0; }
          if (lauf > best) best = lauf;
        }
        if (best < 9) continue;
        for (let k = 0; k < 16; k++) { const d = Math.abs(B[p + off[k]] - v) - t; if (d > 0) s += d; }
        score[p] = s; kand.push(p);
      }
      // Nicht-Maximum-Unterdrückung 3x3
      kand = kand.filter(function (p) { const s = score[p]; return s >= score[p - 1] && s > score[p + 1] && s >= score[p - W] && s > score[p + W] && s >= score[p - W - 1] && s > score[p + W + 1] && s >= score[p - W + 1] && s > score[p + W - 1]; });
      if (kand.length >= ziel * 1.5 || t <= 7) break;
      t = Math.max(7, Math.round(t * 0.6));
    }
    // Harris-Antwort 7x7
    const harris = function (p) {
      let sxx = 0, syy = 0, sxy = 0;
      for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
        const q = p + dy * W + dx, gx = (B[q + 1] - B[q - 1]) * 2 + B[q - W + 1] - B[q - W - 1] + B[q + W + 1] - B[q + W - 1], gy = (B[q + W] - B[q - W]) * 2 + B[q + W - 1] - B[q - W - 1] + B[q + W + 1] - B[q - W + 1];
        sxx += gx * gx; syy += gy * gy; sxy += gx * gy;
      }
      return sxx * syy - sxy * sxy - 0.04 * (sxx + syy) * (sxx + syy);
    };
    const bew = kand.map(function (p) { return [p, harris(p)]; }).sort(function (a, b) { return b[1] - a[1]; });
    // gleichmäßig verteilen: Raster mit begrenzter Anzahl je Zelle
    const Z = 36, zw = Math.ceil(W / Z), zh = Math.ceil(H / Z), belegt = new Uint16Array(zw * zh), jeZelle = Math.max(2, Math.ceil(ziel / (zw * zh) * 2.5));
    const gewaehlt = [];
    for (let i = 0; i < bew.length && gewaehlt.length < ziel; i++) { const p = bew[i][0], c = Math.floor((p % W) / Z) + Math.floor(p / W / Z) * zw; if (belegt[c] >= jeZelle) continue; belegt[c]++; gewaehlt.push(bew[i]); }
    if (!gewaehlt.length) return;
    const G = weichzeichnen(B, W, H);
    gewaehlt.forEach(function (gp) {
      const p = gp[0], x = p % W, y = (p - x) / W;
      let m10 = 0, m01 = 0;
      for (let dy = -15; dy <= 15; dy++) { const r = Math.floor(Math.sqrt(225 - dy * dy)); for (let dx = -r; dx <= r; dx++) { const v = B[p + dy * W + dx]; m10 += dx * v; m01 += dy * v; } }
      const a = Math.atan2(m01, m10), st = ((Math.round(a / (2 * Math.PI) * WINKEL_STUFEN) % WINKEL_STUFEN) + WINKEL_STUFEN) % WINKEL_STUFEN, M = MUSTER_GEDREHT[st];
      const d = new Uint32Array(8);
      for (let i = 0; i < 256; i++) { const k = i * 4; if (G[p + M[k + 1] * W + M[k]] < G[p + M[k + 3] * W + M[k + 2]]) d[i >> 5] |= (1 << (i & 31)); }
      xs.push((x + 0.5) * e.s - 0.5); ys.push((y + 0.5) * e.s - 0.5); ls.push(l); ws.push(a); rs.push(gp[1]); ds.push(d);
    });
  });
  const n = xs.length, D = new Uint32Array(n * 8), farbe = new Uint8Array(n * 3);
  for (let i = 0; i < n; i++) {
    D.set(ds[i], i * 8);
    const px = Math.min(w - 1, Math.max(0, Math.round(xs[i]))), py = Math.min(h - 1, Math.max(0, Math.round(ys[i]))), j = (py * w + px) * 4;
    farbe[i * 3] = rgba[j]; farbe[i * 3 + 1] = rgba[j + 1]; farbe[i * 3 + 2] = rgba[j + 2];
  }
  return { n: n, x: Float32Array.from(xs), y: Float32Array.from(ys), ebene: Uint8Array.from(ls), winkel: Float32Array.from(ws), antwort: Float32Array.from(rs), d: D, farbe: farbe };
}
// ---------- Zuordnen und Zwei-Bild-Geometrie ----------
// gegenseitig beste Zuordnung mit Verhältnistest; ia/ib: Indexlisten oder null (alle)
function zuordnen(A, B, ia, ib, verh, maxD) {
  const na = ia ? ia.length : A.n, nb = ib ? ib.length : B.n, da = A.d, db = B.d;
  const bestA = new Int32Array(na).fill(-1), d1A = new Uint16Array(na).fill(999), d2A = new Uint16Array(na).fill(999);
  const bestB = new Int32Array(nb).fill(-1), d1B = new Uint16Array(nb).fill(999);
  for (let a = 0; a < na; a++) {
    const i = (ia ? ia[a] : a) * 8, a0 = da[i], a1 = da[i + 1], a2 = da[i + 2], a3 = da[i + 3], a4 = da[i + 4], a5 = da[i + 5], a6 = da[i + 6], a7 = da[i + 7];
    let b1 = 999, b2 = 999, bj = -1;
    for (let b = 0; b < nb; b++) {
      const j = (ib ? ib[b] : b) * 8;
      const d = popcount(a0 ^ db[j]) + popcount(a1 ^ db[j + 1]) + popcount(a2 ^ db[j + 2]) + popcount(a3 ^ db[j + 3]) + popcount(a4 ^ db[j + 4]) + popcount(a5 ^ db[j + 5]) + popcount(a6 ^ db[j + 6]) + popcount(a7 ^ db[j + 7]);
      if (d < b1) { b2 = b1; b1 = d; bj = b; } else if (d < b2) b2 = d;
      if (d < d1B[b]) { d1B[b] = d; bestB[b] = a; }
    }
    bestA[a] = bj; d1A[a] = b1; d2A[a] = b2;
  }
  const paare = [];
  for (let a = 0; a < na; a++) {
    const b = bestA[a]; if (b < 0 || bestB[b] !== a || d1A[a] > maxD || d1A[a] >= verh * d2A[a]) continue;
    paare.push([ia ? ia[a] : a, ib ? ib[b] : b, d1A[a] / Math.max(1, d2A[a])]);
  }
  return paare;
}
function normieren(pts) { // Hartley: Schwerpunkt 0, mittlerer Abstand √2
  const n = pts.length / 2; let mx = 0, my = 0; for (let i = 0; i < n; i++) { mx += pts[2 * i]; my += pts[2 * i + 1]; } mx /= n; my /= n;
  let d = 0; for (let i = 0; i < n; i++) d += Math.hypot(pts[2 * i] - mx, pts[2 * i + 1] - my); d = d / n || 1;
  const s = Math.SQRT2 / d; return { T: [s, 0, -s * mx, 0, s, -s * my, 0, 0, 1], s: s, mx: mx, my: my };
}
function essentiell8(p1, p2, idx) { // p1, p2: normierte Kamerakoordinaten (x0,y0,x1,y1,…); x2ᵀ E x1 = 0
  const n = idx.length, a = [], b = [];
  for (let k = 0; k < n; k++) { const i = idx[k]; a.push(p1[2 * i], p1[2 * i + 1]); b.push(p2[2 * i], p2[2 * i + 1]); }
  const N1 = normieren(a), N2 = normieren(b), A = new Float64Array(n * 9);
  for (let k = 0; k < n; k++) {
    const x1 = N1.s * (a[2 * k] - N1.mx), y1 = N1.s * (a[2 * k + 1] - N1.my), x2 = N2.s * (b[2 * k] - N2.mx), y2 = N2.s * (b[2 * k + 1] - N2.my);
    A.set([x2 * x1, x2 * y1, x2, y2 * x1, y2 * y1, y2, x1, y1, 1], k * 9);
  }
  const e = nullvektor(A, n, 9);
  let E = m3(m3(m3t(N2.T), Array.prototype.slice.call(e)), N1.T);
  const s = svd3(E), m = (s.S[0] + s.S[1]) / 2;
  E = m3(m3(s.U, [m, 0, 0, 0, m, 0, 0, 0, 0]), m3t(s.V));
  const l = Math.sqrt(E.reduce(function (q, v) { return q + v * v; }, 0)) || 1;
  return E.map(function (v) { return v / l; });
}
function sampson(E, x1, y1, x2, y2) {
  const ex0 = E[0] * x1 + E[1] * y1 + E[2], ex1 = E[3] * x1 + E[4] * y1 + E[5], ex2 = E[6] * x1 + E[7] * y1 + E[8];
  const et0 = E[0] * x2 + E[3] * y2 + E[6], et1 = E[1] * x2 + E[4] * y2 + E[7];
  const r = x2 * ex0 + y2 * ex1 + ex2;
  return r * r / (ex0 * ex0 + ex1 * ex1 + et0 * et0 + et1 * et1 + 1e-30);
}
function homographie4(p1, p2, idx) {
  const n = idx.length, A = new Float64Array(2 * n * 9);
  for (let k = 0; k < n; k++) {
    const i = idx[k], x = p1[2 * i], y = p1[2 * i + 1], u = p2[2 * i], v = p2[2 * i + 1];
    A.set([-x, -y, -1, 0, 0, 0, u * x, u * y, u], 2 * k * 9); A.set([0, 0, 0, -x, -y, -1, v * x, v * y, v], (2 * k + 1) * 9);
  }
  return Array.prototype.slice.call(nullvektor(A, 2 * n, 9));
}
function hFehler(H, x, y, u, v) { const w = H[6] * x + H[7] * y + H[8]; if (Math.abs(w) < 1e-12) return 1e9; const a = (H[0] * x + H[1] * y + H[2]) / w - u, b = (H[3] * x + H[4] * y + H[5]) / w - v; return a * a + b * b; }
// Triangulation zweier normierter Beobachtungen mit P1=[R1|t1], P2=[R2|t2]
function triangulieren(beob) { // beob: [[R,t,x,y],…]
  const n = beob.length, A = new Float64Array(2 * n * 4);
  beob.forEach(function (b, k) {
    const R = b[0], t = b[1], x = b[2], y = b[3];
    for (let c = 0; c < 3; c++) { A[(2 * k) * 4 + c] = x * R[6 + c] - R[c]; A[(2 * k + 1) * 4 + c] = y * R[6 + c] - R[3 + c]; }
    A[(2 * k) * 4 + 3] = x * t[2] - t[0]; A[(2 * k + 1) * 4 + 3] = y * t[2] - t[1];
  });
  const v = nullvektor(A, 2 * n, 4); if (Math.abs(v[3]) < 1e-14) return null;
  return [v[0] / v[3], v[1] / v[3], v[2] / v[3]];
}
const I3 = [1, 0, 0, 0, 1, 0, 0, 0, 1], NULL3 = [0, 0, 0];
function poseAusE(E, p1, p2, idx) { // vier Lösungen, die mit den meisten Punkten vor beiden Kameras
  const s = svd3(E); let U = s.U, V = s.V;
  if (m3det(U) < 0) U = U.map(function (v, i) { return i % 3 === 2 ? -v : v; });
  if (m3det(V) < 0) V = V.map(function (v, i) { return i % 3 === 2 ? -v : v; });
  const W = [0, -1, 0, 1, 0, 0, 0, 0, 1], R1 = m3(m3(U, W), m3t(V)), R2 = m3(m3(U, m3t(W)), m3t(V)), t = [U[2], U[5], U[8]];
  const kand = [[R1, t], [R1, v3mal(t, -1)], [R2, t], [R2, v3mal(t, -1)]];
  let best = null;
  const probe = idx.length > 200 ? idx.filter(function (_, k) { return k % Math.ceil(idx.length / 200) === 0; }) : idx;
  kand.forEach(function (k) {
    let vor = 0;
    probe.forEach(function (i) {
      const X = triangulieren([[I3, NULL3, p1[2 * i], p1[2 * i + 1]], [k[0], k[1], p2[2 * i], p2[2 * i + 1]]]);
      if (X && X[2] > 0 && m3v(k[0], X)[2] + k[1][2] > 0) vor++;
    });
    if (!best || vor > best.vor) best = { R: k[0], t: k[1], vor: vor };
  });
  return best;
}
// Zerlegung einer Homographie (normierte Koordinaten) in bis zu 8 Lagen (Faugeras)
function poseAusH(H) {
  const s = svd3(H), U = s.U, V = s.V, sg = m3det(U) * m3det(V), d1 = s.S[0], d2 = s.S[1], d3 = s.S[2];
  if (d1 / d2 < 1.00001 || d2 / d3 < 1.00001) return [];
  const a1 = Math.sqrt((d1 * d1 - d2 * d2) / (d1 * d1 - d3 * d3)), a3 = Math.sqrt((d2 * d2 - d3 * d3) / (d1 * d1 - d3 * d3));
  const x1 = [a1, a1, -a1, -a1], x3 = [a3, -a3, a3, -a3], l = [];
  const st = Math.sqrt((d1 * d1 - d2 * d2) * (d2 * d2 - d3 * d3)) / ((d1 + d3) * d2), ct = (d2 * d2 + d1 * d3) / ((d1 + d3) * d2);
  const sp = Math.sqrt((d1 * d1 - d2 * d2) * (d2 * d2 - d3 * d3)) / ((d1 - d3) * d2), cp = (d1 * d3 - d2 * d2) / ((d1 - d3) * d2);
  const stv = [st, -st, -st, st], spv = [sp, -sp, -sp, sp];
  for (let i = 0; i < 4; i++) {
    const Rp = [ct, 0, -stv[i], 0, 1, 0, stv[i], 0, ct], R = m3(m3(U, Rp), m3t(V)).map(function (v) { return v * sg; });
    l.push({ R: R, t: v3norm(m3v(U, [x1[i] * (d1 - d3), 0, -x3[i] * (d1 - d3)])) });
  }
  for (let i = 0; i < 4; i++) {
    const Rp = [cp, 0, spv[i], 0, -1, 0, spv[i], 0, -cp], R = m3(m3(U, Rp), m3t(V)).map(function (v) { return v * sg; });
    l.push({ R: R, t: v3norm(m3v(U, [x1[i] * (d1 + d3), 0, x3[i] * (d1 + d3)])) });
  }
  return l.filter(function (q) { return Math.abs(m3det(q.R) - 1) < 1e-3; });
}
function eAusPose(R, t) { return m3(schief(t), R); }
// Zwei-Bild-Prüfung: Zuordnungen → Essentialmatrix mit RANSAC, Homographie-Anteil, Pose und Schnittwinkel
function zweiBild(A, B, KA, KB, paare, schwellePx) {
  const n = paare.length; if (n < 20) return null;
  const p1 = new Float64Array(2 * n), p2 = new Float64Array(2 * n);
  paare.forEach(function (m, k) {
    p1[2 * k] = (A.x[m[0]] - KA.cx) / KA.f; p1[2 * k + 1] = (A.y[m[0]] - KA.cy) / KA.f;
    p2[2 * k] = (B.x[m[1]] - KB.cx) / KB.f; p2[2 * k + 1] = (B.y[m[1]] - KB.cy) / KB.f;
  });
  const fm = Math.sqrt(KA.f * KB.f), thr = Math.pow(schwellePx / fm, 2), zf = zufallMit(n * 7919 + 13);
  const reihe = paare.map(function (m, k) { return k; }).sort(function (a, b) { return paare[a][2] - paare[b][2]; });
  let bestE = null, bestN = 0, iter = 3000;
  for (let it = 0; it < iter; it++) {
    const pool = it < 400 ? Math.max(12, Math.floor(n * 0.4)) : n;
    const s = stichprobe(pool, 8, zf).map(function (k) { return reihe[k]; });
    const E = essentiell8(p1, p2, s); let c = 0;
    for (let k = 0; k < n; k++) if (sampson(E, p1[2 * k], p1[2 * k + 1], p2[2 * k], p2[2 * k + 1]) < thr) c++;
    if (c > bestN) { bestN = c; bestE = E; const w = c / n; iter = Math.min(3000, Math.max(50, Math.ceil(Math.log(0.001) / Math.log(1 - Math.pow(w, 8) + 1e-12)))); }
  }
  // Homographie auf allen Zuordnungen (ebene Szenen: Dach, Boden, Fassade)
  let bestH = null, nH = 0; const thrH = Math.pow(schwellePx * 1.5 / fm, 2);
  for (let it = 0; it < 600; it++) {
    const s = stichprobe(n, 4, zf).map(function (k) { return reihe[k]; }), H = homographie4(p1, p2, s); let c = 0;
    for (let k = 0; k < n; k++) if (hFehler(H, p1[2 * k], p1[2 * k + 1], p2[2 * k], p2[2 * k + 1]) < thrH) c++;
    if (c > nH) { nH = c; bestH = H; }
  }
  let ausH = null;
  if (bestH && nH >= 15 && nH > 0.6 * bestN) {
    const hin = []; for (let k = 0; k < n; k++) if (hFehler(bestH, p1[2 * k], p1[2 * k + 1], p2[2 * k], p2[2 * k + 1]) < thrH) hin.push(k);
    if (hin.length >= 8) bestH = homographie4(p1, p2, hin);
    poseAusH(bestH).forEach(function (q) {
      const E = eAusPose(q.R, q.t); let c = 0, vor = 0;
      for (let k = 0; k < n; k++) if (sampson(E, p1[2 * k], p1[2 * k + 1], p2[2 * k], p2[2 * k + 1]) < thr) c++;
      hin.forEach(function (i, z) { if (z % 3) return; const X = triangulieren([[I3, NULL3, p1[2 * i], p1[2 * i + 1]], [q.R, q.t, p2[2 * i], p2[2 * i + 1]]]); if (X && X[2] > 0 && m3v(q.R, X)[2] + q.t[2] > 0) vor++; });
      const wert = c * vor; if (!ausH || wert > ausH.wert) ausH = { R: q.R, t: q.t, E: E, c: c, wert: wert };
    });
    if (ausH && ausH.c >= Math.max(15, 0.9 * bestN)) { bestE = ausH.E; bestN = ausH.c; } else ausH = null;
  }
  if (!bestE || bestN < 15) return null;
  let inl = [];
  for (let r = 0; r < 2 && !ausH; r++) {
    inl = []; for (let k = 0; k < n; k++) if (sampson(bestE, p1[2 * k], p1[2 * k + 1], p2[2 * k], p2[2 * k + 1]) < thr) inl.push(k);
    if (inl.length >= 8) { const E2 = essentiell8(p1, p2, inl); let c = 0; for (let k = 0; k < n; k++) if (sampson(E2, p1[2 * k], p1[2 * k + 1], p2[2 * k], p2[2 * k + 1]) < thr) c++; if (c >= inl.length) bestE = E2; }
  }
  inl = []; for (let k = 0; k < n; k++) if (sampson(bestE, p1[2 * k], p1[2 * k + 1], p2[2 * k], p2[2 * k + 1]) < thr) inl.push(k);
  if (inl.length < 15) return null;
  const bestHAnteil = Math.min(1, nH / inl.length);
  const pose = ausH ? { R: ausH.R, t: ausH.t } : poseAusE(bestE, p1, p2, inl);
  const winkel = [];
  const C2 = v3mal(m3v(m3t(pose.R), pose.t), -1);
  inl.forEach(function (i, k) {
    if (k % Math.max(1, Math.floor(inl.length / 150))) return;
    const X = triangulieren([[I3, NULL3, p1[2 * i], p1[2 * i + 1]], [pose.R, pose.t, p2[2 * i], p2[2 * i + 1]]]); if (!X) return;
    const a = v3norm(X), b = v3norm(v3sub(X, C2)); winkel.push(Math.acos(Math.max(-1, Math.min(1, v3dot(a, b)))) * 180 / Math.PI);
  });
  const m = new Int32Array(inl.length * 2);
  inl.forEach(function (k, j) { m[2 * j] = paare[k][0]; m[2 * j + 1] = paare[k][1]; });
  return { m: m, n: inl.length, hAnteil: bestHAnteil, R: pose.R, t: pose.t, winkel: median(winkel) };
}
// ---------- Struktur aus Bewegung: Spuren, schrittweise Kameraausrichtung, Bündelausgleich ----------
function projizieren(R, t, gr, cx, cy, X) {
  const a = R[0] * X[0] + R[1] * X[1] + R[2] * X[2] + t[0], b = R[3] * X[0] + R[4] * X[1] + R[5] * X[2] + t[1], c = R[6] * X[0] + R[7] * X[1] + R[8] * X[2] + t[2];
  if (c <= 1e-9) return null;
  const x = a / c, y = b / c, d = 1 + gr.k1 * (x * x + y * y);
  return [gr.f * d * x + cx, gr.f * d * y + cy, c];
}
function entzerren(gr, cx, cy, u, v) { // Pixel → normierte, entzerrte Koordinaten
  const xd = (u - cx) / gr.f, yd = (v - cy) / gr.f; let x = xd, y = yd;
  for (let k = 0; k < 6; k++) { const d = 1 + gr.k1 * (x * x + y * y); x = xd / d; y = yd / d; }
  return [x, y];
}
function sfm(bilder, gruppen, paare, melden) {
  const nB = bilder.length, off = [0];
  for (let i = 0; i < nB; i++) off.push(off[i] + bilder[i].n);
  // Spuren über Vereinigungsmengen
  const eltern = new Int32Array(off[nB]); for (let i = 0; i < eltern.length; i++) eltern[i] = i;
  const wurzel = function (a) { while (eltern[a] !== a) { eltern[a] = eltern[eltern[a]]; a = eltern[a]; } return a; };
  // Vereinigung nur, wenn dabei kein Bild zwei verschiedene Merkmale in derselben Spur bekommt (beste Paare zuerst)
  const bildVon = new Int32Array(off[nB]); for (let i = 0; i < nB; i++) for (let k = off[i]; k < off[i + 1]; k++) bildVon[k] = i;
  const mengen = {};
  const menge = function (r) { if (!mengen[r]) { const m = {}; m[bildVon[r]] = r; mengen[r] = m; } return mengen[r]; };
  paare.slice().sort(function (a, b) { return b.n - a.n; }).forEach(function (p) {
    for (let k = 0; k < p.n; k++) {
      const ga = off[p.i] + p.m[2 * k], gb = off[p.j] + p.m[2 * k + 1];
      let a = wurzel(ga), b = wurzel(gb); if (a === b) continue;
      let A = menge(a), B = menge(b), ka = Object.keys(A), kb = Object.keys(B);
      if (ka.length < kb.length) { const t = a; a = b; b = t; const T = A; A = B; B = T; const q = ka; ka = kb; kb = q; }
      let konflikt = false; for (let q = 0; q < kb.length; q++) if (A[kb[q]] !== undefined) { konflikt = true; break; }
      if (konflikt) continue;
      kb.forEach(function (x) { A[x] = B[x]; }); delete mengen[b]; eltern[b] = a;
    }
  });
  const spuren = [], spurVon = [];
  for (let i = 0; i < nB; i++) spurVon.push(new Int32Array(bilder[i].n).fill(-1));
  Object.keys(mengen).forEach(function (r) {
    const m = mengen[r], bs = Object.keys(m); if (bs.length < 2) return;
    const id = spuren.length, beob = [];
    bs.forEach(function (b) { const g = m[b], bi = Number(b), mi = g - off[bi]; beob.push({ b: bi, m: mi, aus: false }); spurVon[bi][mi] = id; });
    spuren.push({ beob: beob, X: null });
  });
  melden({ text: spuren.length + ' Spuren aus ' + paare.length + ' Bildpaaren', spuren: spuren.length });
  const kam = []; for (let i = 0; i < nB; i++) kam.push({ reg: false, R: null, t: null, versuche: 0 });
  const K = bilder.map(function (b) { return { cx: b.cx, cy: b.cy, g: b.gruppe }; });
  const gr = gruppen.map(function (g) { return { f: g.f, k1: 0 }; });
  const pix = function (i, m) { return [bilder[i].x[m], bilder[i].y[m]]; };
  const fehlerPx = function (s, o) { const p = projizieren(kam[o.b].R, kam[o.b].t, gr[K[o.b].g], K[o.b].cx, K[o.b].cy, s.X); if (!p) return 1e9; const q = pix(o.b, o.m); return Math.hypot(p[0] - q[0], p[1] - q[1]); };
  const zentrum = function (i) { return v3mal(m3v(m3t(kam[i].R), kam[i].t), -1); };
  function triangulierenSpur(s, schwelle, minWinkel) {
    const reg = s.beob.filter(function (o) { return kam[o.b].reg && !o.aus; }); if (reg.length < 2) return false;
    const beob = reg.map(function (o) { const q = pix(o.b, o.m), n = entzerren(gr[K[o.b].g], K[o.b].cx, K[o.b].cy, q[0], q[1]); return [kam[o.b].R, kam[o.b].t, n[0], n[1]]; });
    const X = triangulieren(beob); if (!X) return false;
    let wmax = 0; const strahlen = reg.map(function (o) { return v3norm(v3sub(X, zentrum(o.b))); });
    for (let a = 0; a < strahlen.length; a++) for (let b = a + 1; b < strahlen.length; b++) wmax = Math.max(wmax, Math.acos(Math.max(-1, Math.min(1, v3dot(strahlen[a], strahlen[b])))));
    if (wmax * 180 / Math.PI < minWinkel) return false;
    const alt = s.X; s.X = X;
    for (let k = 0; k < reg.length; k++) if (fehlerPx(s, reg[k]) > schwelle) { s.X = alt; return false; }
    return true;
  }
  // ---------- Bündelausgleich (Levenberg-Marquardt mit Schur-Komplement) ----------
  function ausgleich(frei, intrFrei, spurListe, maxIter) {
    const kIdx = {}; frei.forEach(function (i, k) { kIdx[i] = k; });
    const nk = frei.length, nG = gr.length, Nc = 6 * nk + (intrFrei ? 2 * nG : 0), DELTA = 2;
    const sl = spurListe.filter(function (s) { return s.X; });
    function kosten() {
      let c = 0;
      sl.forEach(function (s) { s.beob.forEach(function (o) { if (o.aus || !kam[o.b].reg) return; const e = fehlerPx(s, o); c += e < DELTA ? e * e : 2 * DELTA * e - DELTA * DELTA; }); });
      return c;
    }
    let lambda = 1e-3, c0 = kosten();
    for (let it = 0; it < maxIter; it++) {
      const U = new Float64Array(Nc * Nc), gc = new Float64Array(Nc), pkt = [];
      sl.forEach(function (s) {
        const V = new Float64Array(9), gp = new Float64Array(3), ws = [];
        s.beob.forEach(function (o) {
          if (o.aus || !kam[o.b].reg) return;
          const R = kam[o.b].R, t = kam[o.b].t, g = gr[K[o.b].g], X = s.X;
          const RX = m3v(R, X), Xc = v3add(RX, t); if (Xc[2] <= 1e-9) return;
          const a = Xc[0], b = Xc[1], c = Xc[2], x = a / c, y = b / c, r2 = x * x + y * y, d = 1 + g.k1 * r2;
          const q = pix(o.b, o.m), ru = g.f * d * x + K[o.b].cx - q[0], rv = g.f * d * y + K[o.b].cy - q[1];
          const e = Math.sqrt(ru * ru + rv * rv), w = e < DELTA ? 1 : DELTA / e;
          const dux = g.f * (d + 2 * g.k1 * x * x), duy = g.f * 2 * g.k1 * x * y, dvx = duy, dvy = g.f * (d + 2 * g.k1 * y * y);
          // ∂(u,v)/∂Xc
          const P = [(dux / c), (duy / c), (-(dux * x + duy * y) / c), (dvx / c), (dvy / c), (-(dvx * x + dvy * y) / c)];
          const Jp = [P[0] * R[0] + P[1] * R[3] + P[2] * R[6], P[0] * R[1] + P[1] * R[4] + P[2] * R[7], P[0] * R[2] + P[1] * R[5] + P[2] * R[8],
            P[3] * R[0] + P[4] * R[3] + P[5] * R[6], P[3] * R[1] + P[4] * R[4] + P[5] * R[7], P[3] * R[2] + P[4] * R[5] + P[5] * R[8]];
          const cols = [], Jc = [[], []];
          if (kIdx[o.b] !== undefined) {
            const S = schief(RX), o6 = 6 * kIdx[o.b];
            for (let k = 0; k < 3; k++) { cols.push(o6 + k); Jc[0].push(-(P[0] * S[k] + P[1] * S[3 + k] + P[2] * S[6 + k])); Jc[1].push(-(P[3] * S[k] + P[4] * S[3 + k] + P[5] * S[6 + k])); }
            for (let k = 0; k < 3; k++) { cols.push(o6 + 3 + k); Jc[0].push(P[k]); Jc[1].push(P[3 + k]); }
          }
          if (intrFrei) { const oi = 6 * nk + 2 * K[o.b].g; cols.push(oi, oi + 1); Jc[0].push(d * x, g.f * r2 * x); Jc[1].push(d * y, g.f * r2 * y); }
          for (let i = 0; i < 3; i++) { gp[i] += w * (Jp[i] * ru + Jp[3 + i] * rv); for (let j = 0; j < 3; j++) V[i * 3 + j] += w * (Jp[i] * Jp[j] + Jp[3 + i] * Jp[3 + j]); }
          const nc = cols.length; if (!nc) return;
          const Wb = new Float64Array(nc * 3);
          for (let i = 0; i < nc; i++) {
            const ci = cols[i]; gc[ci] += w * (Jc[0][i] * ru + Jc[1][i] * rv);
            for (let j = 0; j < nc; j++) U[ci * Nc + cols[j]] += w * (Jc[0][i] * Jc[0][j] + Jc[1][i] * Jc[1][j]);
            for (let j = 0; j < 3; j++) Wb[i * 3 + j] = w * (Jc[0][i] * Jp[j] + Jc[1][i] * Jp[3 + j]);
          }
          ws.push({ cols: cols, W: Wb });
        });
        pkt.push({ s: s, V: V, gp: gp, ws: ws });
      });
      let erfolg = false;
      for (let versuch = 0; versuch < 8 && !erfolg; versuch++) {
        const S = new Float64Array(Nc * Nc), rhs = new Float64Array(Nc);
        for (let i = 0; i < Nc * Nc; i++) S[i] = U[i];
        for (let i = 0; i < Nc; i++) { S[i * Nc + i] += lambda * Math.max(U[i * Nc + i], 1e-6) + 1e-9; rhs[i] = -gc[i]; }
        const Vinv = [];
        pkt.forEach(function (p, pi) {
          const V = p.V.slice(); for (let i = 0; i < 3; i++) V[i * 4] += lambda * Math.max(V[i * 4], 1e-6) + 1e-9;
          const Vi = m3inv(Array.prototype.slice.call(V)) || [0, 0, 0, 0, 0, 0, 0, 0, 0]; Vinv[pi] = Vi;
          const WV = p.ws.map(function (wb) { const n = wb.cols.length, r = new Float64Array(n * 3); for (let i = 0; i < n; i++) for (let j = 0; j < 3; j++) r[i * 3 + j] = wb.W[i * 3] * Vi[j] + wb.W[i * 3 + 1] * Vi[3 + j] + wb.W[i * 3 + 2] * Vi[6 + j]; return r; });
          p.ws.forEach(function (a, ai) {
            const WVa = WV[ai], na = a.cols.length;
            for (let i = 0; i < na; i++) rhs[a.cols[i]] += WVa[i * 3] * p.gp[0] + WVa[i * 3 + 1] * p.gp[1] + WVa[i * 3 + 2] * p.gp[2];
            p.ws.forEach(function (b) {
              const nb = b.cols.length;
              for (let i = 0; i < na; i++) { const row = a.cols[i] * Nc; for (let j = 0; j < nb; j++) S[row + b.cols[j]] -= WVa[i * 3] * b.W[j * 3] + WVa[i * 3 + 1] * b.W[j * 3 + 1] + WVa[i * 3 + 2] * b.W[j * 3 + 2]; }
            });
          });
        });
        const dc = Nc ? cholLoesen(S, rhs, Nc) : new Float64Array(0);
        // Sicherung, Schritt anwenden
        const altK = frei.map(function (i) { return [kam[i].R, kam[i].t]; }), altG = gr.map(function (g) { return [g.f, g.k1]; }), altX = pkt.map(function (p) { return p.s.X; });
        frei.forEach(function (i, k) { const o = 6 * k; kam[i].R = m3(rodrigues([dc[o], dc[o + 1], dc[o + 2]]), kam[i].R); kam[i].t = [kam[i].t[0] + dc[o + 3], kam[i].t[1] + dc[o + 4], kam[i].t[2] + dc[o + 5]]; });
        if (intrFrei) gr.forEach(function (g, gi) { const o = 6 * nk + 2 * gi; g.f = Math.max(g.f * 0.3, g.f + dc[o]); g.k1 = Math.max(-0.5, Math.min(0.5, g.k1 + dc[o + 1])); });
        pkt.forEach(function (p, pi) {
          const r = [p.gp[0], p.gp[1], p.gp[2]];
          p.ws.forEach(function (wb) { for (let i = 0; i < wb.cols.length; i++) { const v = dc[wb.cols[i]]; r[0] += wb.W[i * 3] * v; r[1] += wb.W[i * 3 + 1] * v; r[2] += wb.W[i * 3 + 2] * v; } });
          const d = m3v(Vinv[pi], r); p.s.X = [p.s.X[0] - d[0], p.s.X[1] - d[1], p.s.X[2] - d[2]];
        });
        const c1 = kosten();
        if (c1 < c0 && isFinite(c1)) { erfolg = true; lambda = Math.max(1e-7, lambda / 3); if ((c0 - c1) / c0 < 1e-6) it = maxIter; c0 = c1; }
        else {
          frei.forEach(function (i, k) { kam[i].R = altK[k][0]; kam[i].t = altK[k][1]; }); gr.forEach(function (g, gi) { g.f = altG[gi][0]; g.k1 = altG[gi][1]; });
          pkt.forEach(function (p, pi) { p.s.X = altX[pi]; }); lambda *= 5;
        }
      }
      if (!erfolg) break;
    }
    return c0;
  }
  function filtern(spurListe, schwelle) {
    let weg = 0;
    spurListe.forEach(function (s) {
      if (!s.X) return;
      s.beob.forEach(function (o) { if (!o.aus && kam[o.b].reg && fehlerPx(s, o) > schwelle) { o.aus = true; weg++; } });
      const reg = s.beob.filter(function (o) { return !o.aus && kam[o.b].reg; });
      if (reg.length < 2) { s.X = null; return; }
      let wmax = 0; const st = reg.map(function (o) { return v3norm(v3sub(s.X, zentrum(o.b))); });
      for (let a = 0; a < st.length; a++) for (let b = a + 1; b < st.length; b++) wmax = Math.max(wmax, Math.acos(Math.max(-1, Math.min(1, v3dot(st[a], st[b])))));
      if (wmax * 180 / Math.PI < 1) s.X = null;
    });
    return weg;
  }
  // ---------- Startpaar ----------
  const kandidaten = paare.filter(function (p) { return p.n >= 40 && p.winkel >= 2; }).sort(function (a, b) {
    const s = function (p) { return p.n * (p.hAnteil < 0.8 ? 1 : 0.25) * Math.min(1, p.winkel / 8); };
    return s(b) - s(a);
  });
  let start = null;
  for (let ki = 0; ki < Math.min(6, kandidaten.length) && !start; ki++) {
    const p = kandidaten[ki];
    kam.forEach(function (k) { k.reg = false; }); spuren.forEach(function (s) { s.X = null; s.beob.forEach(function (o) { o.aus = false; }); });
    kam[p.i].reg = true; kam[p.i].R = I3.slice(); kam[p.i].t = [0, 0, 0];
    kam[p.j].reg = true; kam[p.j].R = p.R.slice(); kam[p.j].t = p.t.slice();
    let n = 0; spuren.forEach(function (s) { if (s.beob.some(function (o) { return o.b === p.i; }) && s.beob.some(function (o) { return o.b === p.j; }) && triangulierenSpur(s, 6, 1)) n++; });
    if (n < 30) continue;
    const mit = spuren.filter(function (s) { return s.X; });
    ausgleich([p.j], false, mit, 20); filtern(mit, 4);
    if (mit.filter(function (s) { return s.X; }).length >= 30) start = p;
  }
  if (!start) return { fehler: 'Kein geeignetes Startpaar gefunden – die Fotos überlappen zu wenig oder es gibt zu wenig Parallaxe.' };
  const fest = start.i;
  melden({ text: 'Startpaar: Bild ' + (start.i + 1) + ' und ' + (start.j + 1) + ' (' + start.n + ' Zuordnungen, ' + start.winkel.toFixed(1) + '°)', reg: 2 });
  let letzteGlobal = 2;
  // ---------- Schrittweise weitere Kameras ----------
  for (let runde = 0; runde < nB * 3; runde++) {
    let best = -1, bestN = 0;
    for (let i = 0; i < nB; i++) {
      if (kam[i].reg || kam[i].versuche >= 3) continue;
      let c = 0; for (let m = 0; m < bilder[i].n; m++) { const s = spurVon[i][m]; if (s >= 0 && spuren[s].X) c++; }
      if (c > bestN) { bestN = c; best = i; }
    }
    if (best < 0 || bestN < 15) { melden({ text: 'Keine weitere Kamera: bestes Bild ' + (best + 1) + ' mit ' + bestN + ' Punktbezügen' }); break; }
    const i = best, g = gr[K[i].g], X = [], x = [], ms = [];
    for (let m = 0; m < bilder[i].n; m++) { const s = spurVon[i][m]; if (s >= 0 && spuren[s].X) { X.push(spuren[s].X); x.push(entzerren(g, K[i].cx, K[i].cy, bilder[i].x[m], bilder[i].y[m])); ms.push(m); } }
    let pose = null;
    // zuerst aus der relativen Lage zu einem ausgerichteten Nachbarbild (geht auch bei ebenen Szenen), sonst DLT
    const nb = paare.filter(function (p) { return (p.i === i && kam[p.j].reg) || (p.j === i && kam[p.i].reg); }).sort(function (a, b) { return b.n - a.n; }).slice(0, 4);
    for (let q = 0; q < nb.length && (!pose || pose.n < 0.5 * X.length); q++) {
      const p = nb[q], neu = p.j === i, reg = neu ? p.i : p.j, Rr = kam[reg].R, tr = kam[reg].t;
      const Rn = neu ? m3(p.R, Rr) : m3(m3t(p.R), Rr), tb = neu ? m3v(p.R, tr) : m3v(m3t(p.R), tr), d = neu ? p.t : v3mal(m3v(m3t(p.R), p.t), -1);
      const lam = [];
      for (let k = 0; k < X.length; k++) {
        const c = v3add(m3v(Rn, X[k]), tb), dx = d[0] - x[k][0] * d[2], dy = d[1] - x[k][1] * d[2];
        const l = Math.abs(dx) > Math.abs(dy) ? (x[k][0] * c[2] - c[0]) / dx : (x[k][1] * c[2] - c[1]) / dy;
        if (isFinite(l) && l > 0) lam.push(l);
      }
      if (lam.length < 6) continue;
      const l = median(lam), kand = pnpVerfeinern(Rn, v3add(tb, v3mal(d, l)), X, x, 4 / g.f);
      if (kand && (!pose || kand.n > pose.n)) pose = kand;
    }
    if (!pose || pose.n < 0.5 * X.length) { const p2 = pnp(X, x, g.f, 4); if (p2 && (!pose || p2.n > pose.n)) pose = p2; }
    if (!pose || pose.n < 12 || pose.n < 0.2 * X.length) { kam[i].versuche++; melden({ text: 'Bild ' + (i + 1) + ': Lage nicht bestimmbar (' + (pose ? pose.n : 0) + ' von ' + X.length + ' Treffern)' }); continue; }
    kam[i].reg = true; kam[i].R = pose.R; kam[i].t = pose.t;
    // neue Punkte
    const neue = [];
    for (let m = 0; m < bilder[i].n; m++) { const s = spurVon[i][m]; if (s < 0) continue; const sp = spuren[s]; if (!sp.X && triangulierenSpur(sp, 4, 2)) neue.push(sp); }
    // lokaler Ausgleich: neue Kamera und ihre stärksten Nachbarn
    const geteilt = {};
    for (let m = 0; m < bilder[i].n; m++) { const s = spurVon[i][m]; if (s < 0 || !spuren[s].X) continue; spuren[s].beob.forEach(function (o) { if (o.b !== i && kam[o.b].reg) geteilt[o.b] = (geteilt[o.b] || 0) + 1; }); }
    const nachbarn = Object.keys(geteilt).map(Number).filter(function (b) { return b !== fest; }).sort(function (a, b) { return geteilt[b] - geteilt[a]; }).slice(0, 8);
    const frei = [i].concat(nachbarn);
    const lokal = spuren.filter(function (s) { return s.X && s.beob.some(function (o) { return frei.indexOf(o.b) >= 0 && !o.aus; }); });
    ausgleich(frei, false, lokal, 8); filtern(lokal, 4);
    const nReg = kam.filter(function (k) { return k.reg; }).length;
    if (nReg >= letzteGlobal * 1.25 + 1) {
      const alle = kam.map(function (k, j) { return j; }).filter(function (j) { return kam[j].reg && j !== fest; });
      const mit = spuren.filter(function (s) { return s.X; });
      ausgleich(alle, nReg >= 5, mit, 15); filtern(mit, 4); letzteGlobal = nReg;
    }
    melden({ text: 'Kamera ' + (i + 1) + ' ausgerichtet (' + pose.n + ' Treffer, ' + neue.length + ' neue Punkte)', reg: nReg });
  }
  // ---------- Abschluss ----------
  const alle = kam.map(function (k, j) { return j; }).filter(function (j) { return kam[j].reg && j !== fest; });
  let mit = spuren.filter(function (s) { return s.X; });
  ausgleich(alle, true, mit, 25); filtern(mit, 3);
  spuren.forEach(function (s) { if (!s.X) { s.beob.forEach(function (o) { o.aus = false; }); triangulierenSpur(s, 3, 1.5); } });
  mit = spuren.filter(function (s) { return s.X; });
  ausgleich(alle, true, mit, 25); filtern(mit, 2.5);
  mit = spuren.filter(function (s) { return s.X; });
  // Ergebnis
  let summe = 0, anzahl = 0; const sicht = []; for (let i = 0; i < nB; i++) sicht.push([]);
  const P = new Float32Array(mit.length * 3), F = new Uint8Array(mit.length * 3), nBeob = new Uint8Array(mit.length);
  mit.forEach(function (s, k) {
    P[3 * k] = s.X[0]; P[3 * k + 1] = s.X[1]; P[3 * k + 2] = s.X[2];
    let r = 0, g = 0, b = 0, c = 0;
    s.beob.forEach(function (o) { if (o.aus || !kam[o.b].reg) return; const e = fehlerPx(s, o); summe += e; anzahl++; const fa = bilder[o.b].farbe; r += fa[3 * o.m]; g += fa[3 * o.m + 1]; b += fa[3 * o.m + 2]; c++; sicht[o.b].push(k); });
    F[3 * k] = r / c; F[3 * k + 1] = g / c; F[3 * k + 2] = b / c; nBeob[k] = Math.min(255, c);
  });
  return {
    kameras: kam.map(function (k) { return { reg: k.reg, R: k.R, t: k.t }; }), gruppen: gr, punkte: P, farben: F, nBeob: nBeob,
    sicht: sicht.map(function (l) { return Int32Array.from(l); }), fehler: anzahl ? summe / anzahl : 0
  };
}
// Pose aus 2D-3D-Paaren: DLT mit 6 Punkten in RANSAC, danach Gauß-Newton
function pnp(X, x, f, schwellePx) {
  const n = X.length; if (n < 6) return null;
  const zf = zufallMit(n * 31 + 7), thr = schwellePx / f;
  const pruefe = function (R, t) { let c = 0; const inl = []; for (let k = 0; k < n; k++) { const Xc = v3add(m3v(R, X[k]), t); if (Xc[2] <= 0) continue; const ex = Xc[0] / Xc[2] - x[k][0], ey = Xc[1] / Xc[2] - x[k][1]; if (ex * ex + ey * ey < thr * thr) { c++; inl.push(k); } } return inl; };
  const dlt = function (idx) {
    const A = new Float64Array(idx.length * 2 * 12);
    idx.forEach(function (k, r) {
      const P = X[k], u = x[k][0], v = x[k][1];
      A.set([P[0], P[1], P[2], 1, 0, 0, 0, 0, -u * P[0], -u * P[1], -u * P[2], -u], 2 * r * 12);
      A.set([0, 0, 0, 0, P[0], P[1], P[2], 1, -v * P[0], -v * P[1], -v * P[2], -v], (2 * r + 1) * 12);
    });
    const p = nullvektor(A, idx.length * 2, 12);
    let M = [p[0], p[1], p[2], p[4], p[5], p[6], p[8], p[9], p[10]], t = [p[3], p[7], p[11]];
    if (m3det(M) < 0) { M = M.map(function (v) { return -v; }); t = t.map(function (v) { return -v; }); }
    const s = svd3(M), sk = (s.S[0] + s.S[1] + s.S[2]) / 3; if (sk < 1e-12) return null;
    return { R: drehungNahe(M), t: v3mal(t, 1 / sk) };
  };
  let best = null, iter = 500;
  for (let it = 0; it < iter; it++) {
    const p = dlt(stichprobe(n, 6, zf)); if (!p) continue;
    const inl = pruefe(p.R, p.t);
    if (!best || inl.length > best.inl.length) { best = { R: p.R, t: p.t, inl: inl }; const w = inl.length / n; iter = Math.min(500, Math.max(30, Math.ceil(Math.log(0.001) / Math.log(1 - Math.pow(w, 6) + 1e-12)))); }
  }
  if (!best || best.inl.length < 6) return null;
  return pnpVerfeinern(best.R, best.t, X, x, thr);
}
function pnpVerfeinern(R, t, X, x, thr) {
  const n = X.length;
  const pruefe = function (R, t) { const inl = []; for (let k = 0; k < n; k++) { const Xc = v3add(m3v(R, X[k]), t); if (Xc[2] <= 0) continue; const ex = Xc[0] / Xc[2] - x[k][0], ey = Xc[1] / Xc[2] - x[k][1]; if (ex * ex + ey * ey < thr * thr) inl.push(k); } return inl; };
  // Verfeinern mit Gauß-Newton auf allen Treffern (zuerst mit doppelter Schwelle)
  for (let r = 0; r < 3; r++) {
    const inl = r === 0 ? (function () { const t2 = thr; thr *= 3; const l = pruefe(R, t); thr = t2; return l; })() : pruefe(R, t); if (inl.length < 6) break;
    for (let it = 0; it < 10; it++) {
      const H = new Float64Array(36), g = new Float64Array(6);
      inl.forEach(function (k) {
        const RX = m3v(R, X[k]), Xc = v3add(RX, t), c = Xc[2]; if (c <= 0) return;
        const ex = Xc[0] / c - x[k][0], ey = Xc[1] / c - x[k][1], S = schief(RX);
        const P = [1 / c, 0, -Xc[0] / (c * c), 0, 1 / c, -Xc[1] / (c * c)], J = [[], []];
        for (let q = 0; q < 3; q++) { J[0].push(-(P[0] * S[q] + P[1] * S[3 + q] + P[2] * S[6 + q])); J[1].push(-(P[3] * S[q] + P[4] * S[3 + q] + P[5] * S[6 + q])); }
        for (let q = 0; q < 3; q++) { J[0].push(P[q]); J[1].push(P[3 + q]); }
        for (let a = 0; a < 6; a++) { g[a] += J[0][a] * ex + J[1][a] * ey; for (let b = 0; b < 6; b++) H[a * 6 + b] += J[0][a] * J[0][b] + J[1][a] * J[1][b]; }
      });
      for (let a = 0; a < 6; a++) H[a * 7] *= 1.0001;
      const d = cholLoesen(H, Array.prototype.map.call(g, function (v) { return -v; }), 6);
      R = m3(rodrigues([d[0], d[1], d[2]]), R); t = [t[0] + d[3], t[1] + d[4], t[2] + d[5]];
      if (Math.abs(d[3]) + Math.abs(d[4]) + Math.abs(d[5]) + Math.abs(d[0]) + Math.abs(d[1]) + Math.abs(d[2]) < 1e-9) break;
    }
  }
  return { R: R, t: t, n: pruefe(R, t).length };
}
// ---------- Dichte Rekonstruktion: Tiefenkarten durch Ebenen-Durchlauf (Plane Sweep) mit NCC ----------
function integral(src, w, h) { // Summenbild (w+1)×(h+1)
  const I = new Float64Array((w + 1) * (h + 1));
  for (let y = 0; y < h; y++) { let s = 0; const r = y * w, o = (y + 1) * (w + 1), oa = y * (w + 1); for (let x = 0; x < w; x++) { s += src[r + x]; I[o + x + 1] = I[oa + x + 1] + s; } }
  return I;
}
function kasten(I, w, h, r, ziel) { // Fenstersumme mit Radius r (am Rand abgeschnitten)
  const W1 = w + 1;
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - r), y1 = Math.min(h, y + r + 1);
    for (let x = 0; x < w; x++) { const x0 = Math.max(0, x - r), x1 = Math.min(w, x + r + 1); ziel[y * w + x] = I[y1 * W1 + x1] - I[y0 * W1 + x1] - I[y1 * W1 + x0] + I[y0 * W1 + x0]; }
  }
  return ziel;
}
function strahlen(k) { // normierte Blickrichtungen je Pixel
  const n = k.w * k.h, rx = new Float32Array(n), ry = new Float32Array(n);
  for (let y = 0; y < k.h; y++) for (let x = 0; x < k.w; x++) { rx[y * k.w + x] = (x - k.cx) / k.f; ry[y * k.w + x] = (y - k.cy) / k.f; }
  return { rx: rx, ry: ry };
}
function relativ(a, b) { const R = m3(b.R, m3t(a.R)); return { R: R, t: v3sub(b.t, m3v(R, a.t)) }; }
function tiefenkarte(ref, quellen, opt, melden) {
  const w = ref.w, h = ref.h, n = w * h, r = opt.radius || 3, D = opt.ebenen, nq = quellen.length, K = Math.min(nq, opt.beste || 2);
  const st = strahlen(ref), Nfen = function (x, y) { return (Math.min(w, x + r + 1) - Math.max(0, x - r)) * (Math.min(h, y + r + 1) - Math.max(0, y - r)); };
  const nf = new Float32Array(n); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) nf[y * w + x] = Nfen(x, y);
  const G = ref.grau, Sr = kasten(integral(G, w, h), w, h, r, new Float32Array(n)), G2 = new Float32Array(n);
  for (let i = 0; i < n; i++) G2[i] = G[i] * G[i];
  const Srr = kasten(integral(G2, w, h), w, h, r, new Float32Array(n)), varR = new Float32Array(n);
  for (let i = 0; i < n; i++) varR[i] = Math.max(0, Srr[i] - Sr[i] * Sr[i] / nf[i]);
  const vorber = quellen.map(function (q) {
    const rel = relativ(ref, q), A = new Float32Array(3 * n);
    for (let i = 0; i < n; i++) { const x = st.rx[i], y = st.ry[i]; A[3 * i] = rel.R[0] * x + rel.R[1] * y + rel.R[2]; A[3 * i + 1] = rel.R[3] * x + rel.R[4] * y + rel.R[5]; A[3 * i + 2] = rel.R[6] * x + rel.R[7] * y + rel.R[8]; }
    return { q: q, A: A, t: rel.t };
  });
  const best = new Float32Array(n).fill(9), bestIdx = new Int16Array(n).fill(-1), vor = new Float32Array(n).fill(9), nach = new Float32Array(n).fill(9), letzte = new Float32Array(n).fill(9);
  const Wb = new Float32Array(n), ok = new Uint8Array(n), WW = new Float32Array(n), RW = new Float32Array(n), Sw = new Float32Array(n), Sww = new Float32Array(n), Srw = new Float32Array(n), okS = new Float32Array(n);
  const kosten = []; for (let s = 0; s < nq; s++) kosten.push(new Float32Array(n));
  const aktuell = new Float32Array(n), inv0 = 1 / opt.dmax, inv1 = 1 / opt.dmin;
  for (let d = 0; d < D; d++) {
    const tiefe = 1 / (inv0 + (inv1 - inv0) * d / (D - 1));
    vorber.forEach(function (v, s) {
      const q = v.q, qw = q.w, qh = q.h, B = q.grau, A = v.A, t = v.t;
      for (let i = 0; i < n; i++) {
        const X = tiefe * A[3 * i] + t[0], Y = tiefe * A[3 * i + 1] + t[1], Z = tiefe * A[3 * i + 2] + t[2];
        if (Z <= 1e-6) { ok[i] = 0; Wb[i] = 0; continue; }
        const u = q.f * X / Z + q.cx, vv = q.f * Y / Z + q.cy;
        if (u < 0 || vv < 0 || u > qw - 1.001 || vv > qh - 1.001) { ok[i] = 0; Wb[i] = 0; continue; }
        const x0 = u | 0, y0 = vv | 0, fx = u - x0, fy = vv - y0, j = y0 * qw + x0;
        Wb[i] = (B[j] * (1 - fx) + B[j + 1] * fx) * (1 - fy) + (B[j + qw] * (1 - fx) + B[j + qw + 1] * fx) * fy; ok[i] = 1;
      }
      for (let i = 0; i < n; i++) { WW[i] = Wb[i] * Wb[i]; RW[i] = G[i] * Wb[i]; okS[i] = ok[i]; }
      kasten(integral(Wb, w, h), w, h, r, Sw); kasten(integral(WW, w, h), w, h, r, Sww); kasten(integral(RW, w, h), w, h, r, Srw); const Ok = kasten(integral(okS, w, h), w, h, r, new Float32Array(n));
      const ks = kosten[s];
      for (let i = 0; i < n; i++) {
        if (!ok[i] || Ok[i] < nf[i] * 0.9) { ks[i] = 2; continue; }
        const N = nf[i], vw = Sww[i] - Sw[i] * Sw[i] / N, kov = Srw[i] - Sr[i] * Sw[i] / N, nen = varR[i] * vw;
        ks[i] = nen > 1e-6 ? 1 - kov / Math.sqrt(nen) : 2;
      }
    });
    // beste K Quellen mitteln (robust gegen Verdeckung)
    for (let i = 0; i < n; i++) {
      let c;
      if (nq === 1) c = kosten[0][i];
      else { let a = 9, b = 9, e = 9; for (let s = 0; s < nq; s++) { const v = kosten[s][i]; if (v < a) { e = b; b = a; a = v; } else if (v < b) { e = b; b = v; } else if (v < e) e = v; } c = K === 1 ? a : K === 2 ? (a + b) / 2 : (a + b + e) / 3; }
      aktuell[i] = c;
      if (c < best[i]) { best[i] = c; bestIdx[i] = d; vor[i] = letzte[i]; nach[i] = 9; }
      else if (bestIdx[i] === d - 1) nach[i] = c;
      letzte[i] = c;
    }
    if (melden && d % 8 === 7) melden((d + 1) / D);
  }
  const tiefe = new Float32Array(n), guete = new Float32Array(n);
  const minVar = (opt.textur || 4) * (opt.textur || 4);
  for (let i = 0; i < n; i++) {
    const k = bestIdx[i]; if (k < 0 || best[i] > (opt.maxKosten || 0.45) || varR[i] / nf[i] < minVar) continue;
    let off = 0; const a = vor[i], c = nach[i], b = best[i];
    if (k > 0 && k < D - 1 && a < 9 && c < 9) { const den = a - 2 * b + c; if (den > 1e-9) off = Math.max(-0.5, Math.min(0.5, 0.5 * (a - c) / den)); }
    else if (k === 0 || k === D - 1) continue; // am Rand des Suchbereichs: unsicher
    tiefe[i] = 1 / (inv0 + (inv1 - inv0) * (k + off) / (D - 1)); guete[i] = 1 - b;
  }
  // 3x3-Median gegen Ausreißer
  const gef = new Float32Array(n), puf = [];
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x; if (!tiefe[i]) continue; puf.length = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const v = tiefe[i + dy * w + dx]; if (v) puf.push(v); }
    if (puf.length < 5) continue; puf.sort(function (a, b) { return a - b; }); const m = puf[puf.length >> 1];
    if (Math.abs(tiefe[i] - m) / m < 0.02) gef[i] = tiefe[i];
  }
  return { tiefe: gef, guete: guete };
}
// Prüfung gegen die Tiefenkarten der Nachbarn: nur Pixel behalten, die mindestens minK Nachbarn bestätigen
function tiefePruefen(ref, nachbarn, minK, tol) {
  const w = ref.w, h = ref.h, n = w * h, st = strahlen(ref), aus = new Float32Array(n), zaehl = new Uint8Array(n);
  const rels = nachbarn.map(function (q) { return { q: q, rel: relativ(ref, q) }; });
  for (let i = 0; i < n; i++) {
    const d = ref.tiefe[i]; if (!d) continue;
    const x = st.rx[i] * d, y = st.ry[i] * d; let c = 0, summe = d, anz = 1;
    for (let k = 0; k < rels.length; k++) {
      const R = rels[k].rel.R, t = rels[k].rel.t, q = rels[k].q;
      const X = R[0] * x + R[1] * y + R[2] * d + t[0], Y = R[3] * x + R[4] * y + R[5] * d + t[1], Z = R[6] * x + R[7] * y + R[8] * d + t[2];
      if (Z <= 0) continue;
      const u = Math.round(q.f * X / Z + q.cx), v = Math.round(q.f * Y / Z + q.cy);
      if (u < 0 || v < 0 || u >= q.w || v >= q.h) continue;
      const dq = q.tiefe[v * q.w + u]; if (!dq) continue;
      if (Math.abs(dq - Z) / Z < tol) { c++; summe += d * dq / Z; anz++; }
    }
    if (c >= minK) { aus[i] = summe / anz; zaehl[i] = c; }
  }
  return { tiefe: aus, zaehl: zaehl };
}
// ---------- Oberfläche: Tiefenkarten in ein Volumen verrechnen (TSDF) und Dreiecksnetz erzeugen ----------
// g: { o:[x,y,z], v: Voxelgröße, nx, ny, nz } im Anzeige-System; ansichten: Tiefenkarten mit R, t (Anzeige → Kamera, Kameraeinheiten), skala s
function tsdfScheibe(g, zA, zB, ansichten, trunkAnz, skala) {
  const nx = g.nx, ny = g.ny, nzS = zB - zA, N = nx * ny * nzS, T = new Float32Array(N), W = new Float32Array(N), Fr = new Float32Array(N), Fg = new Float32Array(N), Fb = new Float32Array(N), Cn = new Float32Array(N);
  const trunk = trunkAnz / skala;
  ansichten.forEach(function (a) {
    const R = a.R, t = a.t, tf = a.tiefe, fa = a.farbe, w = a.w, h = a.h, f = a.f, cx = a.cx, cy = a.cy;
    const dx0 = R[0] * g.v, dx1 = R[3] * g.v, dx2 = R[6] * g.v;
    for (let z = zA; z < zB; z++) {
      const Z = g.o[2] + (z + 0.5) * g.v;
      for (let y = 0; y < ny; y++) {
        const Y = g.o[1] + (y + 0.5) * g.v, X0 = g.o[0] + 0.5 * g.v;
        let a0 = R[0] * X0 + R[1] * Y + R[2] * Z + t[0], a1 = R[3] * X0 + R[4] * Y + R[5] * Z + t[1], a2 = R[6] * X0 + R[7] * Y + R[8] * Z + t[2];
        const basis = ((z - zA) * ny + y) * nx;
        for (let x = 0; x < nx; x++, a0 += dx0, a1 += dx1, a2 += dx2) {
          if (a2 <= 1e-6) continue;
          const u = Math.round(f * a0 / a2 + cx), v = Math.round(f * a1 / a2 + cy);
          if (u < 0 || v < 0 || u >= w || v >= h) continue;
          const p = v * w + u, d = tf[p]; if (!d) continue;
          const sdf = d - a2; if (sdf < -trunk) continue;
          const wert = Math.min(1, sdf / trunk), i = basis + x, ww = sdf > trunk ? 0.3 : 1;
          T[i] += wert * ww; W[i] += ww;
          if (sdf < trunk) { Fr[i] += fa[3 * p]; Fg[i] += fa[3 * p + 1]; Fb[i] += fa[3 * p + 2]; Cn[i]++; }
        }
      }
    }
  });
  const F = new Uint8Array(N * 3);
  for (let i = 0; i < N; i++) {
    if (W[i] > 0) T[i] /= W[i]; else T[i] = 1;
    if (Cn[i] > 0) { F[3 * i] = Fr[i] / Cn[i]; F[3 * i + 1] = Fg[i] / Cn[i]; F[3 * i + 2] = Fb[i] / Cn[i]; } else { F[3 * i] = F[3 * i + 1] = F[3 * i + 2] = 160; }
  }
  return { T: T, W: W, F: F, zA: zA, zB: zB };
}
// Marching Tetrahedra: je Würfel 6 Tetraeder entlang der Raumdiagonale, keine Mehrdeutigkeiten
const TET = [[0, 5, 1, 6], [0, 1, 2, 6], [0, 2, 3, 6], [0, 3, 7, 6], [0, 7, 4, 6], [0, 4, 5, 6]];
const ECKE = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]];
// kleine Löcher schließen: unbeobachtete Voxel nahe der Fläche aus den Nachbarn ergänzen
function lueckenFuellen(g, T, W, F, minW, runden) {
  const nx = g.nx, ny = g.ny, nz = g.nz, sxy = nx * ny, nb = [1, -1, nx, -nx, sxy, -sxy];
  for (let r = 0; r < runden; r++) {
    const neu = [];
    for (let z = 1; z < nz - 1; z++) for (let y = 1; y < ny - 1; y++) for (let x = 1; x < nx - 1; x++) {
      const i = (z * ny + y) * nx + x; if (W[i] >= minW) continue;
      let n = 0, t = 0, fr = 0, fg = 0, fb = 0, nah = false;
      for (let k = 0; k < 6; k++) { const j = i + nb[k]; if (W[j] < minW) continue; n++; t += T[j]; fr += F[3 * j]; fg += F[3 * j + 1]; fb += F[3 * j + 2]; if (Math.abs(T[j]) < 0.99) nah = true; }
      if (n >= 2 && nah) neu.push(i, t / n, fr / n, fg / n, fb / n);
    }
    if (!neu.length) break;
    for (let k = 0; k < neu.length; k += 5) { const i = neu[k]; T[i] = neu[k + 1]; W[i] = minW; F[3 * i] = neu[k + 2]; F[3 * i + 1] = neu[k + 3]; F[3 * i + 2] = neu[k + 4]; }
  }
}
function netzAusVolumen(g, T, W, F, minW) {
  lueckenFuellen(g, T, W, F, minW, 4);
  const nx = g.nx, ny = g.ny, nz = g.nz, idx = function (x, y, z) { return (z * ny + y) * nx + x; };
  const kanten = new Map(), pos = [], farbe = [], dreiecke = [];
  const ecke = new Int32Array(8), wert = new Float32Array(8);
  const punkt = function (a, b) {
    const key = a < b ? a * 16777216 + b : b * 16777216 + a; let k = kanten.get(key); if (k !== undefined) return k;
    const va = T[a], vb = T[b], t = va / (va - vb);
    const ax = a % nx, ay = ((a - ax) / nx) % ny, az = Math.floor(a / (nx * ny)), bx = b % nx, by = ((b - bx) / nx) % ny, bz = Math.floor(b / (nx * ny));
    k = pos.length / 3;
    pos.push(g.o[0] + (ax + 0.5 + t * (bx - ax)) * g.v, g.o[1] + (ay + 0.5 + t * (by - ay)) * g.v, g.o[2] + (az + 0.5 + t * (bz - az)) * g.v);
    for (let c = 0; c < 3; c++) farbe.push(F[3 * a + c] * (1 - t) + F[3 * b + c] * t);
    kanten.set(key, k); return k;
  };
  const dreieck = function (p, q, r, innen, aussen) {
    // Ausrichtung: Normale zeigt von innen (T<0) nach außen
    const A = [pos[3 * p], pos[3 * p + 1], pos[3 * p + 2]], B = [pos[3 * q], pos[3 * q + 1], pos[3 * q + 2]], Cc = [pos[3 * r], pos[3 * r + 1], pos[3 * r + 2]];
    const nrm = v3kreuz(v3sub(B, A), v3sub(Cc, A)), dir = v3sub(aussen, innen);
    if (v3dot(nrm, dir) < 0) dreiecke.push(p, r, q); else dreiecke.push(p, q, r);
  };
  const koord = function (i) { const x = i % nx, y = ((i - x) / nx) % ny, z = Math.floor(i / (nx * ny)); return [x, y, z]; };
  for (let z = 0; z < nz - 1; z++) for (let y = 0; y < ny - 1; y++) for (let x = 0; x < nx - 1; x++) {
    let alleGut = true, neg = 0, pos0 = 0;
    for (let c = 0; c < 8; c++) { const i = idx(x + ECKE[c][0], y + ECKE[c][1], z + ECKE[c][2]); ecke[c] = i; wert[c] = T[i]; if (W[i] < minW) { alleGut = false; break; } if (T[i] < 0) neg++; else pos0++; }
    if (!alleGut || neg === 0 || pos0 === 0) continue;
    for (let k = 0; k < 6; k++) {
      const t4 = TET[k], ein = [], aus = [];
      for (let j = 0; j < 4; j++) (wert[t4[j]] < 0 ? ein : aus).push(ecke[t4[j]]);
      if (!ein.length || !aus.length) continue;
      const mi = function (l) { let s = [0, 0, 0]; l.forEach(function (i) { s = v3add(s, koord(i)); }); return v3mal(s, 1 / l.length); };
      const ci = mi(ein), co = mi(aus);
      if (ein.length === 1) dreieck(punkt(ein[0], aus[0]), punkt(ein[0], aus[1]), punkt(ein[0], aus[2]), ci, co);
      else if (ein.length === 3) dreieck(punkt(aus[0], ein[0]), punkt(aus[0], ein[1]), punkt(aus[0], ein[2]), ci, co);
      else {
        const a = punkt(ein[0], aus[0]), b = punkt(ein[0], aus[1]), c = punkt(ein[1], aus[1]), d = punkt(ein[1], aus[0]);
        dreieck(a, b, c, ci, co); dreieck(a, c, d, ci, co);
      }
    }
  }
  return { pos: Float32Array.from(pos), farbe: Uint8Array.from(farbe), dreiecke: Uint32Array.from(dreiecke) };
}
// kleine Inseln entfernen, Taubin-Glättung, Normalen
function netzAufraeumen(m, anteil, glatt) {
  const nV = m.pos.length / 3, nT = m.dreiecke.length / 3, el = new Int32Array(nV);
  for (let i = 0; i < nV; i++) el[i] = i;
  const wz = function (a) { while (el[a] !== a) { el[a] = el[el[a]]; a = el[a]; } return a; };
  for (let t = 0; t < nT; t++) { const a = wz(m.dreiecke[3 * t]), b = wz(m.dreiecke[3 * t + 1]), c = wz(m.dreiecke[3 * t + 2]); el[b] = a; el[wz(c)] = a; }
  const groesse = new Map(); for (let t = 0; t < nT; t++) { const r = wz(m.dreiecke[3 * t]); groesse.set(r, (groesse.get(r) || 0) + 1); }
  let max = 0; groesse.forEach(function (v) { if (v > max) max = v; });
  const grenze = Math.max(50, max * anteil), neuIdx = new Int32Array(nV).fill(-1), pos = [], farbe = [], dr = [];
  for (let t = 0; t < nT; t++) {
    if (groesse.get(wz(m.dreiecke[3 * t])) < grenze) continue;
    for (let k = 0; k < 3; k++) { const v = m.dreiecke[3 * t + k]; if (neuIdx[v] < 0) { neuIdx[v] = pos.length / 3; pos.push(m.pos[3 * v], m.pos[3 * v + 1], m.pos[3 * v + 2]); farbe.push(m.farbe[3 * v], m.farbe[3 * v + 1], m.farbe[3 * v + 2]); } dr.push(neuIdx[v]); }
  }
  const P = Float32Array.from(pos), D = Uint32Array.from(dr), n = P.length / 3;
  if (glatt) {
    const nachb = []; for (let i = 0; i < n; i++) nachb.push([]);
    for (let t = 0; t < D.length; t += 3) for (let k = 0; k < 3; k++) { const a = D[t + k], b = D[t + (k + 1) % 3]; if (nachb[a].indexOf(b) < 0) { nachb[a].push(b); nachb[b].push(a); } }
    const schritt = function (lam) {
      const Q = P.slice();
      for (let i = 0; i < n; i++) { const l = nachb[i]; if (!l.length) continue; let sx = 0, sy = 0, sz = 0; l.forEach(function (j) { sx += Q[3 * j]; sy += Q[3 * j + 1]; sz += Q[3 * j + 2]; }); const k = l.length; P[3 * i] += lam * (sx / k - Q[3 * i]); P[3 * i + 1] += lam * (sy / k - Q[3 * i + 1]); P[3 * i + 2] += lam * (sz / k - Q[3 * i + 2]); }
    };
    for (let it = 0; it < glatt; it++) { schritt(0.5); schritt(-0.53); }
  }
  const N = new Float32Array(n * 3);
  for (let t = 0; t < D.length; t += 3) {
    const a = D[t], b = D[t + 1], c = D[t + 2];
    const e1 = [P[3 * b] - P[3 * a], P[3 * b + 1] - P[3 * a + 1], P[3 * b + 2] - P[3 * a + 2]], e2 = [P[3 * c] - P[3 * a], P[3 * c + 1] - P[3 * a + 1], P[3 * c + 2] - P[3 * a + 2]], q = v3kreuz(e1, e2);
    [a, b, c].forEach(function (v) { N[3 * v] += q[0]; N[3 * v + 1] += q[1]; N[3 * v + 2] += q[2]; });
  }
  for (let i = 0; i < n; i++) { const l = Math.hypot(N[3 * i], N[3 * i + 1], N[3 * i + 2]) || 1; N[3 * i] /= l; N[3 * i + 1] /= l; N[3 * i + 2] /= l; }
  return { pos: P, farbe: Uint8Array.from(farbe), dreiecke: D, normalen: N };
}
// ---------- Arbeitsfaden: Aufträge entgegennehmen ----------
const ablage = { merkmale: {}, K: {} };
self.onmessage = function (ev) {
  const a = ev.data, id = a.id;
  const melden = function (x) { self.postMessage({ id: id, fortschritt: x }); };
  try {
    let erg = null, transfer = [];
    if (a.art === 'merkmale') {
      erg = merkmale(a.rgba, a.w, a.h, a.nMax, a.schwelle);
      transfer = [erg.x.buffer, erg.y.buffer, erg.ebene.buffer, erg.winkel.buffer, erg.antwort.buffer, erg.d.buffer, erg.farbe.buffer];
    } else if (a.art === 'ablegen') {
      ablage.merkmale = a.merkmale; ablage.K = a.K; erg = true;
    } else if (a.art === 'paare') {
      erg = a.liste.map(function (p) {
        const A = ablage.merkmale[p.i], B = ablage.merkmale[p.j];
        let m;
        if (p.grob) {
          const beste = function (M, k) { const idx = []; for (let i = 0; i < M.n; i++) idx.push(i); idx.sort(function (x, y) { return M.antwort[y] - M.antwort[x]; }); return idx.slice(0, k); };
          m = zuordnen(A, B, beste(A, p.grob), beste(B, p.grob), 0.85, 72);
          return { i: p.i, j: p.j, n: m.length };
        }
        m = zuordnen(A, B, null, null, a.verh || 0.8, a.maxD || 72);
        const r = zweiBild(A, B, ablage.K[p.i], ablage.K[p.j], m, a.schwelle || 3);
        if (!r) return { i: p.i, j: p.j, n: 0, roh: m.length };
        r.i = p.i; r.j = p.j; r.roh = m.length; return r;
      });
    } else if (a.art === 'sfm') {
      erg = sfm(a.bilder, a.gruppen, a.paare, melden);
    } else if (a.art === 'tiefe') {
      erg = tiefenkarte(a.ref, a.quellen, a.opt, melden); transfer = [erg.tiefe.buffer, erg.guete.buffer];
    } else if (a.art === 'pruefen') {
      erg = tiefePruefen(a.ref, a.nachbarn, a.minK, a.tol); transfer = [erg.tiefe.buffer, erg.zaehl.buffer];
    } else if (a.art === 'tsdf') {
      erg = tsdfScheibe(a.g, a.zA, a.zB, a.ansichten, a.trunk, a.skala); transfer = [erg.T.buffer, erg.W.buffer, erg.F.buffer];
    } else if (a.art === 'netz') {
      const roh = netzAusVolumen(a.g, a.T, a.W, a.F, a.minW);
      melden({ text: (roh.dreiecke.length / 3) + ' Dreiecke, räume auf …' });
      erg = netzAufraeumen(roh, a.anteil, a.glatt); transfer = [erg.pos.buffer, erg.farbe.buffer, erg.dreiecke.buffer, erg.normalen.buffer];
    } else throw new Error('unbekannter Auftrag ' + a.art);
    self.postMessage({ id: id, ergebnis: erg }, transfer);
  } catch (e) { self.postMessage({ id: id, fehler: String(e && e.stack || e) }); }
};
