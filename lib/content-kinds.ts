export const contentKinds={commentary:{section:'Commentary',path:'commentary',label:'Commentary'},blog:{section:'Articles',path:'articles',label:'Article'},devotional:{section:'Devotionals',path:'devotionals',label:'Devotional'},question:{section:'Questions',path:'questions',label:'Question'}} as const;
export function contentPath(kind:string){return contentKinds[kind as keyof typeof contentKinds]?.path||(kind==='sermon'?'sermons':'commentary')}
export function contentLabel(kind:string){return contentKinds[kind as keyof typeof contentKinds]?.label||(kind==='sermon'?'Sermon':'Teaching')}
export function contentSection(kind:string){return contentKinds[kind as keyof typeof contentKinds]?.section||'Commentary'}
export function sectionKind(section:string){return Object.keys(contentKinds).find(k=>contentSection(k)===section)||'commentary'}
