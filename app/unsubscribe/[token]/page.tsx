import UnsubscribeForm from './unsubscribe-form';
export const metadata={title:'Unsubscribe | Hall Bible Commentary',robots:{index:false,follow:false}};
export default async function Page({params}:{params:Promise<{token:string}>}){const {token}=await params;return <main className="page-shell"><h1>Email preferences</h1><UnsubscribeForm token={token}/></main>}
