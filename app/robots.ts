import type {MetadataRoute} from 'next';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:'/',disallow:['/admin','/api/','/login','/search']},sitemap:('https://www.hallbiblecommentary.com')+'/sitemap.xml'}}
