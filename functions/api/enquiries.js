const allowedServices = new Set(['voice-over','micro-drama','ai-video','digital-marketing','original-content','other'])
const clean = (value,max) => typeof value === 'string' ? value.trim().replace(/[<>]/g,'').slice(0,max) : ''
const response = (payload,status=200) => new Response(JSON.stringify(payload),{status,headers:{'content-type':'application/json;charset=UTF-8','cache-control':'no-store'}})

export async function onRequestPost({request,env}){
  try{
    const input=await request.json()
    if(input.website)return response({error:'Unable to submit.'},400)
    const enquiry={name:clean(input.name,100),email:clean(input.email,254).toLowerCase(),company:clean(input.company,150),service:clean(input.service,80),languages:clean(input.languages,250),scope:clean(input.scope,4000),budget_range:clean(input.budget_range,80),timeline:clean(input.timeline,150),source_page:clean(input.source_page,250)}
    if(enquiry.name.length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)||!allowedServices.has(enquiry.service)||enquiry.scope.length<10)return response({error:'Please check the required fields.'},400)
    if(env.TURNSTILE_SECRET){const verification=new FormData();verification.append('secret',env.TURNSTILE_SECRET);verification.append('response',input.turnstileToken||'');verification.append('remoteip',request.headers.get('CF-Connecting-IP')||'');const result=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:verification}).then(r=>r.json());if(!result.success)return response({error:'Please complete the security check.'},403)}
    const database=await fetch(`${env.SUPABASE_URL}/rest/v1/enquiries`,{method:'POST',headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,'content-type':'application/json',prefer:'return=minimal'},body:JSON.stringify(enquiry)})
    if(!database.ok)throw new Error('Database insert failed')
    if(env.RESEND_API_KEY){await fetch('https://api.resend.com/emails',{method:'POST',headers:{authorization:`Bearer ${env.RESEND_API_KEY}`,'content-type':'application/json'},body:JSON.stringify({from:env.FORM_FROM_EMAIL,to:[env.ENQUIRY_TO_EMAIL],reply_to:enquiry.email,subject:`New ${enquiry.service} enquiry from ${enquiry.name}`,text:`${enquiry.name} (${enquiry.email})\n${enquiry.company}\n${enquiry.languages}\n${enquiry.timeline}\n\n${enquiry.scope}`})})}
    return response({message:'Thank you. Your enquiry has been received.'},201)
  }catch(error){console.error(error);return response({error:'We could not submit your enquiry. Please try again.'},500)}
}
