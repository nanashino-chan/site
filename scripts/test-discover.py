#!/usr/bin/env python3
"""Static release gate for listener pages. Does not claim browser/media QA."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse,unquote
import json,re,subprocess,xml.etree.ElementTree as ET,tempfile
ROOT=Path(__file__).resolve().parents[1];BASE='https://nanashino-chan.github.io/site'
class Page(HTMLParser):
 def __init__(self,text):super().__init__();self.tags=[];self.feed(text)
 def handle_starttag(self,tag,attrs):self.tags.append((tag,dict(attrs)))
albums=json.loads((ROOT/'js/catalog/discover-data.json').read_text());expected=set();descriptions=set();titles=set();total=0
for a in albums:
 for lang in ['en','ja']:
  name=a['slug']+('-ja' if lang=='ja' else '')+'.html';expected.add(name);p=ROOT/'albums'/name;s=p.read_text();tags=Page(s).tags;url=BASE+'/albums/'+name
  assert ('html',{'lang':lang}) in tags
  robots=[d['content'] for t,d in tags if t=='meta' and d.get('name')=='robots'];assert len(robots)==1 and 'noindex' not in robots[0]
  assert [d['href'] for t,d in tags if t=='link' and d.get('rel')=='canonical']==[url]
  for code in ['en','ja']:
   alternate=BASE+'/albums/'+a['slug']+('-ja' if code=='ja' else '')+'.html'
   assert any(t=='link' and d.get('hreflang')==code and d.get('href')==alternate for t,d in tags)
  title=re.search(r'<title>(.*?)</title>',s).group(1);assert title not in titles; titles.add(title)
  desc=next(d['content'] for t,d in tags if t=='meta' and d.get('name')=='description');assert desc not in descriptions;descriptions.add(desc)
  assert not any(t=='iframe' for t,d in tags),'Empty player in initial HTML'
  assert len([1 for t,d in tags if t=='li' and 'listener-track' in d.get('class','')])==len(a['tracks'])
  ids=[d['id'] for t,d in tags if 'id' in d];assert len(ids)==len(set(ids)),name
  data=json.loads(re.search(r'<script id="albumData" type="application/json">(.*?)</script>',s,re.S).group(1));assert data==a
  schema=json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>',s,re.S).group(1));assert schema['name']==a['title'];assert schema['numTracks']==len(a['tracks'])
  assert [t['name'] for t in schema['track']]==[t['title'] for t in a['tracks']]
  assert [t['isrcCode'] for t in schema['track']]==[t['isrc'] for t in a['tracks']]
  for t,d in tags:
   for attr in ['href','src']:
    value=d.get(attr,'');u=urlparse(value)
    if not value or u.scheme:continue
    target=(p.parent/unquote(u.path)).resolve() if u.path else p
    assert target.exists(),(name,value)
    if target.suffix=='.html' and u.fragment:
     assert 'id="'+u.fragment+'"' in target.read_text(),(name,value)
  langlink=next(d for t,d in tags if d.get('id')=='languageSwitch');assert '?' not in langlink['href'];assert (p.parent/langlink['href']).exists()
  total+=len(a['tracks'])
assert set(p.name for p in (ROOT/'albums').glob('*.html'))==expected
sitemap=ET.parse(ROOT/'sitemap.xml');locs=[e.text for e in sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')];assert len(locs)==len(set(locs))
assert all(BASE+'/albums/'+name in locs for name in expected)
for file in ['discover.html','discover-ja.html']:
 s=(ROOT/file).read_text();tags=Page(s).tags
 links=[d['href'] for t,d in tags if t=='a' and d.get('href','').startswith('albums/')]
 assert len(links)==len(albums) and len(set(links))==len(albums)
 assert "navigateAlbum(linked.slug,t?.number,true)" in s,'Legacy link should replace history entry'
 assert "location.assign(detailUrl(a,t))" in s,'List navigation must add history entry'
 for script in re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>',s,re.S):
  if script.strip():
   with tempfile.NamedTemporaryFile(suffix='.js',mode='w',encoding='utf-8') as f:
    f.write(script);f.flush();subprocess.run(['node','--check',f.name],check=True,capture_output=True)
subprocess.run(['node','--check',str(ROOT/'js/discover/album.js')],check=True)
print(f'PASS: {len(expected)} pages, {total} localized track rows, unique titles/descriptions, exact metadata, canonical/hreflang, sitemap, references, no initial iframe, legacy routes and JS syntax.')
