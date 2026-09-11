'use client';
import {createContext,useContext} from 'react';
import {defaultSite,type SiteSettings} from '../lib/site-defaults';
const Context=createContext<SiteSettings>(defaultSite);
export default function SiteProvider({value,children}:{value:SiteSettings;children:React.ReactNode}){return <Context.Provider value={value}>{children}</Context.Provider>}
export const useSite=()=>useContext(Context);
