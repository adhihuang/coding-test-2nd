'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function ChatBot() {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    { role: 'bot', content: 'Hello! How can I help you?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatId = useRef(crypto.randomUUID()); // UUID sekali saja

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const sanitizeResponse = (content: string): string => {
    return content
      .replace(/<\|[a-z]*$/, '')
      .replace(/<\|[a-z]+\|>$/, '')
      .replace(/<$/, '')
      .replaceAll(/<\|[a-z]+\|>/g, ' ')
      .replaceAll('<', '&lt;')
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/\n{2,}/g, '')
      .trim();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatid: chatId.current,
          question: userMessage,
        }),
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');

        console.log(contentType)
        if (contentType?.includes('application/json')) {
          const data = await response.json();
          
          const sanitized = sanitizeResponse(data.answer);
          setMessages(prev => [...prev, { role: 'bot', content: sanitized }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'bot', content: 'Error fetching response.' }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', content: 'An error occurred.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="pc-container">
      <div className="pc-content">
        <div className="messages mt-3 shadow">
          <div className="content message-layout border border-1 max-h-[400px] p-4 overflow-scroll" ref={chatContainerRef}>
            { messages.map((msg , idx) => {
                if(msg.role == "user"){
                  return (
                    <div key={idx}>
                      <div className="chat__box__text-box mb-4 chat-container">
                        <div
                          className="chat-bubble user-message px-4 py-3 text-white rounded-l-md rounded-t-md group relative"
                          dangerouslySetInnerHTML={{ __html: msg.content }}
                        />
                      </div>
                      <div className="clear-both mt-3"></div>
                    </div>
                  );
                }
                return (
                  <div
                    key={idx}
                    className="chat-bubble bot-message text-white my-2"
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                  />
                );
              })
            }
            {loading && <div className="chat-bubble bot-message text-white my-2">Typing...</div>}
          </div>
        </div>
        <div className="chat-box box mt-3 rounded rounded-3">
          <div className="content m-auto">
            <div className="mb-3 message-container flex">
              <input
                type="text"
                className="form-control mad-prompt-wrap"
                id="input-message"
                placeholder="e.g. Type your question"
                maxLength={80}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="btn ml-2 btn-primary mt-3 d-inline-flex justify-content-center align-items-center"
                id="btn-send"
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
