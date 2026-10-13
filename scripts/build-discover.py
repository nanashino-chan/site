#!/usr/bin/env python3
"""Generate independent listener album pages from the existing catalog export.
Run after node scripts/build-catalog.js. No third-party dependencies.
"""
from pathlib import Path
import json, html, re
from urllib.parse import quote
ROOT=Path(__file__).resolve().parents[1]
BASE='https://nanashino-chan.github.io/site'
DATA=ROOT/'js/catalog/discover-data.json'
ALBUMS=json.loads(DATA.read_text(encoding='utf-8'))
OUT=ROOT/'albums'; OUT.mkdir(exist_ok=True)
esc=lambda value:html.escape(str(value),quote=True)
slug_re=re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
seen=set()
for a in ALBUMS:
 assert slug_re.fullmatch(a['slug']),a['slug']
 assert a['slug'] not in seen,a['slug']
 seen.add(a['slug'])
 assert a['tracks'] and len({t['number'] for t in a['tracks']})==len(a['tracks'])
 assert (ROOT/'images/catalog'/a['cover']).is_file(),a['cover']
 for t in a['tracks']:
  assert t.get('youtubeId') or a.get('appleMusicUrl'),(a['slug'],t['title'])
  if t.get('youtubeId'):assert re.fullmatch(r'[A-Za-z0-9_-]{11}',t['youtubeId'])
 if a.get('appleMusicUrl'):assert a['appleMusicUrl'].startswith('https://music.apple.com/')

def page_name(a,lang):return a['slug']+('-ja' if lang=='ja' else '')+'.html'
def link(url,label):return f'<a class="btn btn-secondary" href="{esc(url)}" target="_blank" rel="noopener">{esc(label)} ↗</a>'

def description(a,ja):
 titles=' / '.join(t['title'] for t in a['tracks'][:2])
 genres=' / '.join(a['genres'])
 if a['slug']=='chillhop-lofi-relax-focus-instrumental':
  return '穏やかなChillhopのビートに、温かいJazzhopの響きと、やさしいLo-Fiのリズムを重ねた26曲のインストゥルメンタル。勉強や読書のおともに、ひと息つきたい時間に。気になる曲から聴いてみてください。' if ja else 'Unwind with mellow Chillhop beats, warm Jazzhop textures and a gentle Lo-Fi rhythm. These 26 instrumental tracks make room for studying, reading, or simply taking a quiet moment.'
 return (f'Nanashino-chanの「{a["title"]}」。{genres}を楽しめる全{len(a["tracks"])}曲のインストゥルメンタル作品です。「{titles}」などを収録。気になる曲を試聴して、配信サービスでお気に入りを見つけてください。' if ja else f'Explore {a["title"]} by Nanashino-chan: {len(a["tracks"])} instrumental tracks spanning {genres}. Start with {titles}, preview the collection and find your favorites on streaming services.')

for a in ALBUMS:
 for lang in ['en','ja']:
  ja=lang=='ja';name=page_name(a,lang);url=BASE+'/albums/'+name;other=page_name(a,'en' if ja else 'ja');title=a['title'];desc=description(a,ja);apple_only=not any(t.get('youtubeId') for t in a['tracks']);rows=[]
  for t in a['tracks']:
   query=quote(a['artist']+' '+t['title']);youtube=t.get('youtubeId');listen=('試聴する' if ja else 'Listen') if youtube else ('アルバム内で試聴' if ja else 'Album preview');copy='アーティスト名・曲名をコピー' if ja else 'Copy artist + title'
   streams=(f'<a href="https://music.youtube.com/watch?v={youtube}" target="_blank" rel="noopener">YouTube Music ↗</a>' if youtube else f'<a href="{esc(a["appleMusicUrl"])}" target="_blank" rel="noopener">Apple Music · {"アルバム" if ja else "album"} ↗</a>')
   streams+=f'<a href="https://music.apple.com/{"jp" if ja else "us"}/search?term={query}" target="_blank" rel="noopener">Apple Music {"で検索" if ja else "search"} ↗</a>'
   rows.append(f'<li class="listener-track" id="track-{t["number"]}"><span class="track-number">{t["number"]:02}</span><div><span class="track-title">{esc(t["title"])}</span><div class="stream-links">{streams}</div></div><div class="track-actions"><button class="btn btn-primary" data-listen="{t["number"]}" aria-label="{listen}: {esc(t["title"])}">▶ {listen}</button><button class="btn btn-secondary" data-copy="{t["number"]}" aria-label="{copy}: {esc(t["title"])}">{copy}</button></div></li>')
  q=quote(a['artist']+' '+title)
  services=link(a.get('appleMusicUrl') or f'https://music.apple.com/{"jp" if ja else "us"}/search?term={q}','Apple Music'+('' if a.get('appleMusicUrl') else ('で検索' if ja else ' search')))+link('https://music.youtube.com/search?q='+q,'YouTube Music'+('で検索' if ja else ' search'))
  schema={'@context':'https://schema.org','@type':'MusicAlbum','@id':url+'#album','url':url,'name':title,'description':desc,'image':BASE+'/images/catalog/'+a['cover'],'inLanguage':lang,'datePublished':a['releaseDate'],'numTracks':len(a['tracks']),'genre':a['genres'],'byArtist':{'@type':'MusicGroup','name':a['artist']},'track':[{'@type':'MusicRecording','name':t['title'],'position':t['number'],'isrcCode':t['isrc'],'url':url+'#track-'+str(t['number'])} for t in a['tracks']]}
  seo=f'<link rel="canonical" href="{url}"><link rel="alternate" hreflang="en" href="{BASE}/albums/{page_name(a,"en")}"><link rel="alternate" hreflang="ja" href="{BASE}/albums/{page_name(a,"ja")}"><link rel="alternate" hreflang="x-default" href="{BASE}/albums/{page_name(a,"en")}"><meta property="og:type" content="music.album"><meta property="og:title" content="{esc(title)} | Nanashino-chan"><meta property="og:description" content="{esc(desc)}"><meta property="og:url" content="{url}"><meta property="og:image" content="{BASE}/images/catalog/{esc(a["cover"])}"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False).replace('<','\\u003c')+'</script>'
  values={'TITLE':esc(title),'DESCRIPTION':esc(desc),'COVER':esc(a['cover']),'COUNT':str(len(a['tracks'])),'RELEASE':esc(a['releaseDate']+(' リリース' if ja else ' · Released')),'GENRES':esc(' · '.join(a['genres'])),'ROWS':''.join(rows),'OTHER':other,'SERVICES':services,'DATA':json.dumps(a,ensure_ascii=False).replace('<','\\u003c'),'SEO':seo,'INITIALURL':esc(a['appleMusicUrl'] if apple_only else 'https://www.youtube.com/watch?v='+a['tracks'][0]['youtubeId']),'OPEN':('Apple Musicで聴く ↗' if ja else 'Open Apple Music ↗') if apple_only else ('YouTubeで聴く ↗' if ja else 'Open YouTube ↗'),'FIRST':('アルバムを試聴する' if ja else 'Preview the album') if apple_only else ('1曲目を試聴する' if ja else 'Listen to the first track'),'PROVIDER':'APPLE MUSIC PREVIEW' if apple_only else 'YOUTUBE PREVIEW','PROVIDERJA':'試聴にはApple Musicを使用します。プレイヤー内で曲を選んでください。' if apple_only else '試聴にはYouTubeを使用します。','PROVIDEREN':'Playback uses Apple Music. Select your track inside the player.' if apple_only else 'Playback uses YouTube.','FALLBACK':('再生できない場合は、配信サービスでアルバムや曲を開いてください。' if ja else 'If playback is unavailable, open the album or track on the streaming service.')}
  s=(ROOT/'_discover/templates'/f'album-{lang}.html').read_text(encoding='utf-8')
  for key,value in values.items():s=s.replace('@@'+key+'@@',value)
  assert not re.search(r'@@[A-Z]+@@',s),name
  s=s.replace('リンク先は検索結果です。サービス内でアルバムや曲を選択してください。','「検索」のリンクは検索結果を開きます。サービス内でアルバムや曲を選択してください。').replace('These links open search results. Select the album or track on the service.','Links marked “search” open search results. Select the album or track on the service.')
  (OUT/name).write_text(s,encoding='utf-8')
# Static crawlable links for every album, independent of JavaScript rendering.
for lang in ['en','ja']:
 p=ROOT/('discover-ja.html' if lang=='ja' else 'discover.html');s=p.read_text(encoding='utf-8')
 links=''.join(f'<li><a href="albums/{page_name(a,lang)}">{esc(a["title"])}</a></li>' for a in ALBUMS)
 block='<!-- DISCOVER_ALBUM_LINKS_START --><noscript><section class="wrap"><h2>'+('全アルバムの詳細ページ' if lang=='ja' else 'All album detail pages')+'</h2><ul>'+links+'</ul></section></noscript><!-- DISCOVER_ALBUM_LINKS_END -->'
 if '<!-- DISCOVER_ALBUM_LINKS_START -->' in s:s=re.sub(r'<!-- DISCOVER_ALBUM_LINKS_START -->.*?<!-- DISCOVER_ALBUM_LINKS_END -->',lambda m:block,s,flags=re.S)
 else:s=s.replace('</main>',block+'</main>')
 p.write_text(s,encoding='utf-8')
print(f'Generated {len(ALBUMS)*2} listener pages from {len(ALBUMS)} albums.')
