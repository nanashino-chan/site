// =========================
// Lofi Core（安定版）
// =========================
window.Lofi = {
  store: {
    videos: window.videos || {}
  },
  state: {
    players: {},
    history: {},
    ytReady: false,
    ytLoading: false
  }
};

// =========================
// YouTube API（多重防止）
// =========================
function loadYouTubeAPI() {
  return new Promise((resolve) => {

    if (window.YT && window.YT.Player) {
      Lofi.state.ytReady = true;
      return resolve();
    }

    if (Lofi.state.ytLoading) {
      const wait = setInterval(() => {
        if (Lofi.state.ytReady) {
          clearInterval(wait);
          resolve();
        }
      }, 100);
      return;
    }

    Lofi.state.ytLoading = true;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      Lofi.state.ytReady = true;
      resolve();
    };
  });
}

// =========================
// ランダム（重複防止）
// =========================
function getRandomVideo(type) {
  const list = Lofi.store.videos[type] || [];
  if (!list.length) return null;

  const state = Lofi.state;

  if (!state.history[type]) {
    state.history[type] = [];
  }

  let history = state.history[type];

  if (history.length >= list.length) {
    history = state.history[type] = [];
  }

  let video;
  let guard = 0;

  while (guard < 20) {
    video = list[Math.floor(Math.random() * list.length)];
    if (!history.includes(video)) break;
    guard++;
  }

  history.push(video);
  return video;
}

// =========================
// メイン
// =========================
async function startGenerator(type) {

  if (!Lofi.store.videos[type]) {
    console.error("Invalid type:", type);
    return;
  }

  await loadYouTubeAPI();

  const videoId = getRandomVideo(type);
  if (!videoId) return;

  const players = Lofi.state.players;
  const playerId = `player-${type}`;

  const el = document.getElementById(playerId);
  if (!el) {
    console.error("Missing element:", playerId);
    return;
  }

  el.style.backgroundImage = "none";

  if (!players[type]) {

    players[type] = new YT.Player(playerId, {
      videoId,
      playerVars: {
        autoplay: 1,
        rel: 0,
        modestbranding: 1
      },
      events: {
        onReady: (e) => e.target.playVideo(),
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.ENDED) {
            const next = getRandomVideo(type);
            if (next) players[type].loadVideoById(next);
          }
        }
      }
    });

  } else {
    players[type].loadVideoById(videoId);
  }
}

// =========================
// 次の曲
// =========================
function nextTrack(type) {
  const player = Lofi.state.players[type];

  if (!player) {
    startGenerator(type);
    return;
  }

  const next = getRandomVideo(type);
  if (next) player.loadVideoById(next);
}

// =========================
// グローバル公開
// =========================
window.startGenerator = startGenerator;
window.nextTrack = nextTrack;

// =========================
// 初期表示＋クリック再生
// =========================
window.addEventListener("DOMContentLoaded", () => {

  const videos = window.videos || {};

  Object.keys(videos).forEach(type => {

    const el = document.getElementById(`player-${type}`);
    const list = videos[type];

    if (!el || !list || !list.length) return;

    const thumbnail = `https://img.youtube.com/vi/${list[0]}/hqdefault.jpg`;

    el.style.backgroundImage = `url(${thumbnail})`;
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center";
    el.style.cursor = "pointer";

    el.addEventListener("click", () => {
      startGenerator(type);
    });

  });

});

// =========================
// ハンバーガーメニュー制御
// =========================
document.addEventListener("DOMContentLoaded", () => {

  const hamburger = document.querySelector(".hamburger");
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("overlay");

  if (!hamburger || !menu || !overlay) {
    console.error("Hamburger menu elements not found");
    return;
  }

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    hamburger.classList.toggle("active");
    menu.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  overlay.addEventListener("click", () => {
    hamburger.classList.remove("active");
    menu.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("menu-open");
  });

  menu.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hamburger.classList.remove("active");
      menu.classList.remove("active");
      overlay.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  });

});
  hamburger.addEventListener("click", (e) => {
  e.stopPropagation();

  const isOpen = hamburger.classList.toggle("active");

  menu.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("menu-open");

   // ✅ ここ追加
  hamburger.setAttribute("aria-expanded", isOpen);
  hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});
　fetch("partials/header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header-container").innerHTML = data;
  });
