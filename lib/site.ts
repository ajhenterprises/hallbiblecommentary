import {db} from './store';
import {defaultSite,type SiteSettings} from './site-defaults';
export async function getSite():Promise<SiteSettings>{
  try {const row=await db().prepare('SELECT value FROM site_settings WHERE id=?').bind('main').first<{value:string}>();return row?{...defaultSite,...JSON.parse(row.value)}:defaultSite;}
  catch{return defaultSite;}
}
export function safeLink(value:string){if(value.startsWith('/')&&!value.startsWith('//'))return true;try{return new URL(value).protocol==='https:'}catch{return false}}
