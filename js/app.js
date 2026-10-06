/* ============================================================
   個資保衛戰 – 主程式
   ============================================================ */
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const STORAGE_KEY = "infosec-quiz-v1";
  const QUICK_COUNT = 10;
  const QUICK_SECONDS = 20;

  /* ---------- 狀態 ---------- */
  const state = {
    mode: "story",        // story | quick
    level: null,          // 目前關卡物件（story 模式）
    queue: [],            // 本輪題目（已處理選項順序）
    idx: 0,
    correct: 0,
    answered: false,
    storyStep: 0,
    timer: null,
    timeLeft: 0,
    progress: loadProgress()
  };

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { best: {} }; }
    catch { return { best: {} }; }
  }
  function saveProgress() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress)); } catch { /* ignore */ }
  }

  /* ---------- 工具 ---------- */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    const el = $("#" + id);
    el.classList.remove("active");
    void el.offsetWidth; // 重新觸發進場動畫
    el.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 1800);
  }
  function setLevelColor(color) {
    document.documentElement.style.setProperty("--lc", color);
  }
  /** 打亂選項並重新對應答案 */
  function prepareQuestion(q, level) {
    if (q.type === "tf") {
      return { ...q, level, options: ["⭕ 正確", "❌ 錯誤"], answerIdx: q.answer ? 0 : 1 };
    }
    const order = shuffle(q.options.map((_, i) => i));
    return {
      ...q, level,
      options: order.map((i) => q.options[i]),
      answerIdx: order.indexOf(q.answer)
    };
  }
  function starsFor(correct, total) {
    const r = correct / total;
    return r >= 0.9 ? 3 : r >= 0.6 ? 2 : r > 0 ? 1 : 0;
  }

  /* ---------- 首頁 ---------- */
  function renderHome() {
    $("#hero-art").innerHTML = SCENES.hero();
    setLevelColor("#ffd166");
    showScreen("screen-home");
  }

  /* ---------- 關卡地圖 ---------- */
  function renderMap() {
    const grid = $("#level-grid");
    grid.innerHTML = "";
    let done = 0, totalCorrect = 0, totalQ = 0;
    LEVELS.forEach((lv) => {
      const best = state.progress.best[lv.id];
      const total = lv.questions.length;
      totalQ += total;
      if (best) { done++; totalCorrect += best.correct; }
      const stars = best ? starsFor(best.correct, total) : 0;
      const card = document.createElement("button");
      card.className = "level-card";
      card.style.setProperty("--lc", lv.color);
      card.innerHTML = `
        <div class="level-num">LEVEL ${String(lv.id).padStart(2, "0")}</div>
        <span class="level-icon">${lv.icon}</span>
        <h3 class="level-title">${lv.title}</h3>
        <p class="level-sub">${lv.subtitle} · ${total} 題</p>
        <div class="level-stat">
          <span class="level-stars">${[1, 2, 3].map((i) => `<span class="${i <= stars ? "" : "off"}">★</span>`).join("")}</span>
          <span class="level-best">${best ? `最佳 ${best.correct}/${total}` : "尚未挑戰"}</span>
        </div>`;
      card.addEventListener("click", () => startLevel(lv));
      grid.appendChild(card);
    });
    $("#map-summary").textContent = done
      ? `已完成 ${done} / ${LEVELS.length} 關 · 累計答對 ${totalCorrect} / ${totalQ} 題`
      : "選一個章節開始挑戰，每一關都可以重複練習。";
    const foot = $("#map-foot");
    foot.innerHTML = "";
    if (done === LEVELS.length) {
      const b = document.createElement("button");
      b.className = "btn btn-primary";
      b.textContent = "🎓 查看結業稱號";
      b.addEventListener("click", () => renderFinal(totalCorrect, totalQ, true));
      foot.appendChild(b);
    }
    setLevelColor("#ffd166");
    showScreen("screen-map");
  }

  /* ---------- 故事 ---------- */
  function startLevel(lv) {
    state.mode = "story";
    state.level = lv;
    state.queue = lv.questions.map((q) => prepareQuestion(q, lv));
    state.idx = 0;
    state.correct = 0;
    state.storyStep = 0;
    setLevelColor(lv.color);
    $("#story-art").innerHTML = SCENES[lv.scene](lv.color);
    $("#story-tag").textContent = `LEVEL ${String(lv.id).padStart(2, "0")} · ${lv.subtitle}`;
    $("#story-title").textContent = `${lv.icon} ${lv.title}`;
    $("#story-text").innerHTML = "";
    $("#btn-story-next").textContent = "繼續 ▸";
    $("#btn-story-skip").classList.remove("hidden");
    showScreen("screen-story");
    storyNext();
  }
  function storyNext() {
    const lv = state.level;
    if (state.storyStep < lv.story.length) {
      const p = document.createElement("p");
      p.textContent = lv.story[state.storyStep];
      $("#story-text").appendChild(p);
      state.storyStep++;
      if (state.storyStep === lv.story.length) {
        $("#btn-story-next").textContent = "開始挑戰 🚀";
        $("#btn-story-skip").classList.add("hidden");
      }
    } else {
      startQuiz();
    }
  }
  function storySkip() {
    const lv = state.level;
    $("#story-text").innerHTML = lv.story.map((s) => `<p>${s}</p>`).join("");
    state.storyStep = lv.story.length;
    $("#btn-story-next").textContent = "開始挑戰 🚀";
    $("#btn-story-skip").classList.add("hidden");
  }

  /* ---------- 快問快答 ---------- */
  function startQuick() {
    state.mode = "quick";
    state.level = null;
    const all = [];
    LEVELS.forEach((lv) => lv.questions.forEach((q) => all.push(prepareQuestion(q, lv))));
    state.queue = shuffle(all).slice(0, QUICK_COUNT);
    state.idx = 0;
    state.correct = 0;
    setLevelColor("#ff7a59");
    startQuiz();
  }

  /* ---------- 測驗 ---------- */
  function startQuiz() {
    showScreen("screen-quiz");
    renderQuestion();
  }
  function renderQuestion() {
    stopTimer();
    state.answered = false;
    const q = state.queue[state.idx];
    const total = state.queue.length;

    // 標頭
    if (state.mode === "quick") {
      $("#quiz-level").innerHTML = `<span class="lv-badge" style="--lc:#ff7a59">⚡ 快問快答</span><span>${q.level.icon} ${q.level.title}</span>`;
      setLevelColor(q.level.color);
    } else {
      $("#quiz-level").innerHTML = `<span class="lv-badge">LEVEL ${String(q.level.id).padStart(2, "0")}</span><span>${q.level.icon} ${q.level.title}</span>`;
    }
    $("#quiz-progress-text").textContent = `${state.idx + 1} / ${total}`;
    $("#quiz-score").textContent = `⭐ ${state.correct}`;
    $("#quiz-progress-bar").style.width = `${(state.idx / total) * 100}%`;

    // 題目
    const card = $("#qcard");
    card.style.animation = "none"; void card.offsetWidth; card.style.animation = "";
    $("#qtype").textContent = q.type === "tf" ? "是非題" : "單選題";
    $("#qtext").textContent = q.q;
    const box = $("#options");
    box.className = "options" + (q.type === "tf" ? " tf" : "");
    box.innerHTML = "";
    const keys = ["A", "B", "C", "D"];
    q.options.forEach((text, i) => {
      const b = document.createElement("button");
      b.className = "opt";
      b.dataset.idx = i;
      b.innerHTML = `<span class="opt-key">${keys[i]}</span><span>${text}</span>`;
      b.addEventListener("click", () => answer(i));
      box.appendChild(b);
    });

    $("#explain").classList.add("hidden");
    $("#btn-next").textContent = state.idx + 1 === total ? "查看結果 🎉" : "下一題 ▸";

    // 計時（快問快答）
    const timerEl = $("#quiz-timer");
    if (state.mode === "quick") {
      timerEl.classList.remove("hidden");
      state.timeLeft = QUICK_SECONDS;
      tickTimer();
      state.timer = setInterval(tickTimer, 1000);
    } else {
      timerEl.classList.add("hidden");
    }
  }
  function tickTimer() {
    const el = $("#quiz-timer");
    el.textContent = `⏱ ${state.timeLeft}`;
    el.classList.toggle("warn", state.timeLeft <= 5);
    if (state.timeLeft <= 0) {
      stopTimer();
      answer(-1); // 逾時
      return;
    }
    state.timeLeft--;
  }
  function stopTimer() {
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
    $("#quiz-timer").classList.remove("warn");
  }
  function answer(choice) {
    if (state.answered) return;
    state.answered = true;
    stopTimer();
    const q = state.queue[state.idx];
    const ok = choice === q.answerIdx;
    if (ok) state.correct++;
    $("#quiz-score").textContent = `⭐ ${state.correct}`;

    document.querySelectorAll("#options .opt").forEach((b) => {
      const i = Number(b.dataset.idx);
      b.disabled = true;
      if (i === q.answerIdx) b.classList.add("correct");
      else if (i === choice) b.classList.add("wrong");
      else b.classList.add("dim");
    });

    const ex = $("#explain");
    ex.classList.remove("hidden", "ok", "bad");
    ex.classList.add(ok ? "ok" : "bad");
    const heads = ok
      ? ["🎉 答對了！", "👏 太厲害了！", "✅ 正確！詐團哭哭", "🛡️ 守住了！"]
      : choice === -1 ? ["⏰ 時間到！"] : ["❌ 答錯了", "😵 中計了！", "🚨 這題要記起來"];
    $("#explain-head").textContent = heads[Math.floor(Math.random() * heads.length)];
    $("#explain-body").textContent = q.explain;
    $("#btn-next").focus({ preventScroll: true });
    setTimeout(() => ex.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
  }
  function next() {
    if (!state.answered) return;
    state.idx++;
    if (state.idx >= state.queue.length) {
      $("#quiz-progress-bar").style.width = "100%";
      finishRound();
    } else {
      renderQuestion();
    }
  }

  /* ---------- 結算 ---------- */
  function finishRound() {
    const total = state.queue.length;
    if (state.mode === "quick") {
      renderFinal(state.correct, total, false);
      return;
    }
    const lv = state.level;
    const prev = state.progress.best[lv.id];
    if (!prev || state.correct > prev.correct) {
      state.progress.best[lv.id] = { correct: state.correct, total };
      saveProgress();
    }
    const stars = starsFor(state.correct, total);
    const starEls = document.querySelectorAll("#result-stars span");
    starEls.forEach((s) => s.classList.remove("lit"));
    $("#result-title").textContent = `${lv.icon} ${lv.title} 完成！`;
    $("#result-score").textContent = `答對 ${state.correct} / ${total} 題`;
    $("#result-msg").textContent =
      stars === 3 ? "完美！這一關的詐團已經被你一網打盡。" :
      stars === 2 ? "表現不錯，再看一次解析就能全對。" :
      stars === 1 ? "有基本概念，但還有破口，請回頭複習故事與解析。" :
      "這一關全軍覆沒……別灰心，再挑戰一次！";
    const nextLv = LEVELS.find((l) => l.id === lv.id + 1);
    $("#btn-result-next").textContent = nextLv ? `下一關：${nextLv.title} ▸` : "🎓 查看結業稱號";
    showScreen("screen-level-result");
    setTimeout(() => starEls.forEach((s, i) => { if (i < stars) s.classList.add("lit"); }), 150);
  }

  function renderFinal(correct, total, fromMap) {
    const ratio = total ? correct / total : 0;
    const rank = RANKS.find((r) => ratio >= r.min) || RANKS[RANKS.length - 1];
    $("#final-icon").textContent = rank.icon;
    $("#final-rank").textContent = rank.title;
    $("#final-score").textContent = `${state.mode === "quick" && !fromMap ? "快問快答" : "全部章節"}：答對 ${correct} / ${total} 題（${Math.round(ratio * 100)}%）`;
    $("#final-desc").textContent = rank.desc;
    const bd = $("#final-breakdown");
    bd.innerHTML = "";
    if (fromMap) {
      LEVELS.forEach((lv) => {
        const b = state.progress.best[lv.id];
        const d = document.createElement("div");
        d.className = "fb";
        d.innerHTML = `<span class="fb-icon">${lv.icon}</span><div>${lv.title}</div><div class="fb-score">${b ? `${b.correct}/${lv.questions.length}` : "–"}</div>`;
        bd.appendChild(d);
      });
    }
    state.finalText = `🛡️ 個資保衛戰｜${rank.icon} ${rank.title}｜答對 ${correct}/${total}（${Math.round(ratio * 100)}%）`;
    showScreen("screen-final");
    if (ratio >= 0.6) launchConfetti();
  }

  /* ---------- 彩帶 ---------- */
  function launchConfetti() {
    const canvas = $("#confetti");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ["#ffd166", "#ff7a59", "#7c5cff", "#4cc9f0", "#2ecc71", "#ff5c7a"];
    const parts = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      w: 6 + Math.random() * 8,
      h: 10 + Math.random() * 10,
      c: colors[Math.floor(Math.random() * colors.length)],
      vy: 2 + Math.random() * 3,
      vx: -1.5 + Math.random() * 3,
      r: Math.random() * Math.PI,
      vr: -0.1 + Math.random() * 0.2
    }));
    let frames = 0;
    cancelAnimationFrame(launchConfetti._raf);
    (function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frames++;
      if (frames < 260) launchConfetti._raf = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    })();
  }

  /* ---------- 事件 ---------- */
  $("#btn-home").addEventListener("click", () => { stopTimer(); renderHome(); });
  $("#btn-map").addEventListener("click", () => { stopTimer(); renderMap(); });
  $("#btn-story-mode").addEventListener("click", renderMap);
  $("#btn-quick-mode").addEventListener("click", startQuick);
  $("#btn-story-next").addEventListener("click", storyNext);
  $("#btn-story-skip").addEventListener("click", storySkip);
  $("#btn-next").addEventListener("click", next);
  $("#btn-result-map").addEventListener("click", renderMap);
  $("#btn-result-retry").addEventListener("click", () => startLevel(state.level));
  $("#btn-result-next").addEventListener("click", () => {
    const nextLv = LEVELS.find((l) => l.id === state.level.id + 1);
    if (nextLv) startLevel(nextLv);
    else {
      let c = 0, t = 0;
      LEVELS.forEach((lv) => { t += lv.questions.length; c += (state.progress.best[lv.id] || { correct: 0 }).correct; });
      renderFinal(c, t, true);
    }
  });
  $("#btn-final-home").addEventListener("click", renderHome);
  $("#btn-final-copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(state.finalText || "");
      toast("成績已複製，貼到群組炫耀吧！");
    } catch { toast("此環境無法存取剪貼簿"); }
  });
  $("#btn-big").addEventListener("click", (e) => {
    document.body.classList.toggle("big");
    e.currentTarget.classList.toggle("on", document.body.classList.contains("big"));
    try { localStorage.setItem(STORAGE_KEY + "-big", document.body.classList.contains("big") ? "1" : ""); } catch { /* ignore */ }
  });
  $("#btn-reset").addEventListener("click", () => {
    if (!confirm("確定要清除所有闖關紀錄嗎？")) return;
    state.progress = { best: {} };
    saveProgress();
    toast("紀錄已清除");
    renderMap();
  });

  // 鍵盤：1-4 / A-D 作答、O/X 是非、Enter 下一題
  document.addEventListener("keydown", (e) => {
    if (!$("#screen-quiz").classList.contains("active")) {
      if ($("#screen-story").classList.contains("active") && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); storyNext(); }
      return;
    }
    if (e.target && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
    const q = state.queue[state.idx];
    if (!state.answered) {
      let i = -1;
      if (/^[1-4]$/.test(e.key)) i = Number(e.key) - 1;
      else if (/^[a-dA-D]$/.test(e.key)) i = e.key.toUpperCase().charCodeAt(0) - 65;
      else if (q.type === "tf" && /^[oO]$/.test(e.key)) i = 0;
      else if (q.type === "tf" && /^[xX]$/.test(e.key)) i = 1;
      if (i >= 0 && i < q.options.length) answer(i);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      next();
    }
  });

  window.addEventListener("resize", () => {
    const c = $("#confetti");
    c.width = window.innerWidth; c.height = window.innerHeight;
  });

  /* ---------- 啟動 ---------- */
  try {
    if (localStorage.getItem(STORAGE_KEY + "-big")) { document.body.classList.add("big"); $("#btn-big").classList.add("on"); }
  } catch { /* ignore */ }
  renderHome();
})();
