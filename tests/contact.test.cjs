const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const contact = require('../api/contact.js');
const originalFetch = global.fetch;
const originalKey = process.env.RESEND_API_KEY;
delete process.env.RESEND_API_KEY;
let count = 0;
afterEach(() => { global.fetch = originalFetch; delete process.env.RESEND_API_KEY; });
require('node:test').after(() => { if (originalKey !== undefined) process.env.RESEND_API_KEY = originalKey; });
async function submit(body, options = {}) {
  const result = { code: 200, headers: {} };
  const res = {
    setHeader(key, value) { result.headers[key] = value; },
    status(code) { result.code = code; return this; },
    json(data) { result.data = data; return result; },
  };
  return contact({ method: 'POST', headers: { host: 'localhost:3001', origin: 'http://localhost:3001' }, socket: { remoteAddress: `contact-test-${count++}` }, body, ...options }, res);
}
const valid = { name: 'Portfolio test', email: 'visitor@example.com', message: 'I would like to discuss a web project.' };
test('FormSubmit uses browser delivery instead of the stalled server relay', async () => {
  global.fetch = () => { throw new Error('Must not call the stalled relay'); };
  const result = await submit(valid);
  assert.equal(result.code, 200);
  assert.equal(result.data.delivery, 'browser');
  assert.equal(new URL(result.data.action).origin, 'https://formsubmit.co');
  assert.doesNotMatch(result.data.action, /visitor/);
  assert.equal(result.data.message, undefined);
});
test('rejects malformed submissions, header injection and cross-origin requests', async () => {
  global.fetch = () => { throw new Error('Must not call relay'); };
  for (const body of [null, '{', {}, { ...valid, email: 'invalid' }, { ...valid, name: 'Bad\r\nBcc: x' }, { ...valid, message: 'short' }, { ...valid, message: 'a'.repeat(5001) }]) {
    assert.equal((await submit(body)).code, 400);
  }
  assert.equal((await submit(valid, { method: 'GET' })).code, 405);
  assert.equal((await submit(valid, { headers: { origin: 'https://other.example', host: 'localhost:3001' } })).code, 403);
});
test('honeypot submissions do not send email', async () => {
  let called = false;
  global.fetch = async () => { called = true; };
  assert.equal((await submit({ ...valid, website: 'spam' })).code, 200);
  assert.equal(called, false);
});
test('provider failures never display a success message', async () => {
  process.env.RESEND_API_KEY = 'failure-test-key';
  for (const mock of [
    async () => ({ ok: false, status: 500, json: async () => ({ success: false }) }),
    async () => ({ ok: true, status: 200, json: async () => ({ success: 'false' }) }),
    async () => { throw new DOMException('timeout', 'TimeoutError'); },
  ]) {
    global.fetch = mock;
    const result = await submit(valid);
    assert.ok(result.code >= 500);
    assert.ok(result.data.error);
    assert.equal(result.data.message, undefined);
  }
});
test('rate-limits repeated sends from one IP', async () => {
  global.fetch = async () => ({ ok: true, json: async () => ({ success: true }) });
  const options = { socket: { remoteAddress: 'limited-contact-test' } };
  for (let i = 0; i < 3; i++) assert.equal((await submit(valid, options)).code, 200);
  const fourth = await submit(valid, options);
  assert.equal(fourth.code, 429);
  assert.ok(fourth.headers['Retry-After']);
});
test('Resend keeps credentials on the server and sends only to the configured owner', async () => {
  process.env.RESEND_API_KEY = 'test-resend-secret';
  global.fetch = async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(options.headers.Authorization, 'Bearer test-resend-secret');
    const body = JSON.parse(options.body);
    assert.equal(body.reply_to, valid.email);
    assert.deepEqual(body.to, [process.env.CONTACT_EMAIL || 'dheerajsoni.dev@gmail.com']);
    assert.match(body.text, /web project/);
    return { ok: true, json: async () => ({ id: 'email-test-123' }) };
  };
  const result = await submit(valid);
  assert.equal(result.code, 200);
  assert.doesNotMatch(JSON.stringify(result.data), /test-resend-secret/);
});
test('Resend rejection does not fall back and risk duplicate mail', async () => {
  process.env.RESEND_API_KEY = 'bad-test-key';
  let calls = 0;
  global.fetch = async () => { calls++; return { ok: false, status: 401, json: async () => ({ message: 'invalid key' }) }; };
  assert.equal((await submit(valid)).code, 502);
  assert.equal(calls, 1);
});
