'use client';
import {contentPath,contentLabel} from '../lib/content-kinds';
import {trustedSourceNotice} from '../lib/policies';
import {plainText} from '../lib/rich-content';
import {policyLinks} from '../lib/policies';
import {DisclaimerButton} from './reading-disclaimer';
import {useSite} from './site-provider';
import NavMenu from './nav-menu';
import {aboutLinks,resourceLinks} from '../lib/navigation';
import {BookOpen,Search,PenLine} from 'lucide-react';
import {BRAND} from '../lib/config';
import SubscribeForm from './subscribe-form';

export function Header({active=''}:{active?:string}){const site=useSite();return <header className="header"><a href="/" className="brand"><BookOpen size={29}/><span className="brand-name">{site.brandName}</span></a><nav aria-label="Main navigation">{site.primaryLinks.map(([n,url])=><a className={n===active?'active':''} href={url} key={url}>{n}</a>)}<NavMenu label="Resources" links={site.resourceLinks}/><NavMenu label="About" links={site.aboutLinks}/></nav><a className="icon-button" href="/search" aria-label="Search"><Search size={20}/></a><a className="workspace" href="/admin"><PenLine size={16}/><span>Writing desk</span></a></header>}
export function Footer(){const site=useSite();return <footer><SubscribeForm sourceType="footer" /><div><strong>{site.brandName}</strong><p>{site.disclosure}</p><p>{trustedSourceNotice}</p></div><div className="footer-nav"><strong>Explore</strong>{site.primaryLinks.map(([label,url])=><a key={url} href={url}>{label}</a>)}</div><div className="footer-nav"><strong>Resources</strong>{site.resourceLinks.map(([label,url])=><a key={url} href={url} target={url.startsWith("https:")?"_blank":undefined} rel="noopener noreferrer">{label}</a>)}</div><div className="footer-nav"><strong>About</strong>{site.aboutLinks.map(([label,url])=><a key={url} href={url}>{label}</a>)}</div><div className="footer-nav"><strong>Policies & notices</strong>{policyLinks.map(([label,url])=><a key={url} href={url}>{label}</a>)}<DisclaimerButton/></div><div className="footer-credit">© {new Date().getFullYear()} Copyright by Aaron Joseph Hall. All rights reserved.<br/>World English Bible text: public domain. Separately credited material belongs to its respective rights holders.</div></footer>}
export function Empty({title='A growing library',text='There are no published entries here yet.'}:{title?:string;text?:string}){return <div className="empty-teaching"><BookOpen size={25}/><h3>{title}</h3><p>{text}</p><a href="/bible">Continue reading Scripture →</a></div>}
export function EntryCards({items}:{items:any[]}){return <div className="cards">{items.map(c=><a href={'/'+contentPath(c.kind)+'/'+c.slug} className="card" key={c.id}><span className="eyebrow">{contentLabel(c.kind).toUpperCase()}</span><h3>{c.title}</h3><p>{plainText(c.excerpt||c.body).slice(0,160)+(plainText(c.excerpt||c.body).length>160?'…':'')}</p><span className="card-date">{c.publish_date?new Date(c.publish_date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}):''}</span></a>)}</div>}
