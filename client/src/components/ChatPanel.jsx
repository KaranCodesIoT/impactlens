import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, ExternalLink, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useChat } from '../hooks/useChat';

export default function ChatPanel({ projectId }) {
  const { messages, loading, sendMessage, clearMessages } = useChat(projectId);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const SUGGESTIONS = [
    'What are the main sustainability activities visible?',
    'How many trees or plants can you estimate?',
    'What environmental concerns are visible?',
    'Summarize the overall project impact',
    'Which SDG goals does this project contribute to?'
  ];

  return (
    <div className="glass-card flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center">
            <Bot size={16} className="text-primary-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-surface-200">Evidence Q&A</h3>
            <p className="text-[0.65rem] text-surface-700">Ask about your project media</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={clearMessages} className="btn btn-icon text-surface-700 hover:text-surface-200">
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles size={24} className="text-primary-400/50 mx-auto mb-3" />
            <p className="text-sm text-surface-700 mb-4">Ask questions about your uploaded media</p>
            <div className="space-y-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(s); }}
                  className="block w-full text-left text-xs text-surface-700 hover:text-primary-400 
                    p-2.5 rounded-lg hover:bg-primary-500/5 transition-colors border border-transparent hover:border-primary-500/10"
                >
                  "{s}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-primary-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot size={14} className="text-primary-400" />
                </div>
              )}
              <div className={`max-w-[80%] ${
                msg.role === 'user'
                  ? 'bg-primary-600/20 border border-primary-500/20 rounded-2xl rounded-tr-md px-4 py-2.5'
                  : 'bg-white/[0.03] border border-white/5 rounded-2xl rounded-tl-md px-4 py-3'
              }`}>
                {msg.role === 'user' ? (
                  <p className="text-sm text-surface-100">{msg.content}</p>
                ) : (
                  <div className="text-sm text-surface-200 prose-sm prose-invert">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}

                {/* Citations */}
                {msg.citations?.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-white/5 space-y-1.5">
                    <p className="text-[0.65rem] text-surface-700 uppercase font-semibold tracking-wider">Sources</p>
                    {msg.citations.map((cite, i) => (
                      <a
                        key={i}
                        href={cite.cloudinaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-primary-400 hover:text-primary-300 no-underline"
                      >
                        <ExternalLink size={10} />
                        Asset #{cite.assetIndex} — {cite.relevance}
                      </a>
                    ))}
                  </div>
                )}

                {msg.confidence && (
                  <span className={`badge mt-2 ${
                    msg.confidence === 'high' ? 'badge-success' :
                    msg.confidence === 'medium' ? 'badge-warning' : 'badge-danger'
                  }`}>
                    {msg.confidence} confidence
                  </span>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-accent-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User size={14} className="text-accent-400" />
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-7 h-7 rounded-lg bg-primary-500/15 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-primary-400" />
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary-400/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary-400/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary-400/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your project evidence..."
            className="input flex-1"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
