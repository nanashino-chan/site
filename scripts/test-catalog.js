const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');const {loadAlbums,appleMusicUrl}=require('./build-catalog');const root=path.resolve(__dirname,'..');const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function dom(missing=[]){const els={},blobs=[];const el=id=>els[id]??=( {textContent:'',innerHTML:'',style:{},dataset:{},value:['genreFilter','useFilter'].includes(id)?'all':id==='sortOrder'?'featured':'',listeners:{},classList:{add(){},remove(){}},addEventListener(n,f){this.listeners[n]=f},setAttribute(n,v){this[n]=v},removeAttribute(n){delete this[n]},scrollIntoView(){},appendChild(){},remove(){},click(){},select(){}});const c={window:{},console,URLSearchParams,Blob,URL:{createObjectURL(b){blobs.push(b);return 'blob:test'},revokeObjectURL(){}},setTimeout(){},clearTimeout(){},navigator:{clipboard:{async writeText(s){c.copied=s}}},document:{getElementById:id=>missing.includes(id)?null:el(id),querySelector:el,querySelectorAll(){return []},createElement:el,body:el('body')}};vm.createContext(c);return {c,el,blobs};}
(async()=>{const albums=loadAlbums();const expected=albums.reduce((n,a)=>n+a.trackCount,0);
for(const a of albums){const html=read('catalog/'+a.pageSlug+'.html');assert(!/@@[A-Z_]+@@/.test(html));const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];const ld=JSON.parse(scripts[0][1]);assert.equal(ld.numTracks,a.trackCount);assert.equal(ld.name,a.title);ld.track.forEach((t,i)=>{assert.equal(t.name,a.tracks[i].title);assert.equal(t.isrcCode,a.tracks[i].isrc);assert.equal(t.url,a.tracks[i].youtubeId?'https://www.youtube.com/watch?v='+a.tracks[i].youtubeId:'https://nanashino-chan.github.io/site/catalog/'+a.pageSlug+'.html#track-'+a.tracks[i].number);});const {c,el,blobs}=dom(a.tracks[0].youtubeId?[]:["catalogPlayer","playerTrackCount","playerTrackTitle","playerIsrc","youtubeLink","playerLicenseLink","previousTrack","nextTrack","randomTrack"]);vm.runInContext(read('js/catalog/b2b-core.js'),c);vm.runInContext(read('js/catalog/albums/'+a.slug+'.js'),c);assert.equal(c.window.NanashinoB2B.validate().length,0);vm.runInContext(scripts.at(-1)[1],c);assert.equal(el('resultCount').textContent,`${a.trackCount} of ${a.trackCount} tracks`);
if(a.tracks[0].youtubeId)for(let i=0;i<a.tracks.length;i++){vm.runInContext(`setPlayer(${i},false)`,c);assert(el('catalogPlayer').src.includes('/'+a.tracks[i].youtubeId+'?'));assert.equal(el('playerTrackTitle').textContent,a.tracks[i].title);}
if(!a.tracks[0].youtubeId){
 assert(html.includes('src="'+a.appleMusicUrl.replace('https://music.apple.com/','https://embed.music.apple.com/')+'"'));
 assert(!html.includes('id="catalogPlayer"'));
 assert(!el('trackRows').innerHTML.includes('data-preview-index='));
 assert(el('trackRows').innerHTML.includes('Album on Apple Music'));
 assert.equal(c.window.NanashinoB2B.getAlbumVideoIds(a.slug).length,0);
 assert.equal(c.window.NanashinoB2B.getVideoId(a.tracks[0].isrc),null);
 vm.runInContext('setPlayer(0,false)',c);
 assert(!el('catalogPlayer').src);
}
const first=a.tracks[0];el('trackSearch').listeners.input({target:{value:first.isrc}});assert.equal(el('resultCount').textContent,`1 of ${a.trackCount} tracks`);await el('trackRows').listeners.click({target:{closest(selector){return selector==='[data-copy]'?{dataset:{copy:first.isrc}}:null}}});assert.equal(c.copied,first.isrc);
el('downloadCsv').listeners.click();const csv=await blobs[0].text();assert.equal(csv.split('\n').length,a.trackCount+1);for(const t of a.tracks)assert(csv.includes('"'+t.title.replaceAll('"','""')+'"'));}
const bundle={window:{},console};vm.runInNewContext(read('js/b2bvideos.js'),bundle);assert.equal(bundle.window.NanashinoB2B.validate().length,0);assert.equal(Object.keys(bundle.window.NanashinoB2B.albums).length,albums.length);
const index=read('catalog/index.html'),{c,el}=dom();const scripts=[...index.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];assert.equal(JSON.parse(scripts[0][1]).mainEntity.numberOfItems,albums.length);vm.runInContext(scripts.at(-1)[1],c);assert.equal(Number(el('albumTotal').textContent),albums.length);assert.equal(Number(String(el('trackTotal').textContent).replace(/,/g,'')),expected);el('catalogSearch').value=albums.at(-1).distributionUpc;el('catalogSearch').listeners.input();assert.equal(el('resultCount').textContent,`Showing 1 of ${albums.length} albums`);
if(process.argv.includes('--sitemap')){const xml=read('sitemap.xml');for(const a of albums)assert(xml.includes('/catalog/'+a.pageSlug+'.html</loc>'));assert(xml.includes('/catalog/</loc>'));assert(!xml.includes('/_catalog/'));}
assert(appleMusicUrl('https://music.apple.com/us/album/example/12345'));
for(const u of ['javascript:alert(1)','https://music.apple.com.evil.test/us/album/example/12345','https://user@music.apple.com/us/album/example/12345','https://music.apple.com/us/artist/example/12345','https://music.apple.com/us/album/example/12345?x=1'])assert(!appleMusicUrl(u));
const apple=albums.find(a=>!a.tracks[0].youtubeId);
if(apple){
 const name=apple.slug+'.json',original=read('_catalog/albums/'+name);
 for(const mutate of [a=>delete a.appleMusicUrl,a=>a.appleMusicUrl='https://evil.test/album/123',a=>a.tracks[0].youtubeId='broken',a=>a.tracks[0].youtubeId='Abcdef12345',a=>a.tracks[1].isrc=a.tracks[0].isrc]){
  const candidate=JSON.parse(original);mutate(candidate);assert.throws(()=>loadAlbums({[name]:JSON.stringify(candidate)}));
 }

}
const ytCount=albums.reduce((n,a)=>n+a.tracks.filter(t=>t.youtubeId).length,0);
console.log(`PASS: ${albums.length} pages, ${expected} tracks (${ytCount} YouTube mappings, ${expected-ytCount} Apple Music album-preview tracks), search, copy, CSV, JSON-LD, index totals/filter, legacy bundle${process.argv.includes('--sitemap')?', sitemap':''}.`);
})().catch(e=>{console.error(e);process.exit(1)});

