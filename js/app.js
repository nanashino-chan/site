// =========================
// Lofi Core
// =========================
window.Lofi = {
  store: {
    videos: window.videos || {}
  }
};

let player = null;
let currentGenre = null;

// =========================
// YouTube API
// =========================
function loadYouTubeAPI() {
  return new Promise((resolve) => {

    if (window.YT && window.YT.Player) {
      return resolve();
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = resolve;
  });
}

// =========================
// ランダム
// =========================
function getRandomVideo(type) {
  const list = Lofi.store.videos[type] || [];
  if (!list.length) return null;

  return list[Math.floor(Math.random() * list.length)];
}

// =========================
// 再生
// =========================
async function playGenre(type) {

  currentGenre = type;

  await loadYouTubeAPI();

  const videoId = getRandomVideo(type);
  if (!videoId) return;

  const el = document.getElementById("main-player");
  if (!el) return;

  el.style.backgroundImage = "none";

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

  const now = document.getElementById("nowPlaying");
  if (now) {
    now.textContent = `▶ ${type.toUpperCase()} Lo-Fi Playing`;
  }
}

// =========================
// 次の曲
// =========================
function nextTrack() {
  if (!player || !currentGenre) return;

  const next = getRandomVideo(currentGenre);
  if (next) player.loadVideoById(next);
}

// =========================
// 公開
// =========================
window.playGenre = playGenre;
window.nextTrack = nextTrack;

// =========================
// 初期サムネ（これだけ残す）
// =========================
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
// ハンバーガー（そのまま）
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

});
