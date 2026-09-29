import { useState } from 'react'

const empty = { name:'',email:'',company:'',service:'',languages:'',scope:'',budget_range:'',timeline:'',source_page:'',website:'',turnstileToken:'' }
export default function EnquiryForm({ sourcePage = '/', defaultService = '' }) {
  const turnstileSiteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY
  const [form,setForm] = useState({...empty,source_page:sourcePage,service:defaultService})
  const [state,setState] = useState({status:'idle',message:''})
  const update = e => setForm({...form,[e.target.name]:e.target.value})
  async function submit(e){e.preventDefault();setState({status:'loading',message:'Sending…'});try{const turnstileToken=e.currentTarget.querySelector('[name="cf-turnstile-response"]')?.value||'';const response=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,turnstileToken})});const result=await response.json();if(!response.ok)throw new Error(result.error||'Unable to send.');setState({status:'success',message:'Thank you. Your enquiry has been received.'});setForm({...empty,source_page:sourcePage,service:defaultService});window.turnstile?.reset()}catch(error){setState({status:'error',message:error.message})}}
  return <form className="form-grid" onSubmit={submit}>
    <input className="honeypot" name="website" value={form.website} onChange={update} tabIndex="-1" autoComplete="off" aria-hidden="true" />
    <label className="field"><span>Name *</span><input name="name" value={form.name} onChange={update} required autoComplete="name" /></label>
    <label className="field"><span>Email *</span><input type="email" name="email" value={form.email} onChange={update} required autoComplete="email" /></label>
    <label className="field"><span>Company</span><input name="company" value={form.company} onChange={update} autoComplete="organization" /></label>
    <label className="field"><span>Service *</span><select name="service" value={form.service} onChange={update} required><option value="">Choose a service</option><option value="voice-over">Voice over, dubbing & localization</option><option value="micro-drama">Micro drama</option><option value="ai-video">AI micro videos</option><option value="digital-marketing">Digital marketing</option><option value="original-content">Original content</option><option value="other">Other</option></select></label>
    <label className="field"><span>Languages</span><input name="languages" value={form.languages} onChange={update} placeholder="Kannada, Hindi, Telugu…" /></label>
    <label className="field"><span>Timeline</span><input name="timeline" value={form.timeline} onChange={update} /></label>
    <label className="field wide"><span>Project scope *</span><textarea name="scope" value={form.scope} onChange={update} required minLength="10" /></label>
    {turnstileSiteKey && <div className="wide cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="light"/>}
    <div className="form-action"><button disabled={state.status==='loading'}>{state.status==='loading'?'Sending…':'Send enquiry →'}</button><p role="status" className={state.status}>{state.message}</p></div>
  </form>
}
