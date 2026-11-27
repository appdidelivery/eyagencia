import fs from "node:fs";import {execFileSync} from "node:child_process";import assert from "node:assert/strict";
const committed=JSON.parse(execFileSync("git",["show","HEAD:package-lock.json"],{encoding:"utf8",maxBuffer:10*1024*1024}));const installed=JSON.parse(fs.readFileSync("package-lock.json","utf8"));const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
assert.deepEqual(committed,installed,"npm modified the committed lockfile");
assert.deepEqual(committed.packages[""].dependencies,pkg.dependencies);assert.deepEqual(committed.packages[""].devDependencies,pkg.devDependencies);
for(const key of ["imapflow","nodemailer"])assert.equal(committed.packages["node_modules/"+key]?.version,pkg.dependencies[key]);
console.log("Lockfile verified: committed dependency tree unchanged after install; "+Object.keys(committed.packages).length+" package entries.");
