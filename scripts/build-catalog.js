/* Catalog source of truth: _catalog/albums/*.json. No third-party dependencies. */
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'..'),BASE='https://nanashino-chan.github.io/site';
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const html=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=o=>JSON.stringify(o,null,2).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
function fail(s){throw Error(s)}
function date(v){return typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;}
function local(p){const r=path.resolve(ROOT,p);if(!r.startsWith(ROOT+path.sep))fail('Path outside repository: '+p);return r;}
function sourceTracks(a){
 if(a.tracks&&a.sourceFiles)fail(a.slug+': choose tracks OR sourceFiles');
 if(!a.sourceFiles)return;
 const raw=fs.readFileSync(local(a.sourceFiles.release),'utf8').replace(/\r/g,'');
 const matches=[...raw.matchAll(/^([0-9]+)\s*\n([^\n]+)\n[\s\S]*?^ISRC\s*\n([A-Z0-9]+)\s*$/gm)];
 const videoText=fs.readFileSync(local(a.sourceFiles.youtube),'utf8');
 const ids=videoText.split(/\r?\n/).map(x=>x.trim()).filter(x=>x&&!x.startsWith('//')).map(x=>x.replace(/^["']|["'],?$/g,''));
 if(matches.length!==ids.length||!matches.length)fail(a.slug+': source track count / video count mismatch');
 const normalized=raw.normalize('NFKC');
 for(const [label,key]of [['アップロード日','uploadDate'],['リリース日','releaseDate']]){const m=normalized.match(new RegExp(label+'[：:]\\s*(\\d{4})年\\s*(\\d{1,2})月\\s*(\\d{1,2})日'));if(!m)fail(a.slug+': missing '+label);const d=`${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`;if(d!==a[key])fail(a.slug+': '+key+' differs from source');}
 const upc=normalized.match(/UPC[：:]\s*(\d+)/);if(!upc||upc[1]!==a.distributionUpc)fail(a.slug+': UPC differs from source');
 a.tracks=matches.map((m,i)=>({number:Number(m[1]),title:m[2].trim(),isrc:m[3],youtubeId:ids[i]}));
}
function appleMusicUrl(value){
 if(typeof value!=='string')return false;
 try{const u=new URL(value);return u.protocol==='https:'&&u.hostname==='music.apple.com'&&!u.port&&!u.username&&!u.password&&/^\/[a-z]{2}\/album\/[^/]+\/\d+$/.test(u.pathname)&&!u.hash&&!u.search}catch{return false}
}
function loadAlbums(overrides={}){
 const names=fs.readdirSync(path.join(ROOT,'_catalog/albums')).filter(n=>n.endsWith('.json')).sort();if(!names.length)fail('No album data');
 const seen={slug:new Set(),pageSlug:new Set(),isrc:new Set(),youtube:new Set(),upc:new Set()};
 return names.map(n=>{const a=JSON.parse(overrides[n]??read('_catalog/albums/'+n));sourceTracks(a);
 for(const key of ['slug','pageSlug']){if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a[key])||seen[key].has(a[key]))fail(n+': invalid/duplicate '+key);seen[key].add(a[key]);}if(a.pageSlug==='index')fail(n+': reserved pageSlug');
 for(const key of ['title','artist','label','summary','description'])if(typeof a[key]!=='string'||!a[key].trim())fail(n+': missing '+key);
 if(!/^[a-z0-9][a-z0-9-]*\.webp$/.test(a.cover)||!fs.existsSync(local('images/catalog/'+a.cover)))fail(n+': missing/invalid cover '+a.cover);
 for(const key of ['uploadDate','releaseDate','reviewedAt'])if(!date(a[key]))fail(n+': invalid '+key);
 if(typeof a.distributionUpc!=='string'||!/^\d{12,14}$/.test(a.distributionUpc)||seen.upc.has(a.distributionUpc))fail(n+': invalid/duplicate UPC');seen.upc.add(a.distributionUpc);
 if(a.instrumental!==true)fail(n+': instrumental must be true');
 for(const key of ['tags','genres','uses','moods'])if(!Array.isArray(a[key])||!a[key].length||a[key].some(x=>typeof x!=='string'||!x.trim()))fail(n+': invalid '+key);
 if(!a.rights||a.rights.masterRecording!=='directly-managed'||a.rights.composition!=='directly-managed'||a.rights.oneStopLicensing!==true)fail(n+': confirm rights metadata');
 if(!Number.isInteger(a.featuredOrder)||a.featuredOrder<1)fail(n+': invalid featuredOrder');
 if(a.appleMusicUrl!==undefined&&!appleMusicUrl(a.appleMusicUrl))fail(n+': invalid Apple Music album URL');
 if(!Array.isArray(a.tracks)||a.tracks.length!==a.trackCount||!a.trackCount)fail(n+': track count mismatch');
 a.tracks.forEach((t,i)=>{if(t.number!==i+1||typeof t.title!=='string'||!t.title.trim())fail(n+': invalid track '+(i+1));if(!/^[A-Z]{2}[A-Z0-9]{3}\d{7}$/.test(t.isrc)||seen.isrc.has(t.isrc))fail(n+': invalid/duplicate ISRC '+t.isrc);if(t.youtubeId!==undefined&&t.youtubeId!==null){if(typeof t.youtubeId!=='string'||!/^[A-Za-z0-9_-]{11}$/.test(t.youtubeId)||seen.youtube.has(t.youtubeId))fail(n+': invalid/duplicate YouTube ID '+t.youtubeId);seen.youtube.add(t.youtubeId);}else if(!a.appleMusicUrl)fail(n+': missing YouTube ID or Apple Music URL');seen.isrc.add(t.isrc);});
 const youtubeCount=a.tracks.filter(t=>t.youtubeId).length;
 if(youtubeCount&&youtubeCount!==a.trackCount)fail(n+': provide YouTube IDs for all tracks or use Apple Music for the entire album');
 return a;
 }).sort((a,b)=>a.featuredOrder-b.featuredOrder||a.slug.localeCompare(b.slug));
}
function render(template,values){return template.replace(/@@([A-Z_]+)@@/g,(_,key)=>{if(!(key in values))fail('Missing template value: '+key);return values[key];});}
function build(){
 const albums=loadAlbums(),outputs=new Map(),runtime=read('_catalog/templates/runtime.js'),updatedAt=albums.map(a=>a.reviewedAt).sort().at(-1);
 const playback=a=>Object.fromEntries(['slug','title','artist','label','uploadDate','releaseDate','distributionUpc','format','trackCount','instrumental','tags','rights','appleMusicUrl','tracks'].map(k=>[k,a[k]]));
 const catalog={schemaVersion:'1.2.0',updatedAt,albums:Object.fromEntries(albums.map(a=>[a.slug,playback(a)]))};
 outputs.set('js/catalog/discover-data.json',json(albums.map(a=>Object.fromEntries(['slug','pageSlug','title','artist','cover','releaseDate','distributionUpc','tags','genres','uses','moods','featuredOrder','appleMusicUrl','tracks'].map(k=>[k,a[k]])))));
 const core='/* Generated. Edit _catalog/templates/runtime.js. */\n(function(global){\n global.registerNanashinoB2B = function(catalog){\n'+runtime+'\n };\n})(window);\n';outputs.set('js/catalog/b2b-core.js',core);
 outputs.set('js/b2bvideos.js','/* Generated compatibility bundle. */\n(function(global){\nconst catalog='+json(catalog)+';\n'+runtime+'\n})(window);\n');
 for(const a of albums){const url=BASE+'/catalog/'+a.pageSlug+'.html';const schema={'@context':'https://schema.org','@type':'MusicAlbum','@id':url+'#album',name:a.title,url,image:BASE+'/images/catalog/'+a.cover,description:a.summary,datePublished:a.releaseDate,numTracks:a.trackCount,genre:a.genres,byArtist:{'@type':'MusicGroup',name:a.artist,url:BASE+'/'},recordLabel:{'@type':'Organization',name:a.label},identifier:{'@type':'PropertyValue',propertyID:'UPC',value:a.distributionUpc},track:a.tracks.map(t=>({'@type':'MusicRecording',position:t.number,name:t.title,isrcCode:t.isrc,url:t.youtubeId?'https://www.youtube.com/watch?v='+t.youtubeId:url+'#track-'+t.number,byArtist:{'@type':'MusicGroup',name:a.artist}}))};
 const first=a.tracks[0],d=new Date(a.releaseDate+'T00:00:00Z'),review=new Date(a.reviewedAt+'T00:00:00Z');
 const values={APPLE_URL:html(a.appleMusicUrl||''),APPLE_EMBED:html(a.appleMusicUrl?a.appleMusicUrl.replace('https://music.apple.com/','https://embed.music.apple.com/') : ''),SCHEMA:json(schema),TITLE:html(a.title),TITLE_JSON:json(a.title),LABEL:html(a.label),LABEL_JSON:json(a.label),SLUG:a.slug,PAGE:a.pageSlug,COVER:a.cover,SUMMARY:html(a.summary),TAGS:[...a.genres,...a.uses.slice(0,2)].map(t=>'            <span class="tag">'+html(t)+'</span>').join('\n'),COUNT:a.trackCount,DATE:a.releaseDate,DATE_LONG:d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}),UPC:a.distributionUpc,REVIEWED:review.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}),FIRST_TITLE:html(first.title),FIRST_ISRC:first.isrc.replace(/^(.{2})(.{3})(.{2})(.*)$/,'$1-$2-$3-$4')};
 values.PLAYER_SECTION=render(read('_catalog/templates/'+(a.tracks[0].youtubeId?'player-youtube.html':'player-apple.html')),values);
 outputs.set('catalog/'+a.pageSlug+'.html',render(read('_catalog/templates/album.html'),values));outputs.set('js/catalog/albums/'+a.slug+'.js','window.registerNanashinoB2B('+json({...catalog,albums:{[a.slug]:playback(a)}})+');\n');}
 const cards=albums.map(a=>({featuredOrder:a.featuredOrder,slug:a.slug,title:a.title,artist:a.artist,label:a.label,href:'/site/catalog/'+a.pageSlug+'.html',cover:'/site/images/catalog/'+a.cover,coverAlt:'Cover artwork for '+a.title+' by '+a.artist,releaseDate:a.releaseDate,trackCount:a.trackCount,upc:a.distributionUpc,genres:a.genres,uses:a.uses,moods:a.moods,description:a.description}));
 const indexSchema={'@context':'https://schema.org','@type':'CollectionPage','@id':BASE+'/catalog/#catalog',url:BASE+'/catalog/',name:'Nanashino-chan B2B Music Catalog',mainEntity:{'@type':'ItemList',numberOfItems:albums.length,itemListElement:albums.map((a,i)=>({'@type':'ListItem',position:i+1,url:BASE+'/catalog/'+a.pageSlug+'.html',item:{'@type':'MusicAlbum',name:a.title,image:BASE+'/images/catalog/'+a.cover,datePublished:a.releaseDate,numTracks:a.trackCount,byArtist:{'@type':'MusicGroup',name:a.artist}}}))}};
 outputs.set('catalog/index.html',render(read('_catalog/templates/index.html'),{SCHEMA:json(indexSchema),ALBUMS_JSON:json(cards),TOTAL:albums.length,TRACKS:albums.reduce((n,a)=>n+a.trackCount,0),HEADER:albums.length+' albums',RESULT:`Showing ${albums.length} of ${albums.length} albums`}));
 // Validation finishes before writing any generated file. Only managed paths are updated.
 if(!process.argv.includes('--check'))for(const [p,s] of outputs){const target=local(p);fs.mkdirSync(path.dirname(target),{recursive:true});if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==s)fs.writeFileSync(target,s);}
 console.log(`${process.argv.includes('--check')?'Validated':'Generated'} ${albums.length} albums / ${albums.reduce((n,a)=>n+a.trackCount,0)} tracks / ${outputs.size} files`);return {albums,outputs};
}
if(require.main===module){try{build()}catch(e){console.error('Catalog build stopped:',e.message);process.exit(1)}}
module.exports={build,loadAlbums,appleMusicUrl};
