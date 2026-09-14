export const SITE_ORIGIN='https://www.hallbiblecommentary.com';
export function commentarySlug(c:any){if(!c.book)return c.slug;if(c.entry_type==='book')return c.book+'-introduction';return c.book+'-'+c.chapter+'-'+(c.entry_type==='chapter'?'chapter':(c.verse_start||1)+'-'+(c.verse_end||c.verse_start||1))}
export function socialImage(title:string,description=''){return SITE_ORIGIN+'/social-image?'+new URLSearchParams({title:title.slice(0,180),description:description.slice(0,180),v:'1'})}
