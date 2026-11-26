import fs from "node:fs";import {execFileSync} from "node:child_process";
const before=JSON.parse(execFileSync("git",["show","HEAD:package-lock.json"],{encoding:"utf8",maxBuffer:10*1024*1024}));
const after=JSON.parse(fs.readFileSync("package-lock.json","utf8"));
for(const [k,v] of Object.entries(after.packages)){if(JSON.stringify(v)!==JSON.stringify(before.packages[k]))console.log("MAIL_LOCK_CHANGE "+JSON.stringify([k,v]));}
for(const k of Object.keys(before.packages))if(!(k in after.packages))console.log("MAIL_LOCK_REMOVE "+JSON.stringify(k));
console.log("MAIL_LOCK_END "+Object.keys(after.packages).length);
