export function setupVoice({ input, isBusy, onSubmit }) {
  const mic = document.getElementById('chat-mic');
  const audio = document.getElementById('chat-audio');
  const language = document.getElementById('chat-language');
  const status = document.getElementById('chat-voice-status');
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let listening = false;
  let audioEnabled = false;
  let utterance = null;
  let serviceAvailable = true;
  const sayStatus = (en, hi) => { status.textContent = language.value === 'hi-IN' ? hi : en; };
  const stop = () => {
    if (recognition) {
      const current = recognition;
      recognition = null;
      current.abort();
    }
    listening = false;
    mic.setAttribute('aria-pressed', 'false');
    mic.setAttribute('aria-label', 'Start microphone');
    language.disabled = false;
    window.speechSynthesis?.cancel();
    utterance = null;
    sayStatus('Type a question, or use the microphone.', 'सवाल लिखें या माइक्रोफ़ोन दबाएँ.');
  };
  if (!Recognition || !window.isSecureContext) {
    mic.disabled = true;
    status.textContent = !window.isSecureContext
      ? 'Voice needs HTTPS or localhost. You can still type.'
      : 'Voice input is unavailable in this browser. You can still type.';
  }
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
    audio.disabled = true;
    audio.title = 'Spoken replies are unavailable in this browser';
  }
  audio.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    audio.setAttribute('aria-pressed', String(audioEnabled));
    audio.textContent = audioEnabled ? 'Voice on' : 'Voice off';
    if (!audioEnabled) window.speechSynthesis?.cancel();
  });
  language.addEventListener('change', stop);
  mic.addEventListener('click', () => {
    if (listening) { recognition?.stop(); return; }
    if (isBusy() || !serviceAvailable) return;
    stop();
    if (!audio.disabled) {
      audioEnabled = true;
      audio.setAttribute('aria-pressed', 'true');
      audio.textContent = 'Voice on';
    }
    const current = new Recognition();
    recognition = current;
    current.lang = language.value;
    current.continuous = false;
    current.interimResults = true;
    let finalTranscript = '';
    let failed = false;
    const draft = input.value.trim();
    current.onstart = () => {
      if (recognition !== current) return;
      listening = true;
      mic.setAttribute('aria-pressed', 'true');
      mic.setAttribute('aria-label', 'Stop microphone');
      language.disabled = true;
      sayStatus('Listening… speak your question, then pause.', 'सुन रहा हूँ… सवाल बोलें, फिर रुकें.');
    };
    current.onresult = (event) => {
      if (recognition !== current) return;
      let interim = '';
      finalTranscript = '';
      for (const result of event.results) {
        if (result.isFinal) finalTranscript += result[0].transcript + ' ';
        else interim += result[0].transcript;
      }
      input.value = [draft, finalTranscript + interim].filter(Boolean).join(' ').slice(0, 1000);
      input.dispatchEvent(new Event('input'));
    };
    current.onerror = (event) => {
      if (recognition !== current) return;
      failed = true;
      const errors = {
        'not-allowed': ['Allow microphone access in your browser, then try again.', 'ब्राउज़र में माइक्रोफ़ोन की अनुमति दें, फिर कोशिश करें.'],
        'service-not-allowed': ['Voice service is blocked. Please type your question.', 'वॉइस सेवा उपलब्ध नहीं है. कृपया सवाल लिखें.'],
        'audio-capture': ['No microphone found. Connect one or type your question.', 'माइक्रोफ़ोन नहीं मिला. कृपया सवाल लिखें.'],
        'no-speech': ['No speech detected. Please try again.', 'आवाज़ सुनाई नहीं दी. फिर कोशिश करें.'],
        'network': ['Voice recognition needs a network connection. Please try typing.', 'आवाज़ पहचानने के लिए नेटवर्क चाहिए. कृपया सवाल लिखें.'],
      };
      sayStatus(...(errors[event.error] || ['Voice input stopped. You can type instead.', 'वॉइस इनपुट रुक गया. आप सवाल लिख सकते हैं.']));
    };
    current.onend = () => {
      if (recognition !== current) return;
      recognition = null;
      listening = false;
      language.disabled = false;
      mic.setAttribute('aria-pressed', 'false');
      mic.setAttribute('aria-label', 'Start microphone');
      if (!failed && finalTranscript.trim()) {
        sayStatus('Sending your question…', 'आपका सवाल भेज रहा हूँ…');
        onSubmit(input.value.trim());
      } else if (!failed) sayStatus('No question captured. Try again or type.', 'सवाल नहीं मिला. फिर बोलें या लिखें.');
    };
    try { current.start(); } catch {
      stop();
      sayStatus('Could not start the microphone. Please try again.', 'माइक्रोफ़ोन शुरू नहीं हुआ. फिर कोशिश करें.');
    }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('pagehide', stop);
  return {
    stop,
    language: () => language.value,
    setBusy: (busy) => { mic.disabled = busy || !serviceAvailable || !Recognition || !window.isSecureContext; },
    setServiceAvailable(available) {
      serviceAvailable = available;
      if (!available) stop();
      mic.disabled = !available || isBusy() || !Recognition || !window.isSecureContext;
      audio.disabled = !available || !window.speechSynthesis || !window.SpeechSynthesisUtterance;
      audio.textContent = !available ? 'Text only' : audioEnabled ? 'Voice on' : 'Voice off';
    },
    speak(text) {
      if (!serviceAvailable || !audioEnabled || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const lang = /[\u0900-\u097f]/u.test(text) ? 'hi-IN' : 'en-IN';
      utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ''));
      utterance.lang = lang;
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang === lang) || voices.find(v => v.lang.startsWith(lang.slice(0, 2)));
      if (voice) utterance.voice = voice;
      utterance.onend = () => { utterance = null; };
      window.speechSynthesis.speak(utterance);
    },
  };
}
