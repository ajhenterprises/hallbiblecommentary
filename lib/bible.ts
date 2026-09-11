import booksData from '../data/books.json';
import versesData from '../data/verses';
export const books=booksData;
export const verses=versesData;
export type Reference={book:string;chapter:number;start:number;end:number};
export function bookName(slug:string){return books.find(b=>b.slug===slug)?.name||slug}
export function chapterText(book:string,chapter:number){return verses.filter(v=>v.book===book&&v.chapter===chapter)}
export function referenceLabel(r:Reference){return `${bookName(r.book)} ${r.chapter}${r.start?':'+r.start+(r.end>r.start?'-'+r.end:''):''}`}
export function validReference(r:Reference){const b=books.find(b=>b.slug===r.book);if(!b||!Number.isInteger(r.chapter)||r.chapter<1||r.chapter>b.chapters)return false;const vs=chapterText(r.book,r.chapter);return Number.isInteger(r.start)&&Number.isInteger(r.end)&&r.start>=1&&r.end>=r.start&&r.end<=Math.max(...vs.map(v=>v.verse))}
export function parseReference(text:string):Reference|null{for(const b of [...books].sort((a,b)=>b.name.length-a.name.length)){const safe=b.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const m=text.match(new RegExp('(?:^|\\b)'+safe+'\\s+(\\d+)(?::(\\d+)(?:[–-](\\d+))?)?','i'));if(m){const chapter=+m[1],start=+(m[2]||1),end=m[3]?+m[3]:m[2]?start:Math.max(0,...chapterText(b.slug,chapter).map(v=>v.verse));const r={book:b.slug,chapter,start,end};return validReference(r)?r:null}}return null}
export function referencesIn(text:string){const found:Reference[]=[];for(const b of books){const pattern=new RegExp('\\b'+b.name+'\\s+\\d+:\\d+(?:[–-]\\d+)?','gi');for(const m of text.matchAll(pattern)){const r=parseReference(m[0]);if(r&&!found.some(x=>JSON.stringify(x)===JSON.stringify(r)))found.push(r)}}return found}
