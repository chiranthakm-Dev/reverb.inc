const allowedServices = new Set([
  'Voice Overs, Dubbing & Localization', 'Micro Drama — Production & Localization',
  'AI Micro Videos', 'Digital Marketing & Brand Solutions', 'Original Content', 'Other',
])

const clean = (value, max) => typeof value === 'string' ? value.trim().replace(/[<>]/g, '').slice(0, max) : ''

export function validateEnquiry(input) {
  const enquiry = {
    name: clean(input?.name, 100), email: clean(input?.email, 254).toLowerCase(), company: clean(input?.company, 150),
    service: clean(input?.service, 100), languages: clean(input?.languages, 250), timeline: clean(input?.timeline, 150),
    budget: clean(input?.budget, 80), scope: clean(input?.scope, 4000), website: clean(input?.website, 200),
  }
  if (enquiry.website) return { ok: false, status: 400, error: 'Unable to submit.' }
  if (enquiry.name.length < 2) return { ok: false, status: 400, error: 'Please enter your name.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) return { ok: false, status: 400, error: 'Please enter a valid email.' }
  if (!allowedServices.has(enquiry.service)) return { ok: false, status: 400, error: 'Please select a valid service.' }
  if (!enquiry.languages) return { ok: false, status: 400, error: 'Please add at least one language.' }
  if (enquiry.scope.length < 10) return { ok: false, status: 400, error: 'Please tell us a little more about the project.' }
  delete enquiry.website
  return { ok: true, value: enquiry }
}
