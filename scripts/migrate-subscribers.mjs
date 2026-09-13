import postgres from 'postgres';
import {readFile} from 'node:fs/promises';
// Run in Vercel's build environment; credentials never enter the browser bundle.
if(process.env.VERCEL && process.env.DATABASE_URL){
 const sql=postgres(process.env.DATABASE_URL,{ssl:'require',max:1,prepare:false});
 try{const migration=await readFile(new URL('../supabase/subscribers.sql',import.meta.url),'utf8');await sql.begin(async tx=>{await tx`SELECT pg_advisory_xact_lock(92130913)`;await tx.unsafe(migration)});console.log('Subscriber schema and private-access policies verified.')}finally{await sql.end()}
}else if(process.env.VERCEL){throw Error('DATABASE_URL is required to deploy subscriber management.')}
