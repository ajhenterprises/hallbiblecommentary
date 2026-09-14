 'use client';
import {useSite} from './site-provider';
export default function MobileMenu(){const s=useSite();return <details className="mobile-menu"><summary>Menu</summary><div>{[...s.primaryLinks,...s.aboutLinks,...s.resourceLinks,['Search','/search'],['Subscribe','/subscribe']].map(([label,url])=><a key={url} href={url}>{label}</a>)}<button onClick={()=>window.dispatchEvent(new Event('hall:install'))}>Install Hall Bible Commentary</button></div></details>}
