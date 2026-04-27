// =========================
// Lofi Core（簡略化）
// =========================
window.Lofi = {
  store: {
    videos: window.videos || {}
  }
};

// 🎧 単一プレイヤー用
let player = null;
let currentGenre = null;

// =========================
// YouTube API（そのまま）
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
// ランダム（簡略化）
// =========================
function getRandomVideo(type) {
  const list = Lofi.store.videos[type] || [];
  if (!list.length) return null;

  return list[Math.floor(Math.random() * list.length)];
}

// =========================
// メイン（完全リライト）
// =========================
async function playGenre(type) {

  if (!Lofi.store.videos[type]) {
    console.error("Invalid type:", type);
    return;
  }

  await loadYouTubeAPI();

  const videoId = getRandomVideo(type);
  if (!videoId) return;

  currentGenre = type;

  const el = document.getElementById("main-player");
  if (!el) {
    console.error("Missing element: main-player");
    return;
  }

  el.style.backgroundImage = "none";

  const now = document.getElementById("nowPlaying");
  if (now) {
    now.textContent = `▶ Now Playing: ${type}`;
  }

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
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.ENDED) {
            nextTrack();
          }
        }
      }
    });

  } else {
    player.loadVideoById(videoId);
  }
}

// =========================
// 次の曲（完全リライト）
// =========================
function nextTrack() {

  if (!player || !currentGenre) return;

  const next = getRandomVideo(currentGenre);
  if (next) {
    player.loadVideoById(next);
  }
}

// =========================
// グローバル公開（変更）
// =========================
window.playGenre = playGenre;
window.nextTrack = nextTrack;

// 初期サムネイル表示
window.addEventListener("DOMContentLoaded", () => {

  const el = document.getElementById("main-player");
  if (!el) return;

  const videos = window.videos || {};
  const firstGenre = Object.keys(videos)[0];
  if (!firstGenre) return;

  const firstVideo = videos[firstGenre][0];
  if (!firstVideo) return;

  const thumbnail = `https://img.youtube.com/vi/${firstVideo}/hqdefault.jpg`;

  el.style.backgroundImage = `url(${thumbnail})`;
  el.style.backgroundSize = "cover";
  el.style.backgroundPosition = "center";
  el.style.cursor = "pointer";

  el.addEventListener("click", () => {
    playGenre(firstGenre);
  });

});
// =========================
// ハンバーガーメニュー（整理済み）
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
