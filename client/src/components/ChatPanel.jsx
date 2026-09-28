import { useState, useRef, useEffect } from 'react';
import { Search, ExternalLink, ArrowRight, Eye, CornerDownLeft, RotateCcw, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useChat } from '../hooks/useChat';

const SUGGESTIONS = [
  'What changed between earlier and later captures?',
  'What conditions or activities are documented?',
  'List all identified objects and entities',
  'Describe the terrain and landmarks observed'
];

export default function ChatPanel({ projectId, onInspectMedia }) {
  const { messages, loading, sendMessage, clearMessages } = useChat(projectId);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleSuggestionClick = (query) => {
    sendMessage(query);
  };

  return (
    <div className="space-y-5 animate-fade-in text-slate-100">
      {/* Query Input */}
      <div className="bg-[#111622] border border-[#1e2634] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-[14px] font-semibold text-white tracking-tight flex items-center gap-2">
              <MessageSquare size={15} className="text-blue-400" />
              Ask about your evidence
            </h3>
            <p className="text-[12px] text-slate-400 mt-0.5">
              Ask questions grounded in the visual evidence you've uploaded.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-3.5 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What do you want to know about your media?"
              className="w-full pl-10 pr-24 py-2.5 bg-[#090d16] border border-[#1e2634] rounded-lg text-[13px] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 px-3 py-1.5 bg-[#2563eb] hover:bg-blue-600 disabled:opacity-40 text-white rounded-md text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Ask</span>
              <CornerDownLeft size={11} />
            </button>
          </div>
        </form>

        {/* Suggestions */}
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Try asking
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(s)}
                disabled={loading}
                className="text-left px-2.5 py-1.5 rounded-lg bg-[#090d16] hover:bg-[#182232] border border-[#1e2634] text-[12px] text-slate-300 hover:text-white transition-all flex items-center gap-1.5 group cursor-pointer"
              >
                <span>{s}</span>
                <ArrowRight size={10} className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {messages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-[12px] font-semibold text-slate-400">
              {messages.filter(m => m.role === 'assistant').length} {messages.filter(m => m.role === 'assistant').length === 1 ? 'result' : 'results'}
            </h4>
            <button
              onClick={clearMessages}
              className="text-[12px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw size={11} />
              <span>Clear</span>
            </button>
          </div>

          <div className="space-y-3">
            {messages.map((msg, index) => {
              if (msg.role === 'user') {
                return (
                  <div key={msg.id || index} className="bg-[#141d2b] border border-[#1e2634] rounded-lg p-3.5 flex items-start gap-3">
                    <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      Q
                    </div>
                    <p className="text-[13px] font-medium text-white">
                      {msg.content}
                    </p>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id || index}
                  className={`bg-[#111622] border rounded-xl p-5 space-y-3 ${
                    msg.isError ? 'border-red-500/40 bg-red-950/20' : 'border-[#1e2634]'
                  }`}
                >
                  {/* Content */}
                  <div className="text-[13px] text-slate-200 leading-relaxed prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>

                  {/* Citations */}
                  {msg.citations?.length > 0 && (
                    <div className="pt-3 border-t border-[#1a2332] space-y-2">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Supporting evidence ({msg.citations.length})
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {msg.citations.map((cite, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3 rounded-lg border border-[#1e2634] bg-[#090d16] hover:border-[#2b3a52] transition-all"
                          >
                            {cite.thumbnailUrl || cite.cloudinaryUrl ? (
                              <img
                                src={cite.thumbnailUrl || cite.cloudinaryUrl}
                                alt={`Asset #${cite.assetIndex}`}
                                className="w-14 h-10 object-cover rounded-md border border-[#1a2332] flex-shrink-0"
                              />
                            ) : (
                              <div className="w-14 h-10 rounded-md bg-[#182232] flex items-center justify-center text-[10px] text-slate-400 flex-shrink-0">
                                #{cite.assetIndex}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] text-slate-300 line-clamp-2 leading-snug">
                                {cite.relevance}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                {onInspectMedia && cite.mediaId && (
                                  <button
                                    type="button"
                                    onClick={() => onInspectMedia({ _id: cite.mediaId, cloudinaryUrl: cite.cloudinaryUrl })}
                                    className="text-[11px] font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                                  >
                                    <Eye size={10} /> View
                                  </button>
                                )}
                                <a
                                  href={cite.cloudinaryUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-0.5"
                                >
                                  <ExternalLink size={9} /> Source
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-[#111622] border border-[#1e2634] rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-[13px] text-slate-300">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Thinking...</span>
          </div>
          <div className="space-y-2">
            <div className="h-3 skeleton w-full" />
            <div className="h-3 skeleton w-4/5" />
            <div className="h-3 skeleton w-2/3" />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
