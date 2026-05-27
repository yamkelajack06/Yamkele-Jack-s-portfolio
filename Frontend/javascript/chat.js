import { sendMessageToAI } from './api.js';

const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const chatOpenBtn = document.getElementById('chat-open-btn');
const chatBackBtn = document.getElementById('chat-back-btn');
const chatView = document.getElementById('chat-view');

const suggestions = [
  "Tell me about his background & story",
  "What's his tech stack?",
  "Walk me through his projects",
  "What are his career goals?",
  "Tell me something interesting about him"
];

let suggestionsShown = true;

function showSuggestions() {
  const div = document.createElement('div');
  div.className = 'suggestions';
  div.id = 'suggestions-container';
  suggestions.forEach(text => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.onclick = () => submitMessage(text);
    div.appendChild(btn);
  });
  chatMessages.appendChild(div);
}

function hideSuggestions() {
  if (suggestionsShown) {
    const container = document.getElementById('suggestions-container');
    if (container) container.remove();
    suggestionsShown = false;
  }
}

function appendMessage(text, role) {
  const div = document.createElement('div');
  div.className = `message ${role}-message`;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

async function submitMessage(text) {
  if (!text.trim()) return;

  hideSuggestions();
  appendMessage(text, 'user');
  chatInput.value = '';

  const loadingDiv = appendMessage('', 'ai');
  loadingDiv.classList.add('loading');
  loadingDiv.innerHTML = '<span></span><span></span><span></span>';

  const aiResponse = await sendMessageToAI(text);

  loadingDiv.classList.remove('loading');
  loadingDiv.textContent = aiResponse;
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatOpenBtn.addEventListener('click', () => {
  document.getElementById('main-view').style.display = 'none';
  chatView.style.display = 'block';
  window.scrollTo(0, 0);
});

chatBackBtn.addEventListener('click', () => {
  chatView.style.display = 'none';
  document.getElementById('main-view').style.display = 'block';
  window.scrollTo(0, 0);
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  submitMessage(chatInput.value);
});

showSuggestions();