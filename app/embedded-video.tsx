'use client';
import {useState} from 'react';
export default function EmbeddedVideo({src}:{src:string}){const [loaded,setLoaded]=useState(false);return <div className="embedded-video">{loaded?<iframe src={src} title="Embedded teaching video" allowFullScreen loading="lazy"/>:<div className="video-placeholder"><strong>Teaching video</strong><p>Loading this video connects to the video provider. Its privacy practices apply.</p><button type="button" className="button" onClick={()=>setLoaded(true)}>Load video</button><a href="/privacy">Privacy Policy</a></div>}</div>}
