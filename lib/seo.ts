import {SITE_ORIGIN,socialImage} from './public-url';
import {db,record} from './store';
import {emptySEO,type SEO} from './seo-types';
export function validateSEO(input:any):SEO{
 const x={...emptySEO,...input};
 for(const key of ['title','description','image'] as const)if(typeof x[key]!=='string')throw Error('Invalid SEO fields.');
 if(x.title.length>120||x.description.length>320||x.image.length>2000)throw Error('SEO title: maximum 120 characters. Description: maximum 320.');
 if(x.image){try{if(new URL(x.image).protocol!=='https:')throw Error()}catch{throw Error('Social image must be a full HTTPS image address.')}}
 return {title:x.title.trim(),description:x.description.trim(),image:x.image.trim(),noindex:x.noindex===true};
}
export function seoStatement(path:string,value:SEO){return db().prepare('INSERT INTO site_settings (id,value,updated_at) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at').bind('seo:'+path,JSON.stringify(value),new Date().toISOString())}
export async function getSEO(path:string):Promise<SEO>{try{const row=await db().prepare('SELECT value FROM site_settings WHERE id=?').bind('seo:'+path).first<{value:string}>();if(row)return {...emptySEO,...JSON.parse(row.value)};if(path.startsWith('/commentary/')){const entry=await record(path.slice(12));if(entry?.id){const legacy=await db().prepare('SELECT slug FROM content WHERE id=?').bind(entry.id).first<{slug:string}>();if(legacy&&'/commentary/'+legacy.slug!==path){const old=await db().prepare('SELECT value FROM site_settings WHERE id=?').bind('seo:/commentary/'+legacy.slug).first<{value:string}>();if(old)return {...emptySEO,...JSON.parse(old.value)}}}}return emptySEO}catch{return emptySEO}}
export function seoMetadata(path:string,seo:SEO,title:string,description:string){const heading=seo.title||title,summary=seo.description||description;const image=seo.image||socialImage(heading,summary);return {title:heading,description:summary,alternates:{canonical:SITE_ORIGIN+path},robots:seo.noindex?{index:false,follow:true}:undefined,openGraph:{title:heading,description:summary,url:SITE_ORIGIN+path,type:'website' as const,siteName:'Hall Bible Commentary',images:[{url:image,width:1200,height:630}]},twitter:{card:'summary_large_image' as const,title:heading,description:summary,images:[image]}}}
