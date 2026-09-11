import {db} from '../../../lib/store';
import {authorize,apiError} from '../../../lib/auth';
const kinds=['topics','people','series','categories'];
const list=(value:string)=>JSON.parse(value||'[]') as string[];
async function catalog(){
 const items=(await db().prepare('SELECT * FROM taxonomy ORDER BY kind,name').all()).results as any[];
 const content=(await db().prepare('SELECT topics,people,series,categories FROM content').all()).results as any[];
 const sermons=(await db().prepare('SELECT tags,series FROM sermons').all()).results as any[];
 const names=new Map<string,any>();
 for(const item of items)names.set(item.kind+'\0'+item.name,{...item,uses:0});
 for(const row of [...content,...sermons.map(s=>({topics:s.tags,series:s.series}))])for(const kind of kinds){
  for(const name of kind==='series'?(row.series?[row.series]:[]):list(row[kind])){
   const key=kind+'\0'+name;if(!names.has(key))names.set(key,{id:null,kind,name,uses:0});names.get(key).uses++;
  }
 }
 return [...names.values()].sort((a,b)=>a.kind.localeCompare(b.kind)||a.name.localeCompare(b.name));
}
export async function GET(r:Request){try{await authorize(r);return Response.json(await catalog())}catch(e){return apiError(e)}}
export async function POST(r:Request){try{await authorize(r);const {kind,name}=await r.json() as any;if(!kinds.includes(kind)||typeof name!=='string'||!name.trim()||name.trim().length>100)throw Error('Choose a type and enter a name (up to 100 characters).');if((await catalog()).some(x=>x.kind===kind&&x.name.toLowerCase()===name.trim().toLowerCase()))throw Error('This name already exists.');await db().prepare('INSERT INTO taxonomy VALUES (?,?,?)').bind(crypto.randomUUID(),kind,name.trim()).run();return Response.json({ok:true})}catch(e){return apiError(e)}}
async function change(r:Request,remove:boolean){try{
 const user=await authorize(r);const input=await r.json() as any;
 const item=(await catalog()).find(x=>input.id?x.id===input.id:x.kind===input.kind&&x.name===input.name);
 if(!item)throw Error('This name no longer exists. Refresh and try again.');
 const replacement=remove?'':typeof input.newName==='string'?input.newName.trim():'';
 if(!remove&&(!replacement||replacement.length>100))throw Error('Enter a name of up to 100 characters.');
 if(!remove&&(await catalog()).some(x=>x.kind===item.kind&&x.name!==item.name&&x.name.toLowerCase()===replacement.toLowerCase()))throw Error('That name already exists. Choose a different name.');
 const statements:any[]=[];const now=new Date().toISOString();
 for(const table of ['content','sermons']){
  if(table==='sermons'&&!['topics','series'].includes(item.kind))continue;
  const column=table==='sermons'&&item.kind==='topics'?'tags':item.kind;
  const rows=(await db().prepare(`SELECT id,${column} FROM ${table}`).all()).results as any[];
  for(const row of rows){
   const values=column==='series'?[row[column]]:list(row[column]);if(!values.includes(item.name))continue;
   const value=column==='series'?replacement:JSON.stringify([...new Set(values.flatMap(v=>v===item.name?(remove?[]:[replacement]):[v]))]);
   statements.push(db().prepare(`UPDATE ${table} SET ${column}=?${table==='content'?',revision=revision+1,updated_at=?':''} WHERE id=?`).bind(...(table==='content'?[value,now,row.id]:[value,row.id])));
  }
 }
 if(remove){if(item.id)statements.push(db().prepare('DELETE FROM taxonomy WHERE id=?').bind(item.id))}
 else if(item.id)statements.push(db().prepare('UPDATE taxonomy SET name=? WHERE id=?').bind(replacement,item.id));
 else statements.push(db().prepare('INSERT INTO taxonomy VALUES (?,?,?)').bind(crypto.randomUUID(),item.kind,replacement));
 statements.push(db().prepare('INSERT INTO audit VALUES (?,?,?,?,?)').bind(crypto.randomUUID(),user.userId,remove?'taxonomy.delete':'taxonomy.rename',item.kind+':'+item.name,now));
 await db().batch(statements);return Response.json({ok:true});
}catch(e){return apiError(e)}}
export async function PATCH(r:Request){return change(r,false)}
export async function DELETE(r:Request){return change(r,true)}
