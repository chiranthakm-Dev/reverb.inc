import test from 'node:test'
import assert from 'node:assert/strict'
import { validateEnquiry } from './validation.js'

test('accepts a complete enquiry', () => {
  const result = validateEnquiry({ name: 'Asha Rao', email: 'asha@example.com', service: 'Original Content', languages: 'Kannada', scope: 'A ten episode interview series.' })
  assert.equal(result.ok, true)
  assert.equal(result.value.email, 'asha@example.com')
})

test('rejects invalid and bot enquiries', () => {
  assert.equal(validateEnquiry({}).ok, false)
  assert.equal(validateEnquiry({ name: 'Asha', email: 'a@b.com', service: 'Other', languages: 'English', scope: 'Enough project detail', website: 'spam' }).ok, false)
})
