import {sameOrigin} from './csrf';
import {env} from '@/lib/runtime';
import {getChatGPTUser} from '../app/chatgpt-auth';
export async function admin(){const u=await getChatGPTUser();if(!u)return null;const e=env as unknown as Record<string,string>;const local=((import.meta as any).env?.DEV||process.env.NODE_ENV==='development'&&process.env.LOCAL_DEMO==='true')&&u.userId==='local_seedy';return local||!!e.ADMIN_USER_ID&&u.userId===e.ADMIN_USER_ID?u:null}
export async function authorize(request:Request){const u=await admin();if(!u)throw new Error('FORBIDDEN');if(request.method!=='GET'){if(!sameOrigin(request))throw new Error('FORBIDDEN')}return u}
export function apiError(e:unknown){const msg=e instanceof Error?e.message:'Unable to complete this request';return Response.json({error:msg==='FORBIDDEN'?'Please sign in as the administrator.':msg},{status:msg==='FORBIDDEN'?403:400})}
