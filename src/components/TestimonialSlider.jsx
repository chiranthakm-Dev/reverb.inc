import { useRef, useState } from 'react'
export default function TestimonialSlider({ items }){
  const [active,setActive]=useState(0);const track=useRef(null)
  const go=index=>{const next=(index+items.length)%items.length;setActive(next);track.current?.children[next]?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'start'})}
  return <div className="testimonials"><div className="testimonial-track" ref={track}>{items.map((item,index)=><figure key={index} aria-hidden={index!==active}><blockquote>“{item.quote}”</blockquote><figcaption><b>{item.name}</b><span>{item.role}</span></figcaption></figure>)}</div><div className="slider-controls"><span aria-live="polite">{String(active+1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</span><button onClick={()=>go(active-1)} aria-label="Previous testimonial">←</button><button onClick={()=>go(active+1)} aria-label="Next testimonial">→</button></div></div>
}
