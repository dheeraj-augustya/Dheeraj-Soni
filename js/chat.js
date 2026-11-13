/**
 * Bilingual AI Assistant Frontend (/js/chat.js)
 * Communicates strictly with /api/chat and safely builds DOM nodes for basic markdown.
 *
 * Deployment note:
 * The /api/chat serverless endpoint works once deployed to Vercel (or locally
 * via `vercel dev` / `server.ts`). Static-only preview servers cannot execute
 * /api/chat.js and will return 404, which is handled gracefully below.
 */

const STORAGE_KEY = 'ds-chat-history';

const QUICK_QUESTIONS = [
  'What are your skills?',
  'Tell me about your projects',
  'Aapka experience kya hai?',
  'आपकी शिक्षा क्या है?',
  'Hire karne ke liye contact kaise karu?',
];

const WELCOME_MESSAGE =
  "Hi! I'm Dheeraj's AI assistant. Ask me anything about his skills, projects, experience, or how to get in touch — in English, हिंदी, or Hinglish.";

/**
 * Safely renders limited markdown (bold, links, bullet lists) using DOM nodes only.
 * Never injects raw text via innerHTML.
 */
function renderSafeMarkdown(container, rawText) {
  const lines = String(rawText || '').replace(/\r\n/g, '\n').split('\n');
  let activeList = null;

  const appendInlineFormatted = (parent, text) => {
    const tokenPattern = /(\*\*[^*]+\*\*|https?:\/\/[^\s)]+|mailto:[^\s)]+)/g;
    let lastIndex = 0;
    let match;

    while ((match = tokenPattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parent.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }

      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        const strong = document.createElement('strong');
        strong.textContent = token.slice(2, -2);
        parent.appendChild(strong);
      } else if (token.startsWith('https://') || token.startsWith('http://') || token.startsWith('mailto:')) {
        const link = document.createElement('a');
        link.href = token;
        link.textContent = token.replace(/^mailto:/, '');
        if (!token.startsWith('mailto:')) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
        parent.appendChild(link);
      }
      lastIndex = tokenPattern.lastIndex;
    }

    if (lastIndex < text.length) {
      parent.appendChild(document.createTextNode(text.slice(lastIndex)));
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      activeList = null;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      if (!activeList) {
        activeList = document.createElement('ul');
        container.appendChild(activeList);
      }
      const li = document.createElement('li');
      appendInlineFormatted(li, trimmed.replace(/^[-*]\s+/, ''));
      activeList.appendChild(li);
    } else {
      activeList = null;
      const p = document.createElement('p');
      appendInlineFormatted(p, trimmed);
      container.appendChild(p);
    }
  }
}

function loadHistory() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string')
      : [];
  } catch {
    return [];
  }
}

function saveHistory(messages) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
  } catch {
    // Ignore storage failures
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const fab = document.getElementById('chat-fab');
  const unreadDot = document.getElementById('chat-unread-dot');
  const chatWindow = document.getElementById('chat-window');
  const closeBtn = document.getElementById('chat-close');
  const clearBtn = document.getElementById('chat-clear');
  const messagesEl = document.getElementById('chat-messages');
  const quickEl = document.getElementById('chat-quick-questions');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');

  if (!fab || !chatWindow || !messagesEl || !form || !input || !sendBtn) return;

  let history = loadHistory();
  let isLoading = false;

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function appendBubble(role, text, isError = false) {
    const bubble = document.createElement('div');
    if (isError) {
      bubble.className = 'chat-bubble chat-bubble-error';
      bubble.textContent = text;
    } else if (role === 'user') {
      bubble.className = 'chat-bubble chat-bubble-user';
      bubble.textContent = text;
    } else {
      bubble.className = 'chat-bubble chat-bubble-assistant';
      renderSafeMarkdown(bubble, text);
    }
    messagesEl.appendChild(bubble);
    scrollToBottom();
    return bubble;
  }

  function showTypingIndicator() {
    const wrap = document.createElement('div');
    wrap.className = 'chat-bubble chat-bubble-assistant chat-typing';
    wrap.setAttribute('aria-label', 'Assistant is typing');
    wrap.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(wrap);
    scrollToBottom();
    return wrap;
  }

  function updateQuickQuestionsVisibility() {
    if (!quickEl) return;
    const hasUserMessage = history.some((m) => m.role === 'user');
    quickEl.hidden = hasUserMessage;
  }

  function renderQuickQuestions() {
    if (!quickEl) return;
    quickEl.innerHTML = '';
    QUICK_QUESTIONS.forEach((question) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quick-chip';
      btn.textContent = question;
      btn.addEventListener('click', () => {
        if (!isLoading) sendMessage(question);
      });
      quickEl.appendChild(btn);
    });
    updateQuickQuestionsVisibility();
  }

  function renderAllMessages() {
    messagesEl.innerHTML = '';
    appendBubble('assistant', WELCOME_MESSAGE);
    history.forEach((msg) => appendBubble(msg.role, msg.text));
    updateQuickQuestionsVisibility();
  }

  function setChatOpen(open) {
    chatWindow.hidden = !open;
    fab.setAttribute('aria-expanded', String(open));
    if (open && unreadDot) {
      unreadDot.classList.add('is-hidden');
    }
    if (open) {
      scrollToBottom();
      window.setTimeout(() => input.focus(), 60);
    }
  }

  async function sendMessage(rawText) {
    const text = rawText.trim().slice(0, 1000);
    if (!text || isLoading) return;

    isLoading = true;
    sendBtn.disabled = true;
    input.value = '';
    input.style.height = 'auto';

    history.push({ role: 'user', text });
    saveHistory(history);
    appendBubble('user', text);
    updateQuickQuestionsVisibility();

    const typingNode = showTypingIndicator();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-10) }),
      });

      const responseText = await response.text();
      let data = null;
      let isJson = false;

      try {
        data = JSON.parse(responseText);
        isJson = Boolean(data && typeof data === 'object');
      } catch {
        isJson = false;
      }

      typingNode.remove();

      if (!response.ok) {
        if (response.status === 404 && !isJson) {
          console.error('Chat service 404 (serverless endpoint unavailable in static preview):', response.status, responseText);
          appendBubble(
            'assistant',
            'The AI chat service is unavailable in this static preview because /api/chat requires Vercel serverless hosting. Once deployed to Vercel it works automatically — meanwhile, feel free to email dheerajsoni.dev@gmail.com or use the Contact section.',
            true
          );
        } else if (!isJson) {
          console.error('Chat service non-JSON error response:', response.status, responseText);
          appendBubble('assistant', 'Chat service is not reachable. Please try again shortly.', true);
        } else {
          console.error('Chat service error response:', response.status, data);
          const errorMsg =
            typeof data.error === 'string' && data.error
              ? data.error
              : 'Chat service is not reachable. Please try again shortly.';
          appendBubble('assistant', errorMsg, true);
        }
      } else if (!isJson) {
        console.error('Chat service returned non-JSON success response:', response.status, responseText);
        appendBubble('assistant', 'Chat service is not reachable. Please try again shortly.', true);
      } else if (typeof data.reply === 'string' && data.reply.trim()) {
        const reply = data.reply.trim();
        history.push({ role: 'assistant', text: reply });
        saveHistory(history);
        appendBubble('assistant', reply);
      } else {
        console.error('Chat service missing reply field:', response.status, data);
        appendBubble('assistant', 'Chat service is not reachable. Please try again shortly.', true);
      }
    } catch (err) {
      typingNode.remove();
      console.error('Chat network failure:', err);
      appendBubble(
        'assistant',
        'Chat service is not reachable. Please try again shortly.',
        true
      );
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  fab.addEventListener('click', () => {
    const isOpen = !chatWindow.hidden;
    setChatOpen(!isOpen);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => setChatOpen(false));
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      history = [];
      saveHistory(history);
      renderAllMessages();
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage(input.value);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input.value);
    }
  });

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 110)}px`;
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !chatWindow.hidden) {
      setChatOpen(false);
    }
  });

  renderAllMessages();
  renderQuickQuestions();
});
