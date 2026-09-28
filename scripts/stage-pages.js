// Package the existing static website while excluding build inputs and repository internals.
const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..'),out=path.join(root,'_site');
const skip=new Set(['.git','.github','_catalog','_site','scripts','node_modules','CATALOG_GUIDE.md','AGENTS.md']);
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out);
for(const e of fs.readdirSync(root,{withFileTypes:true})){if(skip.has(e.name)||e.name.startsWith('.'))continue;fs.cpSync(path.join(root,e.name),path.join(out,e.name),{recursive:true,dereference:false});}
fs.writeFileSync(path.join(out,'.nojekyll'),'');console.log('Static website staged at _site/');
