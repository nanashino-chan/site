const fs=require('fs'), vm=require('vm'), assert=require('assert');
const path=require('path');const base=path.resolve(__dirname,'..')+'/';const catalog=JSON.parse(fs.readFileSync(base+'js/catalog/discover-data.json','utf8'));

async function run(lang,apple=false){
 const album=catalog.find(a=>apple?!a.tracks[0].youtubeId:a.slug==='chillhop-lofi-relax-focus-instrumental');
 const elements=new Map(), handlers={}, windowHandlers={}, timers=new Map();let nextTimer=0,clipboard='',destroyed=0;
 function el(id){if(elements.has(id))return elements.get(id);const classes=new Set();const e={id,dataset:{},hidden:false,disabled:false,textContent:'',children:[],attributes:{},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),toggle:(x,b)=>b?classes.add(x):classes.delete(x),contains:x=>classes.has(x)},setAttribute(k,v){this.attributes[k]=v;},removeAttribute(k){delete this.attributes[k];},replaceChildren(...v){this.children=v;},addEventListener(k,f){this[k]=f;},scrollIntoView(){},focus(){},select(){},showModal(){this.open=true;},close(){this.open=false;}};elements.set(id,e);return e;}
 const rows=Array.from({length:album.tracks.length},(_,i)=>el('track-'+(i+1))),buttons=rows.map((_,i)=>{const e=el('play'+i);e.dataset.listen=''+(i+1);return e;});
 let active;
 const context={console,URLSearchParams,location:{search:''},document:{documentElement:{lang},getElementById:el,querySelectorAll:s=>s==='[data-listen]'?buttons:s==='.listener-track.selected'?rows.filter(e=>e.classList.contains('selected')):rows,addEventListener:(k,f)=>handlers[k]=f,createElement:tag=>el(tag+'-'+Math.random()),head:{append(){}}},navigator:{clipboard:{writeText:async t=>{clipboard=t;}}},matchMedia:()=>({matches:true}),setTimeout:f=>{timers.set(++nextTimer,f);return nextTimer;},clearTimeout:id=>timers.delete(id),isSecureContext:true,addEventListener:(k,f)=>windowHandlers[k]=f,YT:{Player:function(host,config){active={config,destroy(){destroyed++;},getIframe:()=>el('iframe'),playVideo(){this.played=true;}};return active;}}};context.window=context;vm.createContext(context);
 el('albumData').textContent=JSON.stringify(album);el('frame').parentElement=el('stage');vm.runInContext(fs.readFileSync(base+'js/discover/album.js','utf8'),context);
 const click=(kind,n)=>handlers.click({target:{closest:s=>s==='['+kind+']'?{dataset:{[kind==='data-listen'?'listen':'copy']:String(n)}}:null}});
 assert.equal(el('poster').hidden,false);assert.equal(el('stop').disabled,true);assert.equal(el('frame').children.length,0);
 if(apple){
 click('data-listen',2);await Promise.resolve();const iframe=el('frame').children[0];assert.equal(iframe.src,album.appleMusicUrl.replace('https://music.apple.com/','https://embed.music.apple.com/'));assert.equal(el('poster').hidden,false);iframe.onload();assert.equal(el('poster').hidden,true);assert.ok(el('playerStatus').textContent.includes(album.tracks[1].title));windowHandlers.pagehide();assert.equal(el('frame').children.length,0);assert.equal(el('poster').hidden,false);console.log('PASS '+lang+': Apple album embed, track-selection instruction, pagehide reset (mock DOM)');return;}
 click('data-listen',26);await Promise.resolve();await Promise.resolve();
 assert.equal(active.config.videoId,'sb4vo2QPWrg');assert.equal(el('poster').hidden,false);assert.match(el('currentTitle').textContent,/Closing Serenade/);
 active.config.events.onReady({target:active});assert.equal(el('poster').hidden,true);assert.equal(active.played,true);
 active.config.events.onError();assert.equal(el('poster').hidden,false);assert.ok(el('playerStatus').textContent);
 click('data-copy',9);await Promise.resolve();assert.equal(clipboard,'Nanashino-chan Jazz & Beats');
 context.navigator.clipboard=null;click('data-copy',2);await Promise.resolve();assert.equal(el('copyDialog').open,true);assert.equal(el('copyText').value,'Nanashino-chan City Lights Reflections');
 windowHandlers.pagehide();assert.equal(el('frame').children.length,0);assert.equal(el('poster').hidden,false);assert.equal(rows.some(e=>e.classList.contains('selected')),false);assert.ok(destroyed);
 click('data-listen',1);windowHandlers.pagehide();await Promise.resolve();await Promise.resolve();assert.equal(el('frame').children.length,0);
 windowHandlers.pageshow({persisted:true});assert.equal(el('stop').disabled,true);
 console.log('PASS '+lang+': initial poster, correct video selection, ready/error states, clipboard/manual fallback, pagehide/BFCache reset, pending-load cancellation (mock DOM / mock YouTube)');
}
run('en').then(()=>run('ja')).then(()=>run('en',true)).then(()=>run('ja',true)).catch(e=>{console.error(e);process.exitCode=1;});
