import {db} from './store';
import {emptySEO,type SEO} from './seo-types';
export function validateSEO(input:any):SEO{
 const x={...emptySEO,...input};
 for(const key of ['title','description','image'] as const)if(typeof x[key]!=='string')throw Error('Invalid SEO fields.');
 if(x.title.length>120||x.description.length>320||x.image.length>2000)throw Error('SEO title: maximum 120 characters. Description: maximum 320.');
 if(x.image){try{if(new URL(x.image).protocol!=='https:')throw Error()}catch{throw Error('Social image must be a full HTTPS image address.')}}
 return {title:x.title.trim(),description:x.description.trim(),image:x.image.trim(),noindex:x.noindex===true};
}
export function seoStatement(path:string,value:SEO){return db().prepare('INSERT INTO site_settings (id,value,updated_at) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at').bind('seo:'+path,JSON.stringify(value),new Date().toISOString())}
export async function getSEO(path:string):Promise<SEO>{try{const row=await db().prepare('SELECT value FROM site_settings WHERE id=?').bind('seo:'+path).first<{value:string}>();return row?{...emptySEO,...JSON.parse(row.value)}:emptySEO}catch{return emptySEO}}
export function seoMetadata(path:string,seo:SEO,title:string,description:string){const heading=seo.title||title,summary=seo.description||description;return {title:heading,description:summary,alternates:{canonical:path},robots:seo.noindex?{index:false,follow:true}:undefined,openGraph:{title:heading,description:summary,url:path,images:seo.image?[{url:seo.image}]:[]},twitter:{card:seo.image?'summary_large_image' as const:'summary' as const,title:heading,description:summary,images:seo.image?[seo.image]:[]}}}
