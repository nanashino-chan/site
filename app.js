// =========================
// グローバル初期化（最重要）
// =========================
window.Lofi = window.Lofi || {
  store: {
    videos: window.videos || {}
  },
  state: {
    players: {},
    history: {}
  }
};

// =========================
// ランダム取得（重複防止）
// =========================
function getList(type) {
  return Lofi.store.videos[type] || [];
}

function getRandomVideo(type) {
  const list = getList(type);
  if (!list.length) return null;

  const state = Lofi.state;

  if (!state.history[type]) {
    state.history[type] = [];
  }

  const history = state.history[type];

  if (history.length >= list.length) {
    state.history[type] = [];
  }

  let video = null;
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
// YouTube Player
// =========================
function ensurePlayer(type, videoId) {
  const playerId = `player-${type}`;

  if (!window.YT || !window.YT.Player) {
    console.warn("YT API not ready");
    window._pendingType = type;
    return null;
  }

  if (!Lofi.state.players[type]) {
    Lofi.state.players[type] = new YT.Player(playerId, {
      videoId,
      playerVars: {
        autoplay: 1,
        controls: 1,
        rel: 0
      }
    });
  } else {
    Lofi.state.players[type].loadVideoById(videoId);
  }

  return Lofi.state.players[type];
}

// =========================
// Generator
// =========================
function startGenerator(type) {
  const videoId = getRandomVideo(type);
  if (!videoId) return;

  ensurePlayer(type, videoId);
}

function nextTrack(type) {
  const videoId = getRandomVideo(type);
  if (!videoId) return;

  const player = Lofi.state.players[type];

  if (!player) {
    startGenerator(type);
    return;
  }

  player.loadVideoById(videoId);
}

// =========================
// YT API Ready
// =========================
function onYouTubeIframeAPIReady() {
  window.YTReady = true;

  if (window._pendingType) {
    startGenerator(window._pendingType);
  }
}

// =========================
// 初期表示（サムネ）
// =========================
window.addEventListener("load", () => {
  const types = Object.keys(Lofi.store.videos);

  types.forEach(type => {
    const el = document.getElementById(`player-${type}`);
    const list = getList(type);

    if (!el || !list.length) return;

    el.style.backgroundImage =
      `url(https://img.youtube.com/vi/${list[0]}/hqdefault.jpg)`;
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center";
  });
});

// =========================
// グローバル公開（必須）
// =========================
window.startGenerator = startGenerator;
window.nextTrack = nextTrack;
