import {authorize,apiError} from '../../../lib/auth';
export async function POST(r:Request){try{await authorize(r);return Response.json({error:'Verify individual source passages in Source Library first, then generate a proposal there. Unverified sermon text cannot be used for generation.'},{status:409})}catch(e){return apiError(e)}}
