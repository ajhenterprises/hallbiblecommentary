import {db} from '../../../lib/store';
import {getSite,safeLink} from '../../../lib/site';
import {defaultSite} from '../../../lib/site-defaults';
import {authorize,apiError} from '../../../lib/auth';
export async function GET(r:Request){try{await authorize(r);return Response.json(await getSite())}catch(e){return apiError(e)}}
export async function POST(r:Request){try{
  await authorize(r);const incoming=await r.json() as any;const x:any={};
  for(const key of Object.keys(defaultSite))x[key]=incoming[key]??(defaultSite as any)[key];
  for(const key of ['subscribeTitle','subscribeText','brandName','authorName','homeTitle','homeIntroduction','homeAbout','disclosure'])if(typeof x[key]!=='string'||!x[key].trim()||x[key].length>4000)throw Error('Please fill in each site text field (maximum 4,000 characters).');
  for(const key of ['showCommentary','showArticles','showSermons'])x[key]=x[key]===true;
  for(const key of ['primaryLinks','aboutLinks','resourceLinks']){if(!Array.isArray(x[key])||x[key].length>12)throw Error('Use at most 12 links in each menu.');for(const item of x[key])if(!Array.isArray(item)||item.length!==2||typeof item[0]!=='string'||!item[0].trim()||item[0].length>80||typeof item[1]!=='string'||!safeLink(item[1]))throw Error('Each menu link needs a name and a local path or HTTPS address.');}
  const paths=['about','about/aaron-joseph-hall','about/permissions','about/faq','about/speaking','resources/books','privacy','terms','content-policy','cookies'];
  if(!x.pages||typeof x.pages!=='object'||Array.isArray(x.pages))throw Error('Invalid page settings.');
  x.pages=Object.fromEntries(Object.entries(x.pages).filter(([k,v])=>paths.includes(k)&&typeof v==='string'&&v.length<=50000));
  if(!Array.isArray(x.books)||x.books.length>100)throw Error('Use at most 100 book entries.');
  for(const b of x.books)if(typeof b.title!=='string'||!b.title.trim()||b.title.length>250||typeof b.description!=='string'||b.description.length>5000||typeof b.url!=='string'||!safeLink(b.url))throw Error('Each book needs a title, description, and a local or HTTPS link.');
  await db().prepare('INSERT INTO site_settings (id,value,updated_at) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at').bind('main',JSON.stringify(x),new Date().toISOString()).run();
  return Response.json({ok:true});
}catch(e){return apiError(e)}}
