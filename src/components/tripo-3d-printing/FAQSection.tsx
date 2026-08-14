"use client";
import { useState } from "react";
const faq=[
 ["Can I create a 3D printing model from an image?","Yes. Use Image to 3D to turn a clear reference image into editable, exportable 3D geometry."],
 ["Can I generate a printable 3D model from text?","Yes. Describe the subject and Tripo can generate a 3D model that can be prepared for printing workflows."],
 ["What export formats are supported?","The landing experience highlights STL, OBJ, 3MF, FBX, GLB and USDZ workflows."],
 ["How does Tripo improve print success?","The workflow emphasizes watertight geometry, structural robustness, clean topology, and reduced redundant geometry."],
 ["Is the workflow suitable for beginners?","The interaction is designed to reduce the learning curve of traditional 3D modeling software while retaining production-oriented outputs."],
];
export function FAQSection(){const [open,setOpen]=useState(0);return <section id="faq" className="faq-section"><div className="faq-title"><span>05 / FAQ</span><h2>3D Printing FAQ</h2></div><div className="faq-list">{faq.map(([q,a],i)=><div className={`faq-item ${open===i?"is-open":""}`} key={q}><button onClick={()=>setOpen(open===i?-1:i)}><span>{q}</span><i>{open===i?'−':'+'}</i></button><div className="faq-answer"><p>{a}</p></div></div>)}</div></section>}
