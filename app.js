window.Lofi = window.Lofi || {};
Lofi.state = { players: {} };

// 初期化
function init(type) {
  console.log("init:", type);

  if (!window.videos) {
    console.error("videos.js not loaded");
    return;
  }

  startGenerator(type);
}

// ジェネレーター開始
function startGenerator(type) {
  const list = window.videos?.[type];

  if (!list) {
    console.error("no video data:", type);
    return;
  }

  console.log("generator started:", type);
}

// グローバル公開（重要）
window.startGenerator = startGenerator;
window.init = init;
