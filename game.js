/* ============================================================
   DALYARRAK GOBİT — retro piksel kelime yakalama oyunu
   Saf HTML5 Canvas, bağımlılık yok.
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- sabitler ---------------- */
  const W = 640, H = 360;
  const GROUND_Y = 318;
  const CHAR_SCALE = 2;
  const CHAR_H = 128;
  const CHAR_TOP = GROUND_Y - CHAR_H;
  const TOTAL_TIME = 60;

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  /* oyun sonu portresi */
  const portraitImg = new Image();
  portraitImg.src = 'portre.jpg';

  /* ---------------- palet ---------------- */
  const P = {
    skin: '#e9b183', skinSh: '#cf9765', skinHi: '#f7cda3', skinDeep: '#a86a44',
    hair: '#2f2320', hairHi: '#4a3831',
    glass: '#241f1c', lens: '#9dbfd0', lensSh: '#7fa2b4', lensHi: '#d8eef7',
    mustard: '#c9962a', mustardMid: '#b2842a', mustardSh: '#8a6214', mustardHi: '#e2b64c',
    white: '#f4efe2', whiteSh: '#d3cbb6',
    jeans: '#5f7288', jeansSh: '#45566a', jeansHi: '#73879e',
    shoe: '#2b2723', shoeHi: '#443d36',
    mouth: '#5e2b2b', tongue: '#b9544f', teeth: '#f4efe2',
    good: '#7fd18a', bad: '#ff5f5f',
    ink: '#0e0c14'
  };

  /* ---------------- 5x7 piksel font ---------------- */
  const FONT = {
    'A': ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
    'B': ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
    'C': ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
    'D': ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
    'E': ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
    'F': ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
    'G': ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.###.'],
    'H': ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
    'I': ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
    'İ': ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
    'J': ['..###', '...#.', '...#.', '...#.', '...#.', '#..#.', '.##..'],
    'K': ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
    'L': ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
    'M': ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
    'N': ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
    'O': ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
    'P': ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
    'Q': ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
    'R': ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
    'S': ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
    'T': ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
    'U': ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
    'V': ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
    'W': ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '##.##', '#...#'],
    'X': ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
    'Y': ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
    'Z': ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
    'Ü': ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
    'Ö': ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
    'Ş': ['.###.', '#...#', '#....', '.###.', '....#', '#...#', '.###.'],
    'Ğ': ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.###.'],
    'Ç': ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
    '=': ['.....', '.....', '#####', '.....', '#####', '.....', '.....'],
    '0': ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
    '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
    '2': ['.###.', '#...#', '....#', '..##.', '.#...', '#....', '#####'],
    '3': ['####.', '....#', '....#', '.###.', '....#', '....#', '####.'],
    '4': ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
    '5': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
    '6': ['.###.', '#....', '#....', '####.', '#...#', '#...#', '.###.'],
    '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
    '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
    '9': ['.###.', '#...#', '#...#', '.####', '....#', '....#', '.###.'],
    '+': ['.....', '..#..', '..#..', '#####', '..#..', '..#..', '.....'],
    '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
    '!': ['..#..', '..#..', '..#..', '..#..', '..#..', '.....', '..#..'],
    '.': ['.....', '.....', '.....', '.....', '.....', '.....', '..#..'],
    ':': ['.....', '..#..', '.....', '.....', '.....', '..#..', '.....'],
    '?': ['.###.', '#...#', '....#', '..##.', '..#..', '.....', '..#..'],
    ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....']
  };

  function textWidth(text, sc) {
    return (text.length * 6 - 1) * sc;
  }

  function drawText(g, text, x, y, sc, color, align, shadow) {
    let px = Math.round(x), py = Math.round(y);
    if (align === 'center') px -= Math.round(textWidth(text, sc) / 2);
    else if (align === 'right') px -= textWidth(text, sc);

    if (shadow) {
      g.fillStyle = shadow;
      paintGlyphs(g, text, px + sc, py + sc, sc);
    }
    g.fillStyle = color;
    paintGlyphs(g, text, px, py, sc);
  }

  /* Türkçe aksan işaretleri: u = harfin üstü, d = harfin altı */
  const MARKS = {
    'Ü': { u: ['.#.#.'] },
    'Ö': { u: ['.#.#.'] },
    'İ': { u: ['..#..'] },
    'Ğ': { u: ['#...#', '.###.'] },
    'Ş': { d: ['..#..', '.#...'] },
    'Ç': { d: ['..#..', '.#...'] }
  };

  function paintGlyphs(g, text, x, y, sc) {
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const gl = FONT[ch] || FONT['?'];
      const mk = MARKS[ch];
      for (let r = 0; r < 7; r++) {
        const row = gl[r];
        for (let c = 0; c < 5; c++) {
          if (row[c] === '#') g.fillRect(x + c * sc, y + r * sc, sc, sc);
        }
      }
      if (mk) {
        if (mk.u) {
          for (let k = 0; k < mk.u.length; k++) {
            const row = mk.u[k];
            const ry = y - (mk.u.length - k) * sc;
            for (let c = 0; c < 5; c++) {
              if (row[c] === '#') g.fillRect(x + c * sc, ry, sc, sc);
            }
          }
        }
        if (mk.d) {
          for (let k = 0; k < mk.d.length; k++) {
            const row = mk.d[k];
            const ry = y + (7 + k) * sc;
            for (let c = 0; c < 5; c++) {
              if (row[c] === '#') g.fillRect(x + c * sc, ry, sc, sc);
            }
          }
        }
      }
      x += 6 * sc;
    }
  }

  /* ---------------- piksel yardımcıları ---------------- */
  function pixelEllipse(g, cx, cy, rx, ry, color) {
    g.fillStyle = color;
    for (let dy = -ry; dy <= ry; dy++) {
      const t = 1 - (dy * dy) / (ry * ry);
      if (t <= 0) continue;
      const s = Math.floor(rx * Math.sqrt(t));
      g.fillRect(Math.round(cx - s), Math.round(cy + dy), s * 2 + 1, 1);
    }
  }

  /* ============================================================
     KARAKTER SPRITE'I  (48 x 64 piksel grid)
     ============================================================ */
  const CW = 48, CH = 64;
  const CX = 24;
  const charCache = new Map();
  const portraitCache = new Map();

  /* gövde satır profili: [y, yarım genişlik] */
  const BODY_PROFILE = [
    [35, 10], [36, 13], [37, 15], [38, 16], [39, 17], [40, 18],
    [41, 18], [42, 19], [43, 19], [44, 19], [45, 19], [46, 19],
    [47, 18], [48, 18], [49, 17], [50, 16], [51, 15], [52, 14],
    [53, 13]
  ];

  /* kafa satır profili */
  const HEAD_PROFILE = [
    [6, 5], [7, 8], [8, 9], [9, 10], [10, 11], [11, 11],
    [12, 12], [13, 12], [14, 12], [15, 12], [16, 12], [17, 12],
    [18, 12], [19, 12], [20, 12], [21, 12], [22, 12], [23, 12],
    [24, 12], [25, 12], [26, 12], [27, 12], [28, 11], [29, 11],
    [30, 11], [31, 10], [32, 10], [33, 9], [34, 9], [35, 8],
    [36, 7]
  ];

  function renderChar(mouthOpen, eye, walk) {
    const cv = document.createElement('canvas');
    cv.width = CW; cv.height = CH;
    const g = cv.getContext('2d');
    g.imageSmoothingEnabled = false;

    const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x | 0, y | 0, w | 0, h | 0); };
    const SPAN = (y, hw, c) => { g.fillStyle = c; g.fillRect(CX - hw, y, hw * 2 + 1, 1); };
    const ELL = (cx, cy, rx, ry, c) => {
      g.fillStyle = c;
      for (let dy = -ry; dy <= ry; dy++) {
        const t = 1 - (dy * dy) / (ry * ry);
        if (t <= 0) continue;
        const s = Math.floor(rx * Math.sqrt(t));
        g.fillRect(cx - s, cy + dy, s * 2 + 1, 1);
      }
    };
    const RING = (cx, cy, r, th, ringCol, innerCol) => {
      const n = Math.ceil(r);
      for (let dy = -n; dy <= n; dy++) {
        for (let dx = -n; dx <= n; dx++) {
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > r) continue;
          g.fillStyle = d > r - th ? ringCol : innerCol;
          g.fillRect(cx + dx, cy + dy, 1, 1);
        }
      }
    };
    /* ince çerçeveli yuvarlak cam */
    const GLASS = (cx, cy, r) => {
      const n = Math.ceil(r);
      for (let dy = -n; dy <= n; dy++) {
        for (let dx = -n; dx <= n; dx++) {
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > r) continue;
          if (d > r - 1) g.fillStyle = P.glass;
          else if (dy > 0 && dx > -1) g.fillStyle = P.lensSh;
          else g.fillStyle = P.lens;
          g.fillRect(cx + dx, cy + dy, 1, 1);
        }
      }
      g.fillStyle = P.lensHi;
      g.fillRect(cx - 2, cy - 2, 2, 1);
    };

    const bob = walk === 1 ? -1 : 0;
    const B = (y) => y + bob;

    /* ---------------- bacaklar ---------------- */
    let lx = 16, rx2 = 25;
    if (walk === 1) { lx = 15; rx2 = 26; }
    else if (walk === 2) { lx = 17; rx2 = 24; }

    R(lx, 51, 8, 11, P.jeans);
    R(rx2, 51, 8, 11, P.jeans);
    R(lx, 51, 2, 11, P.jeansHi);
    R(rx2 + 6, 51, 2, 11, P.jeansSh);

    R(lx - 2, 60, 10, 4, P.shoe);
    R(rx2 - 1, 60, 10, 4, P.shoe);
    R(lx - 2, 60, 10, 1, P.shoeHi);
    R(rx2 - 1, 60, 10, 1, P.shoeHi);
    R(rx2 - 1, 63, 10, 1, '#171412');

    /* ---------------- boyun ---------------- */
    R(19, B(31), 11, 9, P.skinSh);
    R(20, B(31), 9, 8, P.skin);

    /* ---------------- gövde / kazak ---------------- */
    for (let i = 0; i < BODY_PROFILE.length; i++) {
      const y0 = BODY_PROFILE[i][0];
      const yy = y0 + bob;
      const s = BODY_PROFILE[i][1];

      /* taban */
      SPAN(yy, s, P.mustard);

      /* sol ışık */
      g.fillStyle = P.mustardHi;
      g.fillRect(CX - s, yy, 2, 1);

      /* sağ gölge */
      g.fillStyle = P.mustardMid;
      g.fillRect(CX + s - 5, yy, 6, 1);

      /* kol ayrımı: sadece yumuşak ton farkı */
      if (y0 >= 39 && y0 <= 51) {
        g.fillStyle = P.mustardMid;
        g.fillRect(CX - s, yy, 6, 1);
        g.fillRect(CX + s - 5, yy, 6, 1);
      }

      /* gömlek ucu */
      if (y0 >= 55) {
        const hw = Math.max(2, Math.floor(s * 0.45));
        g.fillStyle = P.whiteSh;
        g.fillRect(CX - hw, yy, hw * 2 + 1, 1);
      }
    }

    /* göbek alt gölgesi */
    R(11, B(54), 27, 1, P.mustardSh);

    /* ---------------- eller ---------------- */
    R(5, B(47), 8, 4, P.skinSh);
    R(6, B(47), 6, 4, P.skin);
    R(36, B(47), 8, 4, P.skinSh);
    R(37, B(47), 6, 4, P.skin);
    R(6, B(50), 6, 1, P.skinSh);
    R(37, B(50), 6, 1, P.skinSh);

    /* ---------------- yaka ---------------- */
    R(16, B(37), 17, 3, P.white);
    R(17, B(40), 15, 1, P.whiteSh);
    R(22, B(37), 5, 2, P.skinSh);

    /* ---------------- kafa ---------------- */
    for (let i = 0; i < HEAD_PROFILE.length; i++) {
      const y0 = HEAD_PROFILE[i][0];
      const yy = y0 + bob;
      const s = HEAD_PROFILE[i][1];

      SPAN(yy, s, P.skin);
      g.fillStyle = P.skinSh;
      g.fillRect(CX + s - 2, yy, 3, 1);
      if (y0 <= 25) {
        g.fillStyle = P.skinHi;
        g.fillRect(CX - s, yy, 1, 1);
      }
    }

    /* kel kafa parlaması (alında, yumuşak) */
    R(20, B(8), 7, 1, P.skinHi);
    R(17, B(10), 4, 1, P.skinHi);

    /* kaşlar */
    R(13, B(13), 9, 2, P.hair);
    R(26, B(13), 9, 2, P.hair);

    /* ---------------- yuvarlak gözlük ---------------- */
    GLASS(18, B(21), 4.2);
    GLASS(30, B(21), 4.2);
    R(22, B(21), 5, 1, P.glass);
    /* camın yüze oturduğu gölge */
    R(15, B(25), 6, 1, P.skinSh);
    R(28, B(25), 6, 1, P.skinSh);

    /* gözler */
    if (eye === 0) {
      R(17, B(20), 2, 2, P.glass);
      R(29, B(20), 2, 2, P.glass);
    } else if (eye === 1) {
      R(16, B(21), 4, 1, P.glass);
      R(28, B(21), 4, 1, P.glass);
    } else {
      R(16, B(19), 1, 1, P.glass); R(18, B(21), 1, 1, P.glass);
      R(18, B(19), 1, 1, P.glass); R(16, B(21), 1, 1, P.glass);
      R(28, B(19), 1, 1, P.glass); R(30, B(21), 1, 1, P.glass);
      R(30, B(19), 1, 1, P.glass); R(28, B(21), 1, 1, P.glass);
    }

    /* ---------------- burun ---------------- */
    R(21, B(22), 6, 6, P.skin);
    R(21, B(22), 2, 6, P.skinHi);
    R(26, B(23), 1, 5, P.skinSh);
    R(20, B(23), 1, 4, P.skinSh);
    R(19, B(27), 11, 1, P.skinSh);
    R(21, B(27), 2, 1, P.skinDeep);
    R(25, B(27), 2, 1, P.skinDeep);
    R(20, B(28), 9, 1, P.skinSh);

    /* ---------------- ağız ---------------- */
    if (!mouthOpen) {
      R(19, B(29), 1, 1, P.mouth);
      R(28, B(29), 1, 1, P.mouth);
      R(20, B(30), 9, 1, P.mouth);
      R(21, B(31), 7, 1, P.skinSh);
    } else {
      ELL(24, B(30), 5, 3, P.mouth);
      R(19, B(28), 11, 1, P.teeth);
      R(21, B(32), 6, 1, P.tongue);
      R(20, B(31), 8, 1, P.mouth);
    }

    /* ---------------- gıdık ---------------- */
    R(16, B(33), 17, 1, P.skinSh);
    R(18, B(34), 13, 1, P.skinSh);
    R(19, B(35), 11, 1, P.skin);

    return cv;
  }

  function getCharSprite(mouthOpen, eye, walk) {
    const key = (mouthOpen ? 1 : 0) + '' + eye + '' + walk;
    let s = charCache.get(key);
    if (!s) { s = renderChar(mouthOpen, eye, walk); charCache.set(key, s); }
    return s;
  }

  /* ============================================================
     YAKIN PLAN PORTRE (oyun sonu)  — 48 x 48 grid
     ============================================================ */
  const PW = 48, PH = 48;

  const PHEAD = [
    [0, 7], [1, 11], [2, 14], [3, 15], [4, 16], [5, 17],
    [6, 18], [7, 18], [8, 19], [9, 19], [10, 19], [11, 20],
    [12, 20], [13, 20], [14, 20], [15, 20], [16, 20], [17, 20],
    [18, 20], [19, 20], [20, 20], [21, 20], [22, 20], [23, 20],
    [24, 20], [25, 20], [26, 20], [27, 19], [28, 19], [29, 19],
    [30, 18], [31, 18], [32, 17], [33, 16], [34, 15], [35, 14],
    [36, 13], [37, 12], [38, 11]
  ];

  function renderPortrait(eye, mouthOpen) {
    const cv = document.createElement('canvas');
    cv.width = PW; cv.height = PH;
    const g = cv.getContext('2d');
    g.imageSmoothingEnabled = false;

    const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x | 0, y | 0, w | 0, h | 0); };
    const SPAN = (y, hw, c) => { g.fillStyle = c; g.fillRect(24 - hw, y, hw * 2 + 1, 1); };
    const RING = (cx, cy, r, th, ringCol, innerCol) => {
      const n = Math.ceil(r);
      for (let dy = -n; dy <= n; dy++) {
        for (let dx = -n; dx <= n; dx++) {
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > r) continue;
          g.fillStyle = d > r - th ? ringCol : innerCol;
          g.fillRect(cx + dx, cy + dy, 1, 1);
        }
      }
    };

    /* boyun */
    R(13, 34, 22, 14, P.skinSh);
    R(15, 33, 18, 13, P.skin);

    /* kazak omuzları */
    R(0, 44, 48, 4, P.mustard);
    R(0, 46, 48, 2, P.mustardSh);
    R(2, 43, 44, 1, P.mustardHi);

    /* yaka (V yakalı gömlek) */
    R(10, 41, 28, 5, P.white);
    R(11, 45, 26, 1, P.whiteSh);
    /* boyun V'si */
    R(19, 40, 10, 1, P.skin);
    R(20, 41, 8, 1, P.skin);
    R(21, 42, 6, 1, P.skin);
    R(22, 43, 4, 1, P.skinSh);
    /* yaka uçları */
    R(17, 41, 2, 2, P.white);
    R(29, 41, 2, 2, P.white);

    /* kafa */
    for (let i = 0; i < PHEAD.length; i++) {
      const y = PHEAD[i][0];
      const s = PHEAD[i][1];
      SPAN(y, s, P.skin);
      g.fillStyle = P.skinSh;
      g.fillRect(24 + s - 3, y, 4, 1);
      if (y <= 28) {
        g.fillStyle = P.skinHi;
        g.fillRect(24 - s, y, 2, 1);
      }
    }

    /* kel kafa parlaması */
    R(16, 5, 12, 2, P.skinHi);
    R(13, 9, 6, 1, P.skinHi);

    /* kaşlar */
    R(9, 11, 11, 2, P.hair);
    R(28, 11, 11, 2, P.hair);

    /* yuvarlak gözlük */
    RING(16, 20, 6, 1.8, P.glass, P.lens);
    RING(32, 20, 6, 1.8, P.glass, P.lens);
    R(11, 15, 3, 2, P.lensHi);
    R(27, 15, 3, 2, P.lensHi);
    R(22, 20, 5, 1, P.glass);
    R(12, 26, 6, 1, P.skinSh);
    R(29, 26, 6, 1, P.skinSh);

    /* gözler */
    if (eye === 0) {
      R(14, 19, 4, 3, P.glass);
      R(30, 19, 4, 3, P.glass);
    } else if (eye === 1) {
      R(13, 20, 6, 1, P.glass);
      R(29, 20, 6, 1, P.glass);
    } else {
      R(13, 17, 1, 1, P.glass); R(17, 22, 1, 1, P.glass);
      R(17, 17, 1, 1, P.glass); R(13, 22, 1, 1, P.glass);
      R(29, 17, 1, 1, P.glass); R(33, 22, 1, 1, P.glass);
      R(33, 17, 1, 1, P.glass); R(29, 22, 1, 1, P.glass);
    }

    /* burun */
    R(20, 22, 8, 8, P.skin);
    R(20, 22, 3, 8, P.skinHi);
    R(27, 23, 2, 6, P.skinSh);
    R(17, 30, 14, 1, P.skinSh);
    R(20, 29, 3, 1, P.skinDeep);
    R(25, 29, 3, 1, P.skinDeep);

    /* ağız */
    if (!mouthOpen) {
      R(14, 31, 3, 1, P.mouth);
      R(31, 31, 3, 1, P.mouth);
      R(16, 32, 16, 1, P.mouth);
      R(17, 33, 14, 1, P.skinSh);
    } else {
      R(15, 31, 18, 6, P.mouth);
      R(16, 31, 16, 1, P.teeth);
      R(19, 35, 10, 1, P.tongue);
    }

    /* gıdık */
    R(10, 37, 28, 1, P.skinSh);
    R(12, 38, 24, 1, P.skinSh);
    R(14, 39, 20, 1, P.skin);

    return cv;
  }

  function getPortrait(eye, mouthOpen) {
    const key = eye + '' + (mouthOpen ? 1 : 0);
    let s = portraitCache.get(key);
    if (!s) { s = renderPortrait(eye, mouthOpen); portraitCache.set(key, s); }
    return s;
  }
  /* ============================================================
     ARKA PLAN (bir kez çizilir)
     ============================================================ */
  const bgCv = document.createElement('canvas');
  bgCv.width = W; bgCv.height = H;
  (function buildBG() {
    const b = bgCv.getContext('2d');
    b.imageSmoothingEnabled = false;

    for (let y = 0; y < H; y++) {
      const t = y / H;
      const r = 16 + 26 * t;
      const gg = 14 + 20 * t;
      const bb = 30 + 38 * t;
      b.fillStyle = 'rgb(' + (r | 0) + ',' + (gg | 0) + ',' + (bb | 0) + ')';
      b.fillRect(0, y, W, 1);
    }

    /* duvar çizgileri */
    b.fillStyle = 'rgba(255,255,255,0.022)';
    for (let x = 0; x < W; x += 40) b.fillRect(x, 0, 2, GROUND_Y);

    /* toz / yıldızlar */
    let seed = 12345;
    const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    for (let i = 0; i < 55; i++) {
      const x = Math.floor(rnd() * W);
      const y = Math.floor(rnd() * (GROUND_Y - 40));
      const a = 0.06 + rnd() * 0.16;
      b.fillStyle = 'rgba(255,240,210,' + a.toFixed(3) + ')';
      const sz = rnd() > 0.75 ? 3 : 2;
      b.fillRect(x, y, sz, sz);
    }

    /* zemin */
    b.fillStyle = '#241f38';
    b.fillRect(0, GROUND_Y, W, H - GROUND_Y);
    b.fillStyle = '#3d3560';
    b.fillRect(0, GROUND_Y, W, 3);
    b.fillStyle = '#191527';
    b.fillRect(0, GROUND_Y + 3, W, 2);

    for (let x = 0; x < W; x += 32) {
      for (let y = GROUND_Y + 8; y < H; y += 16) {
        if (((x / 32) + (y / 16)) % 2 === 0) {
          b.fillStyle = 'rgba(255,255,255,0.018)';
          b.fillRect(x, y, 32, 16);
        }
      }
    }

    /* vinyet */
    const grd = b.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, 'rgba(0,0,0,0.35)');
    grd.addColorStop(0.45, 'rgba(0,0,0,0)');
    grd.addColorStop(1, 'rgba(0,0,0,0.45)');
    b.fillStyle = grd;
    b.fillRect(0, 0, W, H);
  })();

  /* üst karartma gradyanı */
  const topFade = (function () {
    const gr = ctx.createLinearGradient(0, 0, 0, 80);
    gr.addColorStop(0, 'rgba(14,12,22,0.97)');
    gr.addColorStop(0.55, 'rgba(14,12,22,0.6)');
    gr.addColorStop(1, 'rgba(14,12,22,0)');
    return gr;
  })();

  /* ============================================================
     SES
     ============================================================ */
  let actx = null;
  function audio() {
    if (!actx) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; }
    }
    if (actx && actx.state === 'suspended') actx.resume();
    return actx;
  }

  function beep(freq, dur, type, vol, delay) {
    const a = audio();
    if (!a) return;
    const t0 = a.currentTime + (delay || 0);
    const o = a.createOscillator();
    const gn = a.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(freq, t0);
    gn.gain.setValueAtTime(0.0001, t0);
    gn.gain.exponentialRampToValueAtTime(vol || 0.06, t0 + 0.012);
    gn.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(gn); gn.connect(a.destination);
    o.start(t0); o.stop(t0 + dur + 0.03);
  }

  function sfxGood() { beep(660, 0.09, 'square', 0.05); beep(990, 0.12, 'square', 0.045, 0.07); }
  function sfxBad() { beep(190, 0.16, 'sawtooth', 0.05); beep(110, 0.22, 'sawtooth', 0.05, 0.09); }
  function sfxStart() { beep(440, 0.09); beep(660, 0.09, 'square', 0.05, 0.1); beep(880, 0.16, 'square', 0.05, 0.2); }
  function sfxOver() { beep(523, 0.14); beep(415, 0.14, 'square', 0.05, 0.15); beep(330, 0.3, 'square', 0.05, 0.3); }
  function sfxToggle() { beep(560, 0.06, 'square', 0.04); }

  /* ============================================================
     KELİMELER
     ============================================================ */
  const GOOD_WORDS = ['KATARSIS', 'MIZANSEN', 'AVANGART', 'GROTESK', 'EKLEKTIK', 'TIRAT',
    'DRAMATURJI', 'AFORIZMA', 'BANAL', 'METAFOR', 'AMBIYANS', 'NÜANS', 'PARADOKS', 'SİNOPSİS'];
  const BAD_WORDS = ['NORMAL', 'HALK', 'ANADOLU', 'DÜZ', 'TOPLULUK', 'HERKES', 'SIRADAN',
    'KELOĞLAN', 'KOLPAÇİNO', 'MASKELİBEŞLER'];

  /* ============================================================
     DURUM
     ============================================================ */
  const state = {
    mode: 'menu',       // menu | play | over
    playerX: W / 2,
    walkT: 0,
    walkFrame: 0,
    mouthOpen: false,
    autoMouth: false,
    timeLeft: TOTAL_TIME,
    bread: 0,
    words: [],
    parts: [],
    pops: [],
    shake: 0,
    flash: 0,
    shock: 0,
    blink: false,
    blinkT: 0,
    blinkTimer: 2,
    spawnT: 1,
    overT: 0,
    pauseSel: 0,
    toastText: '',
    toastT: 0,
    best: 0,
    t: 0,
    dirt: []
  };

  try { state.best = parseInt(localStorage.getItem('gobit_best') || '0', 10) || 0; } catch (e) { state.best = 0; }
  try { state.autoMouth = localStorage.getItem('gobit_auto') === '1'; } catch (e) { state.autoMouth = false; }

  /* ön plan tozları */
  (function initDust() {
    for (let i = 0; i < 22; i++) {
      state.dirt.push({
        x: Math.random() * W,
        y: Math.random() * H,
        v: 6 + Math.random() * 16,
        s: Math.random() > 0.7 ? 2 : 1,
        a: 0.05 + Math.random() * 0.12
      });
    }
  })();

  /* ============================================================
     GİRDİ
     ============================================================ */
  const keys = { left: false, right: false, mouth: false };

  function unlockAudio() { audio(); }

  window.addEventListener('keydown', (e) => {
    unlockAudio();
    const k = e.key;

    /* duraklat */
    if (k === 'Escape' || k === 'p' || k === 'P') {
      e.preventDefault();
      if (state.mode === 'play' || state.mode === 'pause') togglePause();
      return;
    }

    /* otomatik ağız (PC) */
    if (k === 'o' || k === 'O') {
      e.preventDefault();
      toggleAuto();
      return;
    }

    if (state.mode === 'pause') {
      e.preventDefault();
      if (k === 'ArrowUp' || k === 'w' || k === 'W') state.pauseSel = (state.pauseSel + 2) % 3;
      else if (k === 'ArrowDown' || k === 's' || k === 'S') state.pauseSel = (state.pauseSel + 1) % 3;
      else if (k === 'Enter' || k === ' ') pauseAction();
      return;
    }

    if (k === 'ArrowLeft' || k === 'a' || k === 'A') { keys.left = true; e.preventDefault(); }
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') { keys.right = true; e.preventDefault(); }
    else if (k === ' ' || k === 'ArrowUp' || k === 'w' || k === 'W') {
      keys.mouth = true; e.preventDefault();
      if (state.mode !== 'play') action();
    }
    else if (k === 'Enter') {
      e.preventDefault();
      if (state.mode !== 'play') action();
    }
  }, { passive: false });

  window.addEventListener('keyup', (e) => {
    const k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') keys.left = false;
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') keys.right = false;
    else if (k === ' ' || k === 'ArrowUp' || k === 'w' || k === 'W') keys.mouth = false;
  });

  window.addEventListener('blur', () => { keys.left = keys.right = keys.mouth = false; });

  /* canvas tap = menü / tekrar / duraklat menüsü */
  canvas.addEventListener('pointerdown', (e) => {
    unlockAudio();
    const p = canvasPos(e);

    if (state.mode === 'pause') {
      const b = uiHit(p);
      if (b) pauseAction(b.id);
      return;
    }
    if (state.mode === 'over') {
      if (state.overT > 0.6) startGame();
      return;
    }

    const hit = uiHit(p);
    if (hit && hit.id === 'auto') { toggleAuto(); return; }
    if (state.mode === 'menu') startGame();
  });

  /* dokunmatik butonlar */
  function bindBtn(id, prop) {
    const el = document.getElementById(id);
    const on = (e) => {
      e.preventDefault();
      unlockAudio();
      keys[prop] = true;
      el.classList.add('down');
      if (prop === 'mouth' && state.mode !== 'play') action();
    };
    const off = (e) => {
      e.preventDefault();
      keys[prop] = false;
      el.classList.remove('down');
    };
    el.addEventListener('pointerdown', on);
    el.addEventListener('pointerup', off);
    el.addEventListener('pointercancel', off);
    el.addEventListener('pointerleave', off);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  bindBtn('btnLeft', 'left');
  bindBtn('btnRight', 'right');
  bindBtn('btnMouth', 'mouth');

  /* ---------------- otomatik ağız ---------------- */
  const autoBtn = document.getElementById('btnAuto');

  function syncAutoBtn() {
    if (!autoBtn) return;
    autoBtn.classList.toggle('active', state.autoMouth);
    autoBtn.setAttribute('aria-pressed', state.autoMouth ? 'true' : 'false');
    autoBtn.textContent = state.autoMouth ? 'OTO ✓' : 'OTO';
    if (autoBtn.offsetParent !== null) layout();
  }

  function toggleAuto() {
    state.autoMouth = !state.autoMouth;
    try { localStorage.setItem('gobit_auto', state.autoMouth ? '1' : '0'); } catch (err) { }
    syncAutoBtn();
    toast(state.autoMouth ? 'OTO AĞIZ AÇIK' : 'OTO AĞIZ KAPALI');
    sfxToggle();
  }

  if (autoBtn) {
    autoBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      unlockAudio();
      toggleAuto();
    });
    autoBtn.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  syncAutoBtn();

  /* ---------------- duraklat ---------------- */
  function togglePause() {
    if (state.mode === 'play') {
      state.mode = 'pause';
      state.pauseSel = 0;
      state.shake = 0;
      keys.mouth = false;
      sfxToggle();
      layout();
    } else if (state.mode === 'pause') {
      state.mode = 'play';
      sfxToggle();
      layout();
    }
  }

  function pauseAction(id) {
    let i = state.pauseSel;
    if (typeof id === 'string' && id.charAt(0) === 'p') i = parseInt(id.slice(1), 10) || 0;

    if (i === 0) {
      state.mode = 'play';
      sfxToggle();
      layout();
    } else if (i === 1) {
      startGame();
    } else {
      state.mode = 'menu';
      state.mouthOpen = false;
      state.overT = 0;
      layout();
      sfxToggle();
    }
  }

  const pauseBtn = document.getElementById('btnPause');
  if (pauseBtn) {
    pauseBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      unlockAudio();
      togglePause();
    });
    pauseBtn.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  const isTouch = /[?&]touch=1/.test(location.search) ||
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
    ('ontouchstart' in window) || (navigator.maxTouchPoints || 0) > 0;

  /* ============================================================
     OYUN AKIŞI
     ============================================================ */
  function action() {
    if (state.mode === 'menu') startGame();
    else if (state.mode === 'over' && state.overT > 0.6) startGame();
  }

  function startGame() {
    state.mode = 'play';
    state.timeLeft = TOTAL_TIME;
    state.bread = 0;
    state.words.length = 0;
    state.parts.length = 0;
    state.pops.length = 0;
    state.playerX = W / 2;
    state.spawnT = 0.8;
    state.shake = 0;
    state.flash = 0;
    state.shock = 0;
    state.overT = 0;
    sfxStart();
    layout();
  }

  function endGame() {
    state.mode = 'over';
    state.overT = 0;
    if (state.bread > state.best) {
      state.best = state.bread;
      try { localStorage.setItem('gobit_best', String(state.best)); } catch (e) { }
    }
    sfxOver();
    layout();
  }

  function popup(text, x, y, color) {
    state.pops.push({ text: text, x: x, y: y, life: 1, color: color });
  }

  function crumbs(x, y, color, n) {
    for (let i = 0; i < n; i++) {
      state.parts.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 190,
        vy: -80 - Math.random() * 140,
        life: 0.7 + Math.random() * 0.5,
        s: Math.random() > 0.5 ? 3 : 2,
        color: color
      });
    }
  }

  /* ---------------- spawn ---------------- */
  function spawnWord() {
    const elapsed = TOTAL_TIME - state.timeLeft;
    /* kötü kelime oranı oyun ilerledikçe biraz artar (25+ ulaşılabilir kalsın) */
    const badChance = 0.32 + Math.min(0.12, elapsed * 0.0024);
    const isBad = Math.random() < badChance;

    let text;
    if (isBad) {
      /* MASKELİBEŞLER uzun ve zor: hız arttıkça daha sık gelir */
      const t = Math.min(1, elapsed / 55);
      const maskW = 1 + t * 9;
      if (Math.random() * (maskW + BAD_WORDS.length - 1) < maskW) {
        text = 'MASKELİBEŞLER';
      } else {
        const others = BAD_WORDS.filter((w) => w !== 'MASKELİBEŞLER');
        text = others[(Math.random() * others.length) | 0];
      }
    } else {
      text = GOOD_WORDS[(Math.random() * GOOD_WORDS.length) | 0];
    }

    const sc = text.length <= 6 ? 4 : 3;
    const w = textWidth(text, sc) + 14;
    const h = 7 * sc + 16;

    const minX = 12;
    const maxX = W - 12 - w;
    const x = minX + Math.random() * Math.max(1, maxX - minX);

    const speedBase = 62 + elapsed * 1.7;
    const vy = speedBase * (0.85 + Math.random() * 0.4);

    state.words.push({
      text: text, bad: isBad, x: x, y: -h - 6, vy: vy, sc: sc, w: w, h: h
    });
  }

  /* ---------------- yeme ---------------- */
  function eatWord(index) {
    const wd = state.words[index];
    state.words.splice(index, 1);

    const cx = wd.x + wd.w / 2;

    if (wd.bad) {
      state.bread = Math.max(0, state.bread - 1);
      state.shake = 9;
      state.flash = 0.22;
      state.shock = 0.55;
      popup('-1', cx, wd.y, P.bad);
      crumbs(cx, wd.y + wd.h / 2, '#8d3a3a', 10);
      sfxBad();
    } else {
      state.bread += 1;
      popup('+1', cx, wd.y, P.good);
      crumbs(cx, wd.y + wd.h / 2, '#e0a95e', 12);
      sfxGood();
    }
  }

  /* otomatik ağız: sadece iyi kelime ağza yaklaşırken açılır */
  function autoWantsMouth() {
    const mouthTop = CHAR_TOP + 46;
    for (let i = 0; i < state.words.length; i++) {
      const wd = state.words[i];
      if (wd.bad) continue;
      const wcx = wd.x + wd.w / 2;
      if (Math.abs(wcx - state.playerX) >= (32 + wd.w / 2) - 8) continue;
      const bottom = wd.y + wd.h;
      if (bottom > mouthTop - 130 && wd.y < mouthTop + 28) return true;
    }
    return false;
  }

  /* ============================================================
     GÜNCELLEME
     ============================================================ */
  function update(dt) {
    state.t += dt;

    if (state.toastT > 0) state.toastT -= dt;

    /* duraklatıldı: oyun donar */
    if (state.mode === 'pause') return;

    /* göz kırpma */
    state.blinkTimer -= dt;
    if (state.blinkTimer <= 0 && !state.blink) {
      state.blink = true;
      state.blinkT = 0.11;
      state.blinkTimer = 2.2 + Math.random() * 3.5;
    }
    if (state.blink) {
      state.blinkT -= dt;
      if (state.blinkT <= 0) state.blink = false;
    }

    if (state.shake > 0) state.shake = Math.max(0, state.shake - dt * 40);
    if (state.flash > 0) state.flash = Math.max(0, state.flash - dt * 2.2);
    if (state.shock > 0) state.shock = Math.max(0, state.shock - dt);

    /* tozlar */
    for (let i = 0; i < state.dirt.length; i++) {
      const d = state.dirt[i];
      d.y -= d.v * dt;
      if (d.y < -4) { d.y = H + 4; d.x = Math.random() * W; }
    }

    /* parçacıklar */
    for (let i = state.parts.length - 1; i >= 0; i--) {
      const p = state.parts[i];
      p.vy += 900 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0 || p.y > H + 20) state.parts.splice(i, 1);
    }

    /* yazılar */
    for (let i = state.pops.length - 1; i >= 0; i--) {
      const p = state.pops[i];
      p.y -= 42 * dt;
      p.life -= dt * 1.15;
      if (p.life <= 0) state.pops.splice(i, 1);
    }

    if (state.mode === 'over') {
      state.overT += dt;
      return;
    }

    if (state.mode !== 'play') return;

    /* süre */
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      endGame();
      return;
    }

    /* hareket */
    let dir = 0;
    if (keys.left) dir -= 1;
    if (keys.right) dir += 1;

    const SPEED = 300;
    state.playerX += dir * SPEED * dt;
    state.playerX = Math.max(30, Math.min(W - 30, state.playerX));

    if (dir !== 0) {
      state.walkT += dt;
      state.walkFrame = 1 + (Math.floor(state.walkT * 7) % 2);
    } else {
      state.walkT = 0;
      state.walkFrame = 0;
    }

    state.mouthOpen = keys.mouth || (state.autoMouth && autoWantsMouth());

    /* spawn */
    const elapsed = TOTAL_TIME - state.timeLeft;
    const interval = Math.max(0.62, 1.5 - elapsed * 0.015);
    state.spawnT -= dt;
    if (state.spawnT <= 0) {
      spawnWord();
      state.spawnT = interval * (0.75 + Math.random() * 0.5);
    }

    /* kelimeler */
    const mouthCX = state.playerX;
    const mouthTop = CHAR_TOP + 46;
    const mouthH = 28;
    const mouthHalfW = 32;

    for (let i = state.words.length - 1; i >= 0; i--) {
      const wd = state.words[i];
      wd.y += wd.vy * dt;

      const wcx = wd.x + wd.w / 2;
      const overlapY = (wd.y + wd.h > mouthTop) && (wd.y < mouthTop + mouthH);
      const overlapX = Math.abs(wcx - mouthCX) < (mouthHalfW + wd.w / 2) - 8;

      if (overlapY && overlapX) {
        if (state.mouthOpen) {
          eatWord(i);
          continue;
        }
      }

      if (wd.y > H + 30) {
        crumbs(wd.x + wd.w / 2, GROUND_Y - 2, '#5a5170', 5);
        state.words.splice(i, 1);
      }
    }
  }

  /* ============================================================
     ÇİZİM
     ============================================================ */
  function eyeState() {
    if (state.shock > 0) return 2;
    if (state.blink) return 1;
    return 0;
  }

  function drawPlayer(atX) {
    const eye = eyeState();
    const spr = getCharSprite(state.mouthOpen, eye, state.walkFrame);
    const w = CW * CHAR_SCALE, h = CH * CHAR_SCALE;
    const cx = (atX === undefined) ? state.playerX : atX;
    const x = Math.round(cx - w / 2);
    const y = CHAR_TOP;

    pixelEllipse(ctx, cx, GROUND_Y + 3, 27, 6, 'rgba(0,0,0,0.35)');
    ctx.drawImage(spr, x, y, w, h);
  }

  function drawWord(wd) {
    const x = Math.round(wd.x), y = Math.round(wd.y);

    ctx.fillStyle = wd.bad ? 'rgba(58,10,16,0.93)' : 'rgba(10,32,18,0.93)';
    ctx.fillRect(x, y, wd.w, wd.h);

    const col = wd.bad ? '#ff5f5f' : '#7fd18a';
    ctx.fillStyle = col;
    ctx.fillRect(x, y, wd.w, 2);
    ctx.fillRect(x, y + wd.h - 2, wd.w, 2);
    ctx.fillRect(x, y, 2, wd.h);
    ctx.fillRect(x + wd.w - 2, y, 2, wd.h);

    ctx.fillStyle = wd.bad ? 'rgba(255,95,95,0.10)' : 'rgba(127,209,138,0.10)';
    ctx.fillRect(x + 2, y + 2, wd.w - 4, wd.h - 4);

    drawText(ctx, wd.text, x + wd.w / 2, y + 8, wd.sc,
      wd.bad ? '#ffd9d9' : '#d6ffe0', 'center', 'rgba(0,0,0,0.5)');
  }

  function drawBread(g, x, y, s) {
    const BW = 9, BH = 6;
    for (let r = 0; r < BH; r++) {
      for (let c = 0; c < BW; c++) {
        const corner = (r === 0 && (c === 0 || c === BW - 1)) ||
          (r === BH - 1 && (c === 0 || c === BW - 1));
        if (corner) continue;
        let col = '#e0a95e';
        if (r === 0) col = '#f5c98a';
        else if (r === BH - 1) col = '#b8813c';
        if (c === 0 || c === BW - 1) col = '#c98f45';
        if (r === 0 && (c === 0 || c === BW - 1)) col = '#d8a460';
        g.fillStyle = col;
        g.fillRect(x + c * s, y + r * s, s, s);
      }
    }
    g.fillStyle = '#a8712e';
    g.fillRect(x + 2 * s, y + s, s, 3 * s);
    g.fillRect(x + 4 * s, y + s, s, 3 * s);
    g.fillRect(x + 6 * s, y + s, s, 3 * s);
  }

  function drawHUD() {
    /* ekmek sayacı */
    ctx.fillStyle = 'rgba(12,10,20,0.9)';
    ctx.fillRect(10, 10, 148, 34);
    ctx.fillStyle = '#3d3560';
    ctx.fillRect(10, 10, 148, 2);
    ctx.fillRect(10, 42, 148, 2);

    drawBread(ctx, 18, 19, 3);
    drawText(ctx, String(state.bread), 48, 16, 3, '#ffe9c0', 'left', 'rgba(0,0,0,0.6)');

    /* otomatik ağız göstergesi */
    if (state.autoMouth) {
      const aw = textWidth('OTO AĞIZ', 2) + 14;
      ctx.fillStyle = 'rgba(12,26,16,0.92)';
      ctx.fillRect(10, 48, aw, 20);
      ctx.fillStyle = '#4f8a5c';
      ctx.fillRect(10, 48, aw, 2);
      ctx.fillRect(10, 66, aw, 2);
      drawText(ctx, 'OTO AĞIZ', 10 + aw / 2, 52, 2, '#9be0a8', 'center');
    }

    /* süre çubuğu */
    const bw = 190, bx = W - 12 - bw, by = 20, bh = 12;
    ctx.fillStyle = 'rgba(12,10,20,0.9)';
    ctx.fillRect(bx - 6, 10, bw + 12, 34);
    ctx.fillStyle = '#2a2440';
    ctx.fillRect(bx, by, bw, bh);

    const frac = Math.max(0, state.timeLeft / TOTAL_TIME);
    const col = frac > 0.35 ? '#7fd18a' : (frac > 0.18 ? '#e8c96a' : '#ff5f5f');
    ctx.fillStyle = col;
    ctx.fillRect(bx, by, Math.round(bw * frac), bh);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(bx, by, Math.round(bw * frac), 2);

    drawText(ctx, String(Math.ceil(state.timeLeft)), bx - 12, by - 1, 2, '#cfc4a6', 'right');
  }

  /* ============================================================
     ARAYÜZ PARÇALARI
     ============================================================ */
  let uiHits = [];

  function canvasPos(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (W / r.width),
      y: (e.clientY - r.top) * (H / r.height)
    };
  }

  function uiHit(p) {
    for (let i = uiHits.length - 1; i >= 0; i--) {
      const b = uiHits[i];
      if (p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h) return b;
    }
    return null;
  }

  /* piksel düğme */
  function pxButton(id, x, y, w, h, label, sc, kind) {
    uiHits.push({ id: id, x: x, y: y, w: w, h: h });

    const primary = kind === 'primary';
    const active = kind === 'active';

    /* gölge */
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(x + 3, y + 6, w, h);

    /* dış çerçeve */
    ctx.fillStyle = primary ? '#6b5216' : '#0d0b16';
    ctx.fillRect(x, y, w, h);

    /* gövde */
    ctx.fillStyle = primary ? '#c9962a' : (active ? '#24402b' : '#241f3a');
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

    /* üst ışık / alt gölge */
    ctx.fillStyle = primary ? '#e8c96a' : (active ? '#4f8a5c' : '#3a3255');
    ctx.fillRect(x + 2, y + 2, w - 4, 3);
    ctx.fillStyle = primary ? '#8a6214' : (active ? '#1d3a22' : '#151128');
    ctx.fillRect(x + 2, y + h - 5, w - 4, 3);

    const tc = primary ? '#2a1d06' : (active ? '#c4f0cc' : '#cfc4a6');
    drawText(ctx, label, x + w / 2, y + Math.round((h - 7 * sc) / 2) - 1, sc, tc, 'center');
  }

  /* kelime çipi (menüde örnek) */
  function drawChip(x, y, text, bad) {
    const sc = 2, w = textWidth(text, sc) + 16, h = 24;
    ctx.fillStyle = bad ? 'rgba(58,10,16,0.93)' : 'rgba(10,32,18,0.93)';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = bad ? '#ff5f5f' : '#7fd18a';
    ctx.fillRect(x, y, w, 2);
    ctx.fillRect(x, y + h - 2, w, 2);
    ctx.fillRect(x, y, 2, h);
    ctx.fillRect(x + w - 2, y, 2, h);
    drawText(ctx, text, x + w / 2, y + 5, sc, bad ? '#ffd9d9' : '#d6ffe0', 'center');
    return w;
  }

  /* arka planda süzülen hayalet kelimeler */
  const GHOSTS = [
    { t: 'SİNOPSİS', x: 372, y: 60, v: 11 },
    { t: 'KATARSIS', x: 438, y: 190, v: 15 },
    { t: 'METAFOR', x: 352, y: 300, v: 9 },
    { t: 'PARADOKS', x: 462, y: 120, v: 13 },
    { t: 'TİRAT', x: 560, y: 250, v: 17 }
  ];

  function drawGhostWords() {
    ctx.globalAlpha = 0.09;
    for (let i = 0; i < GHOSTS.length; i++) {
      const g = GHOSTS[i];
      const y = 380 - ((state.t * g.v + g.y) % 430);
      drawText(ctx, g.t, g.x, y, 2, '#b9aed6', 'left');
    }
    ctx.globalAlpha = 1;
  }

  function drawToast() {
    if (state.toastT <= 0) return;
    const w = textWidth(state.toastText, 2) + 28;
    const x = Math.round((W - w) / 2), y = 328;
    ctx.globalAlpha = Math.min(1, state.toastT * 1.6);
    ctx.fillStyle = 'rgba(12,10,20,0.95)';
    ctx.fillRect(x, y, w, 26);
    ctx.fillStyle = '#3d3560';
    ctx.fillRect(x, y, w, 2);
    ctx.fillRect(x, y + 24, w, 2);
    drawText(ctx, state.toastText, W / 2, y + 6, 2, '#ffe9c0', 'center');
    ctx.globalAlpha = 1;
  }

  function toast(text) {
    state.toastText = text;
    state.toastT = 1.7;
  }

  function drawMenu() {
    ctx.drawImage(bgCv, 0, 0);
    uiHits = [];
    drawGhostWords();

    const bob = Math.sin(state.t * 1.7) * 2;

    /* ---------- sol blok ---------- */
    drawText(ctx, 'DALYARRAK', 44, 26 + bob, 4, '#e8c96a', 'left', '#4a3410');
    drawText(ctx, 'GOBİT', 44, 58 + bob, 7, '#f4efe2', 'left', '#3a2c10');

    ctx.fillStyle = '#3d3560';
    ctx.fillRect(44, 122, 208, 2);
    ctx.fillStyle = '#e8c96a';
    ctx.fillRect(44, 122, 54, 2);

    drawText(ctx, 'KELİME YAKALAMA OYUNU', 45, 130, 2, '#8f86ab', 'left');

    let cw = drawChip(44, 158, 'KATARSIS', false);
    drawText(ctx, '+1', 44 + cw + 12, 162, 3, P.good, 'left');
    cw = drawChip(44, 188, 'NORMAL', true);
    drawText(ctx, '-1', 44 + cw + 12, 192, 3, P.bad, 'left');

    /* BAŞLA çevresinde nabız gibi atan altın çerçeve */
    ctx.globalAlpha = 0.14 + 0.14 * (0.5 + 0.5 * Math.sin(state.t * 3));
    ctx.fillStyle = '#e8c96a';
    ctx.fillRect(36, 212, 224, 2);
    ctx.fillRect(36, 272, 224, 2);
    ctx.fillRect(36, 212, 2, 62);
    ctx.fillRect(258, 212, 2, 62);
    ctx.globalAlpha = 1;

    pxButton('start', 44, 220, 208, 46, 'BAŞLA', 3, 'primary');

    pxButton('auto', 44, 274, 208, 28,
      state.autoMouth ? 'OTO AĞIZ: AÇIK' : 'OTO AĞIZ: KAPALI', 2,
      state.autoMouth ? 'active' : 'dark');

    drawText(ctx, isTouch
      ? 'SOL-SAĞ DÜĞME   AĞIZ DÜĞMESİ   OTO'
      : 'A/D HAREKET   BOŞLUK AĞIZ   O OTO   P MOLA',
      W / 2, 334, 2, '#6f678c', 'center');

    /* ---------- sağ blok: karakter ---------- */
    const cx = 498;

    const grd = ctx.createRadialGradient(cx, 250, 8, cx, 250, 132);
    grd.addColorStop(0, 'rgba(232,201,106,0.16)');
    grd.addColorStop(0.55, 'rgba(232,201,106,0.05)');
    grd.addColorStop(1, 'rgba(232,201,106,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(cx - 140, 110, 280, 230);

    const spr = getCharSprite(false, eyeState(), 0);
    const sw = CW * CHAR_SCALE, sh = CH * CHAR_SCALE;
    pixelEllipse(ctx, cx, GROUND_Y + 4, 32, 7, 'rgba(0,0,0,0.35)');
    ctx.drawImage(spr, Math.round(cx - sw / 2), CHAR_TOP, sw, sh);

    /* rekor */
    if (state.best > 0) {
      drawText(ctx, 'REKOR', W - 26, 20, 2, '#6f678c', 'right');
      drawText(ctx, String(state.best), W - 26, 36, 4, '#b9aed6', 'right');
    }

    /* ince çerçeve */
    ctx.fillStyle = 'rgba(61,53,96,0.9)';
    ctx.fillRect(6, 6, W - 12, 2);
    ctx.fillRect(6, H - 8, W - 12, 2);
    ctx.fillRect(6, 6, 2, H - 12);
    ctx.fillRect(W - 8, 6, 2, H - 12);

    /* köşe süsleri */
    ctx.fillStyle = '#6b5216';
    ctx.fillRect(6, 6, 18, 2);
    ctx.fillRect(6, 6, 2, 18);
    ctx.fillRect(W - 24, 6, 18, 2);
    ctx.fillRect(W - 8, 6, 2, 18);
    ctx.fillRect(6, H - 8, 18, 2);
    ctx.fillRect(6, H - 24, 2, 18);
    ctx.fillRect(W - 24, H - 8, 18, 2);
    ctx.fillRect(W - 8, H - 24, 2, 18);

    /* parıltılar */
    const sparkles = [[270, 44, 0], [424, 84, 1.4], [298, 126, 2.3], [560, 180, 0.8]];
    for (let i = 0; i < sparkles.length; i++) {
      const sp = sparkles[i];
      const a = Math.max(0, Math.sin(state.t * 2.2 + sp[2]));
      ctx.fillStyle = 'rgba(255,233,192,' + (a * 0.55).toFixed(3) + ')';
      ctx.fillRect(sp[0] - 3, sp[1] - 1, 7, 2);
      ctx.fillRect(sp[0] - 1, sp[1] - 3, 2, 7);
    }

    /* hafif CRT tarama çizgileri */
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    for (let sy = 0; sy < H; sy += 4) ctx.fillRect(0, sy, W, 1);
  }

  function drawPause() {
    uiHits = [];

    ctx.fillStyle = 'rgba(8,7,14,0.8)';
    ctx.fillRect(0, 0, W, H);

    /* dokunmatikte daha büyük panel ve butonlar */
    const touch = isTouch;
    const pw = touch ? 470 : 430;
    const ph = touch ? 300 : 236;
    const px = (W - pw) / 2, py = (H - ph) / 2;

    ctx.fillStyle = 'rgba(20,17,32,0.98)';
    ctx.fillRect(px, py, pw, ph);
    ctx.fillStyle = '#3d3560';
    ctx.fillRect(px, py, pw, 3);
    ctx.fillRect(px, py + ph - 3, pw, 3);
    ctx.fillRect(px, py, 3, ph);
    ctx.fillRect(px + pw - 3, py, 3, ph);

    drawText(ctx, 'DURAKLATILDI', W / 2, py + (touch ? 16 : 20), 4, '#e8c96a', 'center', 'rgba(0,0,0,0.6)');
    drawText(ctx, 'MOLA ZAMANI', W / 2, py + (touch ? 58 : 62), 2, '#8f86ab', 'center');

    const bw = touch ? 330 : 246, bx = (W - bw) / 2;
    const ih = touch ? 54 : 34;
    const step = touch ? 62 : 42;
    const top = py + (touch ? 82 : 94);
    const items = ['DEVAM ET', 'YENİDEN BAŞLAT', 'ANA MENÜ'];
    for (let i = 0; i < 3; i++) {
      const sel = state.pauseSel === i;
      pxButton('p' + i, bx, top + i * step, bw, ih, items[i], touch ? 3 : 2, sel ? 'primary' : 'dark');
    }

    drawText(ctx, isTouch ? 'DÜĞMELERE DOKUN' : 'YUKARI-AŞAĞI + ENTER    ESC DEVAM',
      W / 2, touch ? py + ph - 20 : py + ph + 12, 2, '#6f678c', 'center');
  }

  function drawOver() {
    /* karart */
    const a = Math.min(0.82, state.overT * 2.4);
    ctx.fillStyle = 'rgba(8,7,14,' + a.toFixed(3) + ')';
    ctx.fillRect(0, 0, W, H);

    if (state.overT < 0.25) return;

    /* panel */
    const pw = 600, ph = 300;
    const px = (W - pw) / 2, py = (H - ph) / 2;
    ctx.fillStyle = 'rgba(20,17,32,0.96)';
    ctx.fillRect(px, py, pw, ph);
    ctx.fillStyle = '#3d3560';
    ctx.fillRect(px, py, pw, 3);
    ctx.fillRect(px, py + ph - 3, pw, 3);
    ctx.fillRect(px, py, 3, ph);
    ctx.fillRect(px + pw - 3, py, 3, ph);

    drawText(ctx, 'OYUN BİTTİ', W / 2, py + 10, 4, '#e8c96a', 'center', 'rgba(0,0,0,0.6)');

    /* 25+ : panonun sağ tarafında kutlama konfetisi */
    if (state.bread >= 25) {
      for (let i = 0; i < 16; i++) {
        const cx2 = px + 216 + ((state.t * (22 + (i % 4) * 9) + i * 61) % (pw - 260));
        const cy2 = py + 30 + ((state.t * (18 + (i % 5) * 8) + i * 47) % (ph - 66));
        ctx.globalAlpha = 0.28 + 0.42 * (0.5 + 0.5 * Math.sin(state.t * 6 + i));
        ctx.fillStyle = i % 3 === 0 ? '#e8c96a' : (i % 3 === 1 ? '#7fd18a' : '#ffe9c0');
        ctx.fillRect(Math.round(cx2), Math.round(cy2), 3, 3);
      }
      ctx.globalAlpha = 1;
    }

    /* portre fotoğrafı */
    const pY = py + 46;
    const pH2 = 214;
    const pW2 = Math.round(pH2 * 1408 / 1775);
    const pX = px + 20;

    ctx.fillStyle = '#0d0b16';
    ctx.fillRect(pX - 5, pY - 5, pW2 + 10, pH2 + 10);
    ctx.fillStyle = '#6b5f2a';
    ctx.fillRect(pX - 3, pY - 3, pW2 + 6, pH2 + 6);
    if (portraitImg.complete && portraitImg.naturalWidth) {
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(portraitImg, pX, pY, pW2, pH2);
      ctx.restore();
    } else {
      ctx.drawImage(getPortrait(0, false), pX, pY, pW2, pH2);
    }

    /* skor */
    const sx = px + 216;
    drawText(ctx, 'DALYARRAK GOBİT', sx, py + 52, 2, '#8f86ab', 'left');

    drawBread(ctx, sx, py + 78, 6);
    drawText(ctx, String(state.bread), sx + 68, py + 62, 9, '#ffe9c0', 'left', 'rgba(0,0,0,0.65)');

    drawText(ctx, 'REKOR', sx, py + 166, 2, '#6f678c', 'left');
    drawText(ctx, String(Math.max(state.best, state.bread)), sx + 72, py + 160, 3,
      '#b9aed6', 'left');

    /* mesaj — skor seviyesi */
    let msg, msgCol;
    if (state.bread >= 25) { msg = 'DALYARRAK!!'; msgCol = '#7fd18a'; }
    else if (state.bread >= 15) { msg = 'HERSİKOLOG ÇIRAĞI'; msgCol = '#7fd18a'; }
    else if (state.bread >= 11) { msg = 'KAYRA'; msgCol = '#e8c96a'; }
    else if (state.bread >= 1) { msg = 'HERHANGİ BİRİ'; msgCol = '#e8c96a'; }
    else { msg = 'SİNEAPOŞ SEVİYESİ'; msgCol = '#e8c96a'; }

    if (state.bread >= 25) {
      /* DALYARRAK!! — yanıp sönen yazı + parıltılar */
      const blink = Math.floor(state.t * 7) % 2 === 0;
      const msgW = textWidth(msg, 3);
      const glow = 0.16 + 0.18 * (0.5 + 0.5 * Math.sin(state.t * 7));

      ctx.fillStyle = 'rgba(127,209,138,' + glow.toFixed(3) + ')';
      ctx.fillRect(sx - 8, py + 204, msgW + 16, 36);

      drawText(ctx, msg, sx, py + 212, 3, blink ? '#b6ffc4' : '#ffe9c0',
        'left', 'rgba(0,0,0,0.75)');

      /* yazının etrafında yanıp sönen yıldızlar */
      for (let i = 0; i < 6; i++) {
        if (Math.sin(state.t * 5 + i * 1.3) < 0.15) continue;
        const sxp = sx + ((i * 47 + 12) % (msgW + 10));
        const syp = py + 199 + (i % 2 ? -5 : 26);
        ctx.fillStyle = i % 2 ? '#ffe9c0' : '#b6ffc4';
        ctx.fillRect(sxp - 3, syp, 7, 1);
        ctx.fillRect(sxp, syp - 3, 1, 7);
      }
    } else {
      drawText(ctx, msg, sx, py + 212, 3, msgCol, 'left');
    }

    if (state.overT > 0.9 && Math.floor(state.t * 2) % 2 === 0) {
      drawText(ctx, isTouch ? 'TEKRAR İÇİN DOKUN' : 'TEKRAR İÇİN BOŞLUK', W / 2, py + ph + 14, 2, '#cfc4a6', 'center');
    }
  }

  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (state.mode === 'menu') {
      drawMenu();
      return;
    }
    uiHits = [];

    /* sarsıntı */
    if (state.shake > 0) {
      const sx = (Math.random() - 0.5) * state.shake;
      const sy = (Math.random() - 0.5) * state.shake;
      ctx.translate(sx, sy);
    }

    ctx.drawImage(bgCv, 0, 0);

    /* tozlar */
    for (let i = 0; i < state.dirt.length; i++) {
      const d = state.dirt[i];
      ctx.fillStyle = 'rgba(255,238,205,' + d.a.toFixed(3) + ')';
      ctx.fillRect(Math.round(d.x), Math.round(d.y), d.s, d.s);
    }

    /* kelimeler */
    for (let i = 0; i < state.words.length; i++) drawWord(state.words[i]);

    /* üst karartma (kelimeler HUD'un altına yumuşak girsin) */
    ctx.fillStyle = topFade;
    ctx.fillRect(0, 0, W, 80);

    /* karakter */
    drawPlayer();

    /* parçacıklar */
    for (let i = 0; i < state.parts.length; i++) {
      const p = state.parts[i];
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 2));
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
    }
    ctx.globalAlpha = 1;

    /* yazılar */
    for (let i = 0; i < state.pops.length; i++) {
      const p = state.pops[i];
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
      drawText(ctx, p.text, p.x, p.y, 3, p.color, 'center', 'rgba(0,0,0,0.6)');
    }
    ctx.globalAlpha = 1;

    /* kırmızı flaş */
    if (state.flash > 0) {
      ctx.fillStyle = 'rgba(255,60,60,' + (state.flash * 0.5).toFixed(3) + ')';
      ctx.fillRect(0, 0, W, H);
    }

    drawHUD();
    drawToast();

    if (state.mode === 'pause') drawPause();
    else if (state.mode === 'over') drawOver();
  }

  /* ============================================================
     DÖNGÜ
     ============================================================ */
  let last = 0;
  function loop(ts) {
    if (!last) last = ts;
    let dt = (ts - last) / 1000;
    last = ts;
    if (dt > 0.05) dt = 0.05;
    if (dt < 0) dt = 0;

    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  /* ============================================================
     YERLEŞİM (responsive / mobil uyum)
     ============================================================ */
  const wrapEl = document.getElementById('wrap');
  const controlsEl = document.getElementById('controls');

  function layout() {
    const showControls = isTouch && (state.mode === 'play' || state.mode === 'pause');
    controlsEl.classList.toggle('on', showControls);
    controlsEl.classList.toggle('paused', state.mode === 'pause');
    controlsEl.classList.toggle('off', false);

    const cs = getComputedStyle(wrapEl);
    const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const gap = parseFloat(cs.rowGap) || parseFloat(cs.gap) || 0;
    const row = cs.flexDirection === 'row';

    /* yatay telefonda düğmeler oyunun üstünde: yer kaplamaz */
    const overlay = showControls &&
      window.matchMedia('(orientation: landscape) and (max-height: 560px)').matches;

    /* çerçeve gölgesi için küçük pay */
    const ctrlW = (showControls && !overlay && row) ? (controlsEl.offsetWidth + gap) : 0;
    const ctrlH = (showControls && !overlay && !row) ? (controlsEl.offsetHeight + gap) : 0;

    const availW = Math.max(120, wrapEl.clientWidth - padX - ctrlW - 16);
    const availH = Math.max(90, wrapEl.clientHeight - padY - ctrlH - 16);

    const s = Math.min(availW / W, availH / H);
    canvas.style.width = Math.max(1, Math.round(W * s)) + 'px';
    canvas.style.height = Math.max(1, Math.round(H * s)) + 'px';
  }

  window.addEventListener('resize', layout);
  window.addEventListener('orientationchange', () => setTimeout(layout, 120));

  /* başlat */
  layout();
  requestAnimationFrame(loop);

  /* dokunmatik cihazlarda ilk dokunuşta sesi aç */
  window.addEventListener('pointerdown', unlockAudio, { once: true });

  /* geliştirme kancası */
  window.__GOBIT = {
    state: state,
    getCharSprite: getCharSprite,
    getPortrait: getPortrait,
    drawText: drawText,
    textWidth: textWidth,
    spawnWord: spawnWord,
    CW: CW, CH: CH, PW: PW, PH: PH
  };

})();
