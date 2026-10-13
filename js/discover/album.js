(()=>{
'use strict';
const album=JSON.parse(document.getElementById('albumData').textContent), ja=document.documentElement.lang==='ja', $=id=>document.getElementById(id);
const appleOnly=!album.tracks.some(t=>t.youtubeId);
const words=ja?{
 ready:'曲を選ぶまでジャケットを表示します。試聴にはYouTubeを使用します。',choose:'試聴する曲を選んでください',loading:'YouTubeプレイヤーを読み込んでいます…',loaded:'プレイヤーを読み込みました。再生しない場合は、プレイヤー内の再生ボタンを押してください。',playing:'再生中',paused:'一時停止中',buffering:'音声を読み込んでいます…',ended:'再生が終了しました。別の曲もお楽しみください。',failed:'このページで試聴を読み込めませんでした。YouTubeで聴くボタンをご利用いただくか、曲を選び直してください。',copied:'コピーしました：',again:'1曲目を試聴する'
}:{ready:'The jacket stays here until you choose a track. Playback uses YouTube.',choose:'Choose a track to listen',loading:'Loading the YouTube player…',loaded:'Player ready. If playback does not start, press Play in the player.',playing:'Playing',paused:'Paused',buffering:'Buffering audio…',ended:'Track finished. Explore another track below.',failed:'The preview could not load here. Open the track on YouTube, or choose a track to retry.',copied:'Copied: ',again:'Listen to the first track'};
if(appleOnly){words.ready=ja?'曲を選ぶとApple Musicのアルバムプレイヤーを表示します。プレイヤー内で曲を選んでください。':'Choose a track to open the Apple Music album player, then select the track inside it.';words.loading=ja?'Apple Musicのアルバムプレイヤーを読み込んでいます…':'Loading the Apple Music album player…';words.failed=ja?'試聴を読み込めませんでした。Apple Musicでアルバムを開いてください。':'The preview could not load. Open the album in Apple Music.';}
let player=null, generation=0, loadingTimer, toastTimer, apiPromise;
function loadApi(){
 if(window.YT?.Player)return Promise.resolve();
 if(apiPromise)return apiPromise;
 apiPromise=new Promise((resolve,reject)=>{
  let settled=false;
  const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';
  const timer=setTimeout(fail,15000);
  function fail(){if(settled)return;settled=true;clearTimeout(timer);script.remove();apiPromise=null;reject(Error('YouTube API unavailable'));}
  window.onYouTubeIframeAPIReady=()=>{if(settled)return;settled=true;clearTimeout(timer);resolve();};
  script.onerror=fail;document.head.append(script);
 });return apiPromise;
}
function clearPlayer(){generation++;clearTimeout(loadingTimer);if(player){try{player.destroy();}catch{}player=null;}$('frame').replaceChildren();}
function reset(){clearPlayer();$('poster').hidden=false;$('posterMessage').textContent=words.ready;$('posterPlay').hidden=false;$('currentTitle').textContent=words.choose;$('playerStatus').textContent=words.ready;$('stop').disabled=true;$('externalTrack').href=album.tracks[0].youtubeId?'https://www.youtube.com/watch?v='+album.tracks[0].youtubeId:album.appleMusicUrl;document.querySelectorAll('.listener-track.selected').forEach(e=>e.classList.remove('selected'));document.querySelectorAll('[data-listen]').forEach(e=>e.removeAttribute('aria-pressed'));}
function failed(){clearTimeout(loadingTimer);$('poster').hidden=false;$('posterMessage').textContent=words.failed;$('posterPlay').hidden=true;$('playerStatus').textContent=words.failed;}
async function listen(number){
 const track=album.tracks.find(t=>t.number===Number(number));if(!track)return;
 clearPlayer();const token=generation;
 $('currentTitle').textContent=String(track.number).padStart(2,'0')+' · '+track.title;
 $('externalTrack').href=track.youtubeId?'https://www.youtube.com/watch?v='+track.youtubeId:album.appleMusicUrl;
 $('stop').disabled=false;$('poster').hidden=false;$('posterPlay').hidden=true;
 $('posterMessage').textContent=words.loading;$('playerStatus').textContent=words.loading;
 document.querySelectorAll('.listener-track').forEach(e=>e.classList.toggle('selected',e.id==='track-'+track.number));
 document.querySelectorAll('[data-listen]').forEach(e=>e.setAttribute('aria-pressed',String(Number(e.dataset.listen)===track.number)));
 $('preview').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
 loadingTimer=setTimeout(()=>{if(token===generation)failed();},18000);
 if(!track.youtubeId){
  const iframe=document.createElement('iframe');iframe.src=album.appleMusicUrl.replace('https://music.apple.com/','https://embed.music.apple.com/');iframe.title=album.title+' — Apple Music';iframe.allow='autoplay; encrypted-media';iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.onload=()=>{if(token!==generation)return;clearTimeout(loadingTimer);$('poster').hidden=true;$('playerStatus').textContent=ja?'アルバムプレイヤー内で「'+track.title+'」を選んでください。試聴範囲はサービス側の設定によります。':'Select “'+track.title+'” inside the album player. Preview availability is controlled by the service.';};$('frame').replaceChildren(iframe);$('frame').parentElement.classList.add('apple-preview');return;
 }
 $('frame').parentElement.classList.remove('apple-preview');
 try{
  await loadApi();if(token!==generation)return;
  const host=document.createElement('div');host.id='youtubeHost';$('frame').replaceChildren(host);
  player=new YT.Player(host,{videoId:track.youtubeId,width:'100%',height:'100%',playerVars:{playsinline:1,autoplay:1,rel:0},events:{
   onReady:event=>{if(token!==generation)return;clearTimeout(loadingTimer);$('poster').hidden=true;$('playerStatus').textContent=words.loaded;const iframe=event.target.getIframe();iframe.title=track.title+' — YouTube';iframe.referrerPolicy='strict-origin-when-cross-origin';event.target.playVideo();},
   onStateChange:event=>{if(token!==generation)return;const text={0:words.ended,1:words.playing,2:words.paused,3:words.buffering};if(text[event.data])$('playerStatus').textContent=text[event.data];},
   onError:()=>{if(token===generation)failed();}
  }});
 }catch{if(token===generation)failed();}
}
async function copy(number){const track=album.tracks.find(t=>t.number===Number(number));if(!track)return;const text=album.artist+' '+track.title;
 try{if(!navigator.clipboard||!window.isSecureContext)throw Error('manual');await navigator.clipboard.writeText(text);$('toast').textContent=words.copied+text;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3000);}
 catch{$('copyText').value=text;$('copyDialog').showModal();$('copyText').focus();$('copyText').select();}
}
document.addEventListener('click',event=>{const play=event.target.closest('[data-listen]'),button=event.target.closest('[data-copy]');if(play)listen(play.dataset.listen);if(button)copy(button.dataset.copy);});
$('stop').addEventListener('click',reset);$('closeCopy').addEventListener('click',()=>$('copyDialog').close());
window.addEventListener('pagehide',reset);
window.addEventListener('pageshow',event=>{if(event.persisted)reset();});
reset();
const requested=new URLSearchParams(location.search).get('track');
if(requested){const track=album.tracks.find(t=>t.isrc===requested||String(t.number)===requested);if(track){$('track-'+track.number).scrollIntoView({block:'center'});$('track-'+track.number).classList.add('selected');$('playerStatus').textContent=ja?'共有された曲：'+track.title+'。試聴ボタンを押して再生してください。':'Shared track: '+track.title+'. Press Listen to play.';}}
})();
