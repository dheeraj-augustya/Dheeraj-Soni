import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupVoice } from '../js/chat-voice.js';

test('voice language, transcripts, speech, cancellation and permission errors', () => {
  const elements = new Map();
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      value: '', disabled: false, attributes: {}, handlers: {}, textContent: '',
      addEventListener(event, callback) { this.handlers[event] = callback; },
      setAttribute(key, value) { this.attributes[key] = value; },
      dispatchEvent() {}, focus() {},
    });
    return elements.get(id);
  }
  let current;
  let spoken;
  let cancelled = 0;
  const submissions = [];
  class Recognition {
    constructor() { current = this; }
    start() { this.onstart(); }
    abort() { this.onend(); }
    stop() { this.onend(); }
  }
  const oldWindow = globalThis.window;
  const oldDocument = globalThis.document;
  const oldUtterance = globalThis.SpeechSynthesisUtterance;
  globalThis.window = {
    SpeechRecognition: Recognition, isSecureContext: true,
    SpeechSynthesisUtterance: class {}, addEventListener() {},
    speechSynthesis: { cancel() { cancelled++; }, getVoices: () => [{ lang: 'hi-IN' }], speak(value) { spoken = value; } },
  };
  globalThis.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
  globalThis.document = { getElementById: element, addEventListener() {} };
  try {
    const input = element('input');
    element('chat-language').value = 'hi-IN';
    const voice = setupVoice({ input, isBusy: () => false, onSubmit: text => submissions.push(text) });
    element('chat-mic').handlers.click();
    assert.equal(current.lang, 'hi-IN');
    assert.equal(element('chat-mic').attributes['aria-pressed'], 'true');
    const result = [{ transcript: 'आपकी शिक्षा क्या है?' }];
    result.isFinal = true;
    current.onresult({ results: [result] });
    current.onend();
    assert.match(input.value, /शिक्षा/);
    assert.deepEqual(submissions, ['आपकी शिक्षा क्या है?']);
    current.onend();
    assert.equal(submissions.length, 1);
    voice.speak('धीरज ने B.Tech किया है.');
    assert.equal(spoken.lang, 'hi-IN');
    assert.match(spoken.text, /B.Tech/);
    element('chat-mic').handlers.click();
    const staleRecognition = current;
    voice.stop();
    staleRecognition.onresult({ results: [[{ transcript: 'stale' }]] });
    assert.doesNotMatch(input.value, /stale/);
    assert.ok(cancelled > 0);
    element('chat-mic').handlers.click();
    current.onerror({ error: 'not-allowed' });
    current.onend();
    assert.match(element('chat-voice-status').textContent, /अनुमति/);
    voice.setBusy(true);
    assert.equal(element('chat-mic').disabled, true);
    voice.setServiceAvailable(false);
    voice.setBusy(false);
    assert.equal(element('chat-mic').disabled, true);
    assert.equal(element('chat-audio').textContent, 'Text only');
    voice.setServiceAvailable(true);
    assert.equal(element('chat-mic').disabled, false);
    voice.stop();
  } finally {
    globalThis.window = oldWindow;
    globalThis.document = oldDocument;
    globalThis.SpeechSynthesisUtterance = oldUtterance;
  }
});
