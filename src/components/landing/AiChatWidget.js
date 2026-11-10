'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, ChevronDown, MessageSquare, Send, Sparkles, X } from 'lucide-react';
import Mascot from './Mascot';

const DEFAULT_SUGGESTIONS = [
  'Có được học thử miễn phí không?',
  'Học phí các khóa học như thế nào?',
  'Hình thức học như thế nào?',
];

const INACTIVITY_TIMEOUT_MS = 3 * 60 * 1000; // 3 phút không hoạt động -> hỏi thăm
const CLOSE_SESSION_TIMEOUT_MS = 1 * 60 * 1000; // 1 phút sau khi hỏi nếu vẫn không trả lời -> kết thúc phiên và reset

const INITIAL_MESSAGE = {
  id: 'init-1',
  sender: 'bot',
  text: 'Chào bạn! Mình là Cố vấn học tập DewSkill 💧. Bạn đang muốn tìm hiểu về học phí, cách học thử miễn phí hay lộ trình khóa học nào ạ?',
  actionLink: null,
  actionLabel: null,
};

export default function AiChatWidget({ lmsUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);

  const scrollRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const closeSessionTimerRef = useRef(null);
  const hasAskedRef = useRef(false);

  // Dọn dẹp toàn bộ timer
  const clearAllTimers = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (closeSessionTimerRef.current) {
      clearTimeout(closeSessionTimerRef.current);
      closeSessionTimerRef.current = null;
    }
  };

  // Kết thúc phiên, xóa lịch sử và reset lại từ đầu
  const resetChatSession = () => {
    clearAllTimers();
    hasAskedRef.current = false;
    setMessages([INITIAL_MESSAGE]);
    setSuggestions(DEFAULT_SUGGESTIONS);
    setInput('');
    setLoading(false);
    setIsOpen(false);
  };

  // Hỏi thăm sau 3 phút không tương tác
  const triggerCheckIn = () => {
    if (hasAskedRef.current) return;
    hasAskedRef.current = true;

    setMessages((prev) => [
      ...prev,
      {
        id: `bot-checkin-${Date.now()}`,
        sender: 'bot',
        text: 'Bạn còn đó không? Nếu bạn cần thêm thông tin gì về khóa học hay học phí, cứ nhắn cho mình nhé! 💧',
      },
    ]);

    // Bắt đầu đếm ngược 1 phút để kết thúc phiên và xóa lịch sử nếu không trả lời
    if (closeSessionTimerRef.current) clearTimeout(closeSessionTimerRef.current);
    closeSessionTimerRef.current = setTimeout(() => {
      resetChatSession();
    }, CLOSE_SESSION_TIMEOUT_MS);
  };

  // Khởi động lại timer 3 phút không hoạt động
  const restartInactivityTimer = () => {
    clearAllTimers();
    hasAskedRef.current = false;

    inactivityTimerRef.current = setTimeout(() => {
      triggerCheckIn();
    }, INACTIVITY_TIMEOUT_MS);
  };

  // Quản lý timer theo trạng thái mở / đóng chat
  useEffect(() => {
    if (isOpen) {
      restartInactivityTimer();
    } else {
      clearAllTimers();
      hasAskedRef.current = false;
    }
    return () => clearAllTimers();
  }, [isOpen]);

  // Dev hooks để kiểm tra nhanh
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__triggerAiInactivity = triggerCheckIn;
      window.__triggerAiReset = resetChatSession;
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function handleSend(textToSend) {
    const query = String(textToSend || input || '').trim();
    if (!query || loading) return;

    // Người dùng tương tác: Hủy hẹn giờ kết thúc phiên và reset lại timer 3 phút
    restartInactivityTimer();

    // Khi người dùng chọn 1 câu hỏi hoặc gửi tin nhắn: Ẩn toàn bộ gợi ý cũ ngay lập tức
    setSuggestions([]);

    const userMsg = { id: `user-${Date.now()}`, sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6),
        }),
      });

      const data = await res.json();
      if (data?.success && data?.data) {
        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: data.data.text,
          actionLink: data.data.actionLink,
          actionLabel: data.data.actionLabel,
        };
        setMessages((prev) => [...prev, botMsg]);

        // Cập nhật gợi ý động mới tương ứng với câu trả lời của AI
        if (Array.isArray(data.data.suggestions) && data.data.suggestions.length > 0) {
          setSuggestions(data.data.suggestions);
        } else {
          setSuggestions([]);
        }
      } else {
        throw new Error(data?.message || 'Không thể phản hồi');
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'Rất tiếc, mình đang bận một chút. Bạn có thể để lại số điện thoại ở cuối trang hoặc liên hệ hotline để được hỗ trợ ngay nhé!',
        },
      ]);
      setSuggestions([]);
    } finally {
      setLoading(false);
      restartInactivityTimer();
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  return (
    <aside aria-label="Cố vấn học tập AI DewSkill" className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 sm:gap-2.5 rounded-full bg-gradient-to-r from-dew-500 to-dew-700 p-1.5 pl-2 sm:p-1.5 sm:pl-2.5 text-white shadow-xl shadow-dew-800/30 ring-2 ring-white/90 transition-all hover:scale-105 active:scale-95"
          aria-label="Mở cửa sổ Cố vấn học tập AI"
        >
          {/* Mascot icon */}
          <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white shadow-xs shrink-0">
            <Mascot name="y-tuong" size={28} />
            {/* Green active dot */}
            <span className="absolute bottom-0 right-0 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>

          <div className="pr-2 sm:pr-2.5 text-left leading-tight">
            <p className="flex items-center gap-1 text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider text-dew-200">
              <Sparkles size={9} className="text-amber-300" /> Cố vấn học tập
            </p>
            <p className="text-[11px] sm:text-xs font-black text-white">Tư vấn khóa học & học thử</p>
          </div>

          {/* Pulsing glow ring */}
          <span className="pointer-events-none absolute -inset-1 -z-10 animate-ping rounded-full bg-dew-400/25 duration-1000" />
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="flex h-[490px] sm:h-[530px] w-[330px] sm:w-[360px] max-w-[calc(100vw-2rem)] max-h-[85vh] flex-col overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] border border-dew-100 bg-white shadow-2xl shadow-dew-950/20 ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Chat Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-dew-600 via-dew-700 to-dew-800 px-4 py-3.5 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
                <Mascot name="cam-xuc-hoc-bai" size={32} />
              </div>
              <div>
                <p className="text-sm font-black leading-tight">Cố vấn học tập DewSkill</p>
                <p className="flex items-center gap-1.5 text-[11px] font-bold text-dew-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Sẵn sàng giải đáp 24/7
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 text-dew-200 hover:bg-white/10 hover:text-white"
              aria-label="Đóng khung chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-semibold leading-relaxed shadow-sm sm:text-sm ${isUser
                      ? 'rounded-br-none bg-dew-600 text-white'
                      : 'rounded-bl-none border border-slate-100 bg-slate-50 text-slate-800'
                      }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  {/* Optional Action Button from Bot */}
                  {msg.actionLink && (
                    <a
                      href={msg.actionLink}
                      className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-amber-950 shadow hover:bg-amber-300"
                    >
                      {msg.actionLabel || 'Xem ngay ➔'}
                    </a>
                  )}
                </div>
              );
            })}

            {/* Quick Suggestion Chips inside the chat flow */}
            {!loading && suggestions && suggestions.length > 0 && (
              <div className="pt-2 flex flex-col gap-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 px-0.5 text-[11px] font-bold text-slate-500">
                  <Sparkles size={12} className="text-amber-500" />
                  <span>Gợi ý câu hỏi bạn có thể quan tâm:</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => void handleSend(sug)}
                      className="group flex items-center justify-between gap-2 rounded-xl border border-dew-200 bg-white px-3 py-2 text-left text-xs font-bold text-slate-700 shadow-2xs transition-all hover:border-dew-500 hover:bg-dew-50/80 hover:text-dew-900 active:scale-98 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-dew-100 text-[11px]">
                          💬
                        </span>
                        <span>{sug}</span>
                      </span>
                      <span className="text-dew-400 group-hover:text-dew-700 group-hover:translate-x-0.5 transition-transform text-xs">
                        ➔
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Typing Loader Indicator */}
            {loading && (
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2 w-2 animate-bounce rounded-full bg-dew-500" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-dew-500 [animation-delay:0.2s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-dew-500 [animation-delay:0.4s]" />
                <span className="text-xs font-bold text-slate-400">Giọt nước đang trả lời...</span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="border-t border-slate-100 bg-white p-3">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1.5 focus-within:border-dew-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-dew-100">
              <input
                type="text"
                placeholder="Hỏi về học phí, học thử, khóa học..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (closeSessionTimerRef.current) {
                    clearTimeout(closeSessionTimerRef.current);
                    closeSessionTimerRef.current = null;
                    hasAskedRef.current = false;
                  }
                  restartInactivityTimer();
                }}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="flex-1 bg-transparent text-xs font-medium outline-none placeholder:text-slate-400 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => void handleSend()}
                disabled={!input.trim() || loading}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-dew-600 text-white transition hover:bg-dew-700 disabled:opacity-40"
                aria-label="Gửi tin nhắn"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

