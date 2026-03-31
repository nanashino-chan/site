const focusVideos = [
"O_DlB-RyU-4",
"Il2V_fgVh0o",
"XPv78upJZhQ",
"iRSTgLr4WVE",
"xRsKQTR_gys",
"JVw2HcG7eYA",
"exObclq2hmc",
"6VMIYwleTt8",
"WZc2WrQDah4",
"gz7g8KsL1-U",
"ThtVg-d_t7A",
"gQ8xMq2sVFU",
"ToDtY3yBLT4",
"Cg1Sfhm6X00",
"ZkADCyVg-0Y",
"Epq7vJtCYFo",
"2TorZk-fHn4",
"gYbalix2UdE",
"LMgKuk73eB0",
"K2mYoY1hOg8",
"92NTO5odzAI",
"m0oqLWYwsoo",
"7tKXmvLxVo4",
"qcsZUe_90Kg"
];

const sleepVideos = [
"_5pVC_EikhU",
"I1Z_YHeA-Pc",
"9TdxiCHk2pE",
"ZKToG7LgRng",
"VejgU2bcANk",
"k9ASW7BpFBU",
"2OM843s6zzI",
"tZiYlmaP9tM",
"UoAqGRCQ228",
"OfxWXhRzQhg",
"qjj-puLxAYE",
"GsZKXQwAIsI",
"eHavhbzCNx4",
"J0o8vNHGpX8",
"l63sRbNvWug",
"nMPe3Duu8ZE",
"UTV1uH5lZE8",
"so5sup5qf_Q",
"N87eDWN4pXU",
"L83nUlxwoGQ",
"1iIsvDtlAew",
"3FajVMiuS_4",
"V93swbtmJGA",
"B_SNM3bi4p8"
];

const tokyoVideos = [
"rjK5Ql3BaaQ",
"HUiHKaXY1pg",
"xmU7_SAzh8s",
"kcqpYe2ZY80",
"jMXYAg1AtKI",
"cG5m3tGTgvQ",
"cIolr-NRUMc",
"tabA-UHlFhA",
"vGzkMVfSUxU",
"bKMa79xcO2M",
"aa0OiDRkdZQ",
"jANrXnsQFMg",
"f5Z5sYhCqC4",
"XhBMZzUacao",
"_-w74TcD6ko",
"kV4GjsooLoU",
"jJOofeSVC_k",
"QjoJbU04ATs",
"2c39TplP3G0",
"oj2rsPk8oTs"
];


// ===== ランダム動画取得（同じ動画が連続しない版） =====
function randomVideo(list, lastVideo = null) {

  let newVideo;

  do {
    newVideo = list[Math.floor(Math.random() * list.length)];
  } while (newVideo === lastVideo);

  return newVideo;
}
