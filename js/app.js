// =========================
// 判定（最重要）
// =========================
const isSinglePlayer = document.getElementById("main-player");


// =========================
// YouTube API（共通）
// =========================
function loadYouTubeAPI() {
  return new Promise((resolve) => {

    if (window.YT && window.YT.Player) {
      return resolve();
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };
  });
}


// =========================
// =========================
// 🎧 ① index（1プレイヤー）
// =========================
// =========================
if (isSinglePlayer) {

  let player = null;
  let currentGenre = null;

  // ランダム（重複防止）
  function getRandomVideoSingle(type) {
    const list = window.videos[type] || [];
    if (!list.length) return null;

    if (!window.playHistory) window.playHistory = {};
    if (!window.playHistory[type]) window.playHistory[type] = [];

    let history = window.playHistory[type];

    if (history.length >= list.length) {
      history = window.playHistory[type] = [];
    }

    const remaining = list.filter(v => !history.includes(v));
    const video = remaining[Math.floor(Math.random() * remaining.length)];

    history.push(video);
    return video;
  }

  async function playGenre(type) {
// 👇ここ追加
document.querySelectorAll(".genre-grid .btn").forEach(btn => {
  btn.classList.remove("active");
});

const targetBtn = document.querySelector(`[onclick="playGenre('${type}')"]`);
if (targetBtn) {
  targetBtn.classList.add("active");
}
    await loadYouTubeAPI();

    const videoId = getRandomVideoSingle(type);
    if (!videoId) return;

    currentGenre = type;

    const now = document.getElementById("nowPlaying");
    if (now) now.textContent = `▶ Now Playing: ${type}`;

    if (!player) {

      player = new YT.Player("main-player", {
        videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1
        },
        events: {
          onReady: (e) => e.target.playVideo(),
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.ENDED) {
              nextTrackSingle();
            }
          }
        }
      });

    } else {
      player.loadVideoById(videoId);
    }
  }

  function nextTrackSingle() {
    if (!currentGenre) return;

    const next = getRandomVideoSingle(currentGenre);
    if (next && player) {
      player.loadVideoById(next);
    }
  }

  // グローバル公開
  window.playGenre = playGenre;
  window.nextTrack = nextTrackSingle;

  // 初期サムネイル
  window.addEventListener("DOMContentLoaded", () => {

    const el = document.getElementById("main-player");
    if (!el) return;

    const firstGenre = Object.keys(window.videos)[0];
    const firstVideo = window.videos[firstGenre][0];

    el.style.backgroundImage =
      `url(https://img.youtube.com/vi/${firstVideo}/hqdefault.jpg)`;
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center";
    el.style.cursor = "pointer";

    el.addEventListener("click", () => playGenre(firstGenre));
  });
}


// =========================
// =========================
// 🎧 ② 他ページ（複数プレイヤー）
// =========================
// =========================
if (!isSinglePlayer) {

  window.Lofi = {
    store: {
      videos: window.videos || {}
    },
    state: {
      players: {},
      history: {}
    }
  };

  function getRandomVideoMulti(type) {
    const list = Lofi.store.videos[type] || [];
    if (!list.length) return null;

    if (!Lofi.state.history[type]) {
      Lofi.state.history[type] = [];
    }

    let history = Lofi.state.history[type];

    if (history.length >= list.length) {
      history = Lofi.state.history[type] = [];
    }

    const remaining = list.filter(v => !history.includes(v));
    const video = remaining[Math.floor(Math.random() * remaining.length)];

    history.push(video);
    return video;
  }

  async function startGenerator(type) {

    await loadYouTubeAPI();

    const videoId = getRandomVideoMulti(type);
    if (!videoId) return;

    const playerId = `player-${type}`;
    const el = document.getElementById(playerId);
    if (!el) return;

    el.style.backgroundImage = "none";

    if (!Lofi.state.players[type]) {

      Lofi.state.players[type] = new YT.Player(playerId, {
        videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1
        },
        events: {
          onReady: (e) => e.target.playVideo(),
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.ENDED) {
              const next = getRandomVideoMulti(type);
              if (next) {
                Lofi.state.players[type].loadVideoById(next);
              }
            }
          }
        }
      });

    } else {
      Lofi.state.players[type].loadVideoById(videoId);
    }
  }

  function nextTrack(type) {

    const player = Lofi.state.players[type];

    if (!player) {
      startGenerator(type);
      return;
    }

    const next = getRandomVideoMulti(type);
    if (next) player.loadVideoById(next);
  }

  window.startGenerator = startGenerator;
  window.nextTrack = nextTrack;

  // 初期サムネイル
  window.addEventListener("DOMContentLoaded", () => {

    const videos = window.videos || {};

    Object.keys(videos).forEach(type => {

      const el = document.getElementById(`player-${type}`);
      const list = videos[type];

      if (!el || !list || !list.length) return;

      const thumbnail =
        `https://img.youtube.com/vi/${list[0]}/hqdefault.jpg`;

      el.style.backgroundImage = `url(${thumbnail})`;
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";
      el.style.cursor = "pointer";

      el.addEventListener("click", () => {
        startGenerator(type);
      });
    });
  });
}


// =========================
// 🍔 ハンバーガー（共通）
// =========================
document.addEventListener("DOMContentLoaded", () => {

  const hamburger = document.querySelector(".hamburger");
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("overlay");

  if (!hamburger || !menu || !overlay) return;

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();

    const isOpen = hamburger.classList.toggle("active");

    menu.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("menu-open");

    hamburger.setAttribute("aria-expanded", isOpen);
    hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
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
