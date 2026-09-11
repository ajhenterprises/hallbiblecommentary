import {authorize,apiError} from '../../../lib/auth';
import {getSEO,validateSEO,seoStatement} from '../../../lib/seo';
function pathFor(value:unknown){if(typeof value!=='string'||!/^\/(?:[a-zA-Z0-9%_-]+\/?)*$/.test(value)||value.length>500||/^\/(api|admin|login)(\/|$)/.test(value))throw Error('Use a public page path such as /articles or /about.');return value==='/'?value:value.replace(/\/$/,'')}
export async function GET(r:Request){try{await authorize(r);return Response.json(await getSEO(pathFor(new URL(r.url).searchParams.get('path'))))}catch(e){return apiError(e)}}
export async function POST(r:Request){try{await authorize(r);const x=await r.json() as any;await seoStatement(pathFor(x.path),validateSEO(x.seo)).run();return Response.json({ok:true})}catch(e){return apiError(e)}}
