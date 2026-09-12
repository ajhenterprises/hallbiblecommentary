'use client';
import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '../components/ui/dialog';
import {trustedSourceNotice} from '../lib/policies';
import {useSite} from './site-provider';
const KEY='hall-disclaimer-v1';
export default function ReadingDisclaimer(){
 const [open,setOpen]=useState(false);const path=usePathname();const site=useSite();
 useEffect(()=>{const show=()=>setOpen(true);window.addEventListener('hall:reading-disclaimer',show);return()=>window.removeEventListener('hall:reading-disclaimer',show)},[]);
 useEffect(()=>{if(/^\/(admin|login|privacy|terms|content-policy|cookies)(\/|$)/.test(path)){setOpen(false);return}try{if(localStorage.getItem(KEY)!=='dismissed')setOpen(true)}catch{setOpen(true)}},[path]);
 function change(next:boolean){setOpen(next);if(!next)try{localStorage.setItem(KEY,'dismissed')}catch{}}
 return <Dialog open={open} onOpenChange={change}><DialogContent className="reading-disclaimer"><DialogTitle>A note before you read</DialogTitle><DialogDescription>Scripture is our foundation. Commentary is a growing record of understanding.</DialogDescription><p>{site.disclosure}</p><p>{trustedSourceNotice}</p><p>This library offers Bible teaching for study and reflection. It is not a substitute for Scripture, personal pastoral care, or qualified professional advice.</p><p className="help">Closing this notice remembers your choice on this browser. It does not give consent to optional tracking.</p><nav aria-label="Site policies" className="policy-inline"><a href="/content-policy">Content Policy</a><a href="/privacy">Privacy Policy</a><a href="/cookies">Cookie Notice</a><a href="/terms">Terms</a></nav><button className="button primary" onClick={()=>change(false)}>Continue reading</button></DialogContent></Dialog>
}
export function DisclaimerButton(){return <button className="text-button" onClick={()=>window.dispatchEvent(new Event('hall:reading-disclaimer'))}>Reading disclaimer</button>}
