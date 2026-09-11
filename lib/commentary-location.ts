import books from '../data/books.json';
import options from '../data/verse-options.json';
export type Location={book:string;chapter:number|null;entry_type:string;verse_start:number|null;verse_end:number|null};
export function verseNumbers(book:string,chapter:number){return (options as Record<string,Record<string,number[]>>)[book]?.[String(chapter)]||[]}
export function normalizeLocation(current:Location,patch:Partial<Location>):Location{
 const x={...current,...patch};const b=books.find(b=>b.slug===x.book)||books[0];x.book=b.slug;
 if(patch.book&&patch.book!==current.book){x.chapter=1;x.verse_start=1;x.verse_end=1}
 if(x.entry_type==='book')return {...x,chapter:null,verse_start:null,verse_end:null};
 x.chapter=Math.min(b.chapters,Math.max(1,Number(x.chapter)||1));
 if(x.entry_type==='chapter')return {...x,verse_start:null,verse_end:null};
 const verses=verseNumbers(x.book,x.chapter),last=verses.at(-1)||1;
 x.verse_start=Math.min(last,Math.max(1,Number(x.verse_start)||1));
 x.verse_end=x.entry_type==='verse'?x.verse_start:Math.max(x.verse_start,Math.min(last,Number(x.verse_end)||x.verse_start));return x;
}
