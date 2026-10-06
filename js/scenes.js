/* ============================================================
   場景插畫（inline SVG + CSS 動畫）
   每個函式回傳一段 SVG 字串，動畫 class 定義於 style.css
   ============================================================ */
const SCENES = {

  /* 首頁：盾牌 + 小安 */
  hero() {
    return `
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="盾牌與角色">
  <defs>
    <linearGradient id="g-shield" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7c5cff"/><stop offset="1" stop-color="#4cc9f0"/>
    </linearGradient>
  </defs>
  <g class="a-spin-slow" opacity="0.25">
    <circle cx="150" cy="150" r="130" fill="none" stroke="#ffd166" stroke-width="2" stroke-dasharray="6 14"/>
  </g>
  <g class="a-hands">
    <path d="M150 40 L230 70 V140 C230 200 190 240 150 262 C110 240 70 200 70 140 V70 Z" fill="url(#g-shield)" stroke="#fff" stroke-opacity="0.5" stroke-width="3"/>
    <path d="M150 62 L212 86 V140 C212 186 182 218 150 236 C118 218 88 186 88 140 V86 Z" fill="#0f1226" opacity="0.45"/>
    <!-- 小安 -->
    <circle cx="150" cy="128" r="30" fill="#ffe0bd"/>
    <path d="M120 125 C120 100 180 100 180 125 L180 118 C180 95 120 95 120 118 Z" fill="#3b2a4a"/>
    <circle cx="139" cy="130" r="3.5" fill="#1a1a2e" class="a-blink"/>
    <circle cx="161" cy="130" r="3.5" fill="#1a1a2e" class="a-blink"/>
    <path d="M140 143 Q150 151 160 143" stroke="#1a1a2e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M110 200 C110 170 190 170 190 200 V215 H110 Z" fill="#ffd166"/>
    <rect x="137" y="162" width="26" height="14" rx="4" fill="#fff"/>
  </g>
  <text x="48" y="80" font-size="26" class="a-pop">🔒</text>
  <text x="228" y="110" font-size="26" class="a-pop" style="animation-delay:-1.2s">🔑</text>
  <text x="60" y="240" font-size="22" class="a-pop" style="animation-delay:-0.6s">✅</text>
</svg>`;
  },

  /* 第 1 關：手機 + 釣魚簡訊 + 魚鉤 */
  phone(c) {
    return `
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="釣魚簡訊">
  <g class="a-swing">
    <line x1="230" y1="0" x2="230" y2="110" stroke="#d9dcf5" stroke-width="2"/>
    <path d="M230 110 c0 18 -22 22 -24 6" stroke="#ffd166" stroke-width="4" fill="none" stroke-linecap="round"/>
    <text x="194" y="128" font-size="22">💳</text>
  </g>
  <g class="a-shake">
    <rect x="70" y="60" width="130" height="230" rx="22" fill="#1d2247" stroke="#fff" stroke-opacity="0.4" stroke-width="3"/>
    <rect x="80" y="78" width="110" height="190" rx="12" fill="#0f1226"/>
    <rect x="115" y="68" width="40" height="5" rx="3" fill="#333a66"/>
    <g class="a-pop">
      <rect x="88" y="100" width="94" height="78" rx="12" fill="${c}"/>
      <text x="96" y="120" font-size="10" fill="#1a1a2e" font-weight="700">【○○銀行】</text>
      <text x="96" y="136" font-size="9" fill="#1a1a2e">帳戶異常，請於24h內</text>
      <text x="96" y="150" font-size="9" fill="#1a1a2e">點選連結完成驗證</text>
      <rect x="96" y="158" width="78" height="12" rx="6" fill="#1a1a2e" opacity="0.8"/>
      <text x="104" y="167" font-size="7" fill="#4cc9f0">https://bank-verify-xx.io</text>
    </g>
    <text x="100" y="230" font-size="28">😰</text>
  </g>
  <text x="20" y="280" font-size="22" class="a-type">💸</text>
  <text x="44" y="280" font-size="22" class="a-type d1">💸</text>
  <text x="68" y="280" font-size="22" class="a-type d2">💸</text>
</svg>`;
  },

  /* 第 2 關：駭客 + 筆電 + 掉落鑰匙 */
  hacker(c) {
    return `
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="密碼撞庫">
  <text x="40" y="60" font-size="26" class="a-fall">🔑</text>
  <text x="130" y="40" font-size="26" class="a-fall d1">🔑</text>
  <text x="225" y="70" font-size="26" class="a-fall d2">🔑</text>
  <!-- 連帽人 -->
  <path d="M90 250 C90 170 210 170 210 250 Z" fill="#2b2d5c"/>
  <path d="M110 150 C110 90 190 90 190 150 L190 180 L110 180 Z" fill="#2b2d5c"/>
  <ellipse cx="150" cy="150" rx="30" ry="36" fill="#0f1226"/>
  <circle cx="139" cy="150" r="4" fill="${c}" class="a-glow"/>
  <circle cx="161" cy="150" r="4" fill="${c}" class="a-glow"/>
  <!-- 筆電 -->
  <rect x="85" y="215" width="130" height="70" rx="6" fill="#1d2247" stroke="#fff" stroke-opacity="0.4" stroke-width="2"/>
  <rect x="93" y="222" width="114" height="52" fill="#0f1226"/>
  <text x="100" y="238" font-size="8" fill="#2ecc71" font-family="monospace">user01 : pass123 ✗</text>
  <text x="100" y="250" font-size="8" fill="#2ecc71" font-family="monospace">user02 : pass123 ✗</text>
  <text x="100" y="262" font-size="8" fill="#ff5c7a" font-family="monospace" class="a-type">user03 : pass123 ✔ LOGIN</text>
  <text x="235" y="240" font-size="24" class="a-pop">📈</text>
</svg>`;
  },

  /* 第 3 關：糖果 ⇄ 骷髏（包著糖衣的毒藥） */
  mask(c) {
    return `
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="社交工程">
  <circle cx="150" cy="150" r="110" fill="${c}" opacity="0.15"/>
  <g class="a-flip">
    <text x="150" y="190" font-size="110" text-anchor="middle">🍬</text>
    <text x="150" y="250" font-size="16" text-anchor="middle" fill="#fff" font-weight="700">「早安～今天也要加油喔 ☀️」</text>
  </g>
  <g class="a-flip-back">
    <text x="150" y="190" font-size="110" text-anchor="middle">💀</text>
    <text x="150" y="250" font-size="16" text-anchor="middle" fill="#ff5c7a" font-weight="700">「建議加碼 30 萬」</text>
  </g>
  <text x="40" y="70" font-size="24" class="a-heart">💗</text>
  <text x="230" y="90" font-size="24" class="a-heart d1">💗</text>
  <text x="60" y="260" font-size="24" class="a-heart d2">💗</text>
</svg>`;
  },

  /* 第 4 關：聊天泡泡 + 驗證碼 */
  chat(c) {
    return `
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="LINE 盜帳號">
  <rect x="40" y="30" width="220" height="240" rx="20" fill="#1d2247" stroke="#fff" stroke-opacity="0.35" stroke-width="3"/>
  <rect x="40" y="30" width="220" height="40" rx="20" fill="${c}"/>
  <text x="60" y="56" font-size="14" fill="#1a1a2e" font-weight="900">👤 同事 小李</text>
  <g class="a-bubble">
    <rect x="55" y="85" width="150" height="40" rx="14" fill="#2b2d5c"/>
    <text x="65" y="103" font-size="10" fill="#fff">幫我兒子投一票好嗎？</text>
    <text x="65" y="117" font-size="10" fill="#fff">先輸入手機號碼認證～</text>
  </g>
  <g class="a-bubble d1">
    <rect x="110" y="135" width="130" height="26" rx="12" fill="#2ecc71"/>
    <text x="122" y="152" font-size="10" fill="#0b2e1a">09xx-xxx-xxx 好啊</text>
  </g>
  <g class="a-bubble d2">
    <rect x="55" y="172" width="170" height="40" rx="14" fill="#2b2d5c"/>
    <text x="65" y="190" font-size="10" fill="#fff">系統會傳驗證碼到你手機</text>
    <text x="65" y="204" font-size="10" fill="#fff">截圖給我 🙏</text>
  </g>
  <g class="a-bubble d3">
    <rect x="130" y="222" width="110" height="30" rx="12" fill="#ff5c7a"/>
    <text x="142" y="242" font-size="12" fill="#fff" font-weight="900">驗證碼 4 8 2 9 1 7</text>
  </g>
  <text x="235" y="40" font-size="30" class="a-pop">🔓</text>
</svg>`;
  },

  /* 第 5 關：盾牌 + 鑰匙繞行 + SIM 卡 */
  shield(c) {
    return `
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="FIDO 零信任">
  <circle cx="150" cy="150" r="118" fill="none" stroke="${c}" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="4 10"/>
  <path d="M150 50 L220 76 V140 C220 192 186 228 150 248 C114 228 80 192 80 140 V76 Z" fill="${c}" class="a-glow"/>
  <path d="M150 70 L204 90 V140 C204 180 178 208 150 226 C122 208 96 180 96 140 V90 Z" fill="#0f1226" opacity="0.5"/>
  <text x="150" y="165" font-size="54" text-anchor="middle">👆</text>
  <text x="150" y="205" font-size="12" text-anchor="middle" fill="#fff" font-weight="900">Passkey</text>
  <g class="a-orbit">
    <text x="150" y="40" font-size="26" text-anchor="middle">🔑</text>
  </g>
  <g class="a-fall" style="animation-duration:3.5s">
    <text x="30" y="80" font-size="26">📵</text>
  </g>
  <text x="235" y="270" font-size="26" class="a-pop">✅</text>
</svg>`;
  },

  /* 第 6 關：機器人吞文件 */
  robot(c) {
    return `
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AI 與個資">
  <text x="60" y="150" font-size="26" class="a-flow">📄</text>
  <text x="60" y="150" font-size="26" class="a-flow d1">📇</text>
  <text x="60" y="150" font-size="26" class="a-flow d2">🪪</text>
  <rect x="150" y="80" width="120" height="130" rx="22" fill="#1d2247" stroke="${c}" stroke-width="4"/>
  <rect x="200" y="50" width="6" height="30" fill="${c}"/>
  <circle cx="203" cy="46" r="8" fill="${c}" class="a-glow"/>
  <rect x="170" y="110" width="26" height="26" rx="8" fill="${c}" class="a-blink"/>
  <rect x="224" y="110" width="26" height="26" rx="8" fill="${c}" class="a-blink"/>
  <rect x="178" y="160" width="64" height="22" rx="8" fill="#0f1226"/>
  <rect x="184" y="166" width="8" height="10" fill="${c}" class="a-type"/>
  <rect x="198" y="166" width="8" height="10" fill="${c}" class="a-type d1"/>
  <rect x="212" y="166" width="8" height="10" fill="${c}" class="a-type d2"/>
  <rect x="226" y="166" width="8" height="10" fill="${c}" class="a-type"/>
  <rect x="165" y="210" width="90" height="50" rx="12" fill="#2b2d5c"/>
  <text x="150" y="285" font-size="12" text-anchor="middle" fill="#a7acd1">輸入內容可用於模型訓練…</text>
</svg>`;
  },

  /* 第 7 關：法槌 + 法典 */
  law(c) {
    return `
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="個資法">
  <rect x="70" y="200" width="160" height="60" rx="8" fill="#2b2d5c"/>
  <rect x="80" y="192" width="140" height="14" rx="4" fill="${c}"/>
  <text x="150" y="238" font-size="14" text-anchor="middle" fill="#fff" font-weight="900">個人資料保護法</text>
  <rect x="60" y="150" width="90" height="14" rx="4" fill="#4a4e8a"/>
  <g class="a-gavel">
    <rect x="120" y="60" width="70" height="40" rx="8" fill="${c}"/>
    <rect x="150" y="100" width="12" height="70" rx="4" fill="#8a6d3b" transform="rotate(35 156 100)"/>
  </g>
  <text x="200" y="130" font-size="26" class="a-pop">⚠️</text>
  <text x="40" y="100" font-size="20" class="a-pop" style="animation-delay:-1s">§27</text>
  <text x="230" y="60" font-size="20" fill="#ffd166" class="a-pop" style="animation-delay:-1.8s">72h</text>
</svg>`;
  },

  /* 第 8 關：銀行 + 警察 握手 */
  handshake(c) {
    return `
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="檢警合作">
  <circle cx="150" cy="150" r="115" fill="${c}" opacity="0.12"/>
  <text x="50" y="140" font-size="64">🏦</text>
  <text x="186" y="140" font-size="64">👮</text>
  <g class="a-hands">
    <text x="150" y="215" font-size="64" text-anchor="middle">🤝</text>
  </g>
  <text x="120" y="90" font-size="22" class="a-heart">🛡️</text>
  <text x="160" y="90" font-size="22" class="a-heart d1">💰</text>
  <text x="140" y="80" font-size="22" class="a-heart d2">👵</text>
  <text x="150" y="270" font-size="13" text-anchor="middle" fill="#fff" font-weight="700">個資法不是配合防詐的阻礙</text>
</svg>`;
  }
};
