import React, { useState, useRef, useEffect } from 'react';
import { getClientHash } from '../lib/getClientHash';

const WEBHOOK_URL = 'https://primary-production-c6fa.up.railway.app/webhook/yiddishjobs-chatbot';

const ComposeMessage = ({ 
  recipient, 
  message, 
  activeInput, 
  onSetActiveInput, 
  setRecipient,
  setMessage 
}) => {
  const [messages, setMessages] = useState([]); // { id, text, sender }
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    const trimmed = (message || '').trim();
    if (!trimmed) return;

    // append user message locally
    const userEntry = { id: `u-${Date.now()}`, text: trimmed, sender: 'You' };
    setMessages(prev => [...prev, userEntry]);
    setSending(true);
    setError(null);
    setMessage('');

    try {
      setBotTyping(true);

      // include client_hash for session isolation (frontend generates and sends it)
      let clientHash = null;
      try {
        clientHash = await getClientHash();
      } catch (err) {
        console.warn('[ComposeMessage] getClientHash failed', err);
      }

      const headers = { 'Content-Type': 'application/json' };
      if (clientHash) headers['x-client-hash'] = clientHash;

      const payload = clientHash ? { client_hash: clientHash, user_message: trimmed } : { user_message: trimmed };

      // build payload and headers
      // (we log them in detail so it's easy to paste the exact request to Roman / backend)
      console.log('[ComposeMessage] Preparing to send to webhook', {
        url: WEBHOOK_URL,
        payload,
        headers,
        note: 'If client_hash is present, backend should use it to isolate session history',
      });

      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      console.log('[ComposeMessage] Response status:', res.status, res.statusText);
      const raw = await res.text();
      console.log('[ComposeMessage] Raw response text:', raw);

      let data;
      try {
        data = JSON.parse(raw);
        console.log('[ComposeMessage] Parsed JSON:', data);
      } catch (parseErr) {
        console.log('[ComposeMessage] JSON.parse failed, using raw text as data', parseErr);
        data = raw;
      }

      // expected format: [ { Message: '...', Sender: 'Bot:' }, ... ]
      if (Array.isArray(data)) {
        const botEntries = data.map((item, idx) => {
          console.log('[ComposeMessage] item from array:', item);
          return {
            id: `b-${Date.now()}-${idx}`,
            text: typeof item.Message === 'object' ? JSON.stringify(item.Message) : (item.Message ?? String(item)),
            sender: item.Sender ?? 'Bot',
          };
        });
        console.log('[ComposeMessage] botEntries:', botEntries);
        setMessages(prev => [...prev, ...botEntries]);
      } else if (data && typeof data === 'object') {
        // single object response
        console.log('[ComposeMessage] single object response:', data);
        const text = data.Message ? (typeof data.Message === 'object' ? JSON.stringify(data.Message) : data.Message) : JSON.stringify(data);
        setMessages(prev => [...prev, { id: `b-${Date.now()}`, text, sender: data.Sender ?? 'Bot' }]);
      } else {
        setMessages(prev => [...prev, { id: `b-${Date.now()}`, text: String(data), sender: 'Bot' }]);
      }
    } catch (err) {
      console.error('[ComposeMessage] sendMessage error:', err);
      setError(err.message ?? 'Unknown error');
      setMessages(prev => [...prev, { id: `e-${Date.now()}`, text: `Error: ${err.message}`, sender: 'System' }]);
    } finally {
      setSending(false);
      setBotTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sending) sendMessage();
    }
  };

  const listRef = useRef(null);
  const textareaRef = useRef(null);
  const buttonRef = useRef(null);
  const [botTyping, setBotTyping] = useState(false);

  useEffect(() => {
    // scroll to bottom when messages change
    if (!listRef.current) return;
    const el = listRef.current;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    // initial sync
    syncButtonToTextarea();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const syncButtonToTextarea = () => {
    if (!textareaRef.current || !buttonRef.current) return;
    const ta = textareaRef.current;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
    buttonRef.current.style.height = `${ta.offsetHeight}px`;
  };

  const handleInputChange = (e) => {
    const v = e.target.value;
    setMessage(v);
    if (!textareaRef.current) return;
    const ta = textareaRef.current;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
    if (buttonRef.current) buttonRef.current.style.height = `${ta.offsetHeight}px`;
  };

  return (
    <div className="p-4 text-white h-full flex flex-col">
      <h1 className="text-base font-bold mb-3">Compose Message</h1>

      {/* Messages history - chatbot style */}
      <div ref={listRef} className="mb-3 flex-grow overflow-auto bg-gray-900 border border-gray-700 rounded-md p-3">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-sm text-center py-6">No messages yet. Say hello to the bot.</div>
        ) : (
          <div className="space-y-3">
            {messages.map(msg => {
              const isUser = msg.sender === 'You';
              return (
                <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[78%] px-4 py-2 rounded-lg text-sm ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                    <div className="text-xs text-gray-300 mb-1">{msg.sender}</div>
                    <div>{msg.text}</div>
                  </div>
                </div>
              );
            })}
            {botTyping && (
              <div className="flex justify-start">
                <div className="max-w-[60%] px-4 py-2 rounded-lg bg-gray-800 text-gray-200 text-sm rounded-bl-none">
                  <div className="text-xs text-gray-300 mb-1">Bot is typing</div>
                  <div className="typing-dots text-lg"> 
                    <span className="dot" aria-hidden="true"></span>
                    <span className="dot" aria-hidden="true"></span>
                    <span className="dot" aria-hidden="true"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input row */}
      <div className="mt-2 flex items-end space-x-2">
        <textarea
          ref={textareaRef}
          id="message"
          value={message}
          onChange={handleInputChange}
          onFocus={() => onSetActiveInput('message')}
          onKeyDown={handleKeyDown}
          rows={2}
          className={`flex-1 bg-gray-800 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 ${activeInput === 'message' ? 'ring-blue-500' : 'ring-transparent'}`}
          placeholder="Type a message... (Enter to send)"
        ></textarea>

        <button
          ref={buttonRef}
          onClick={sendMessage}
          disabled={sending}
          className={`inline-flex items-center justify-center px-4 py-2 ${sending ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>

      {error && <div className="text-xs text-red-400 mt-2">{error}</div>}
    </div>
  );
};

export default ComposeMessage;
