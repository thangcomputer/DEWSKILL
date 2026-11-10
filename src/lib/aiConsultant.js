import { promises as fs } from 'fs';
import path from 'path';
import { getSite } from './store';
import { lmsLink } from './lms';

const DATA_PATH = path.join(process.cwd(), 'data', 'ai-knowledge.json');

export async function getAiKnowledge() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {
      systemPrompt: 'Bạn là Cố vấn học tập AI chuyên nghiệp của nền tảng tự học tin học DewSkill...',
      apiKey: '',
      provider: 'builtin',
      faqs: [],
      customKnowledge: '',
    };
  }
}

export async function saveAiKnowledge(data) {
  const current = await getAiKnowledge();
  const next = {
    ...current,
    systemPrompt: String(data.systemPrompt || current.systemPrompt || '').trim(),
    apiKey: String(data.apiKey !== undefined ? data.apiKey : current.apiKey || '').trim(),
    provider: String(data.provider || 'builtin'),
    customKnowledge: String(data.customKnowledge || '').trim(),
    faqs: Array.isArray(data.faqs)
      ? data.faqs.map((f, i) => ({
          id: f.id || `faq-${Date.now()}-${i}`,
          question: String(f.question || '').trim(),
          answer: String(f.answer || '').trim(),
          keywords: Array.isArray(f.keywords)
            ? f.keywords.map((k) => String(k).trim().toLowerCase()).filter(Boolean)
            : String(f.keywords || '')
                .split(',')
                .map((k) => k.trim().toLowerCase())
                .filter(Boolean),
        }))
      : current.faqs,
  };

  await fs.writeFile(DATA_PATH, JSON.stringify(next, null, 2), 'utf8');
  return next;
}

/** Chuẩn hóa xâu tiếng Việt không dấu để tìm kiếm từ khóa */
function normalizeText(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Bảng từ đồng nghĩa ngữ nghĩa tiếng Việt mở rộng cho từng chủ đề FAQ */
const TOPIC_SYNONYMS = [
  {
    faqMatch: /học phí|giá|chi phí|tiền/i,
    keywords: [
      'hoc phi', 'bao nhieu tien', 'gia tien', 'chi phi', 'gia ca', 'bang gia',
      'ton bao nhieu', 'mat bao nhieu', 'phi hoc', 'nhiet tien', 'gia bao nhieu',
      'dat khong', 're khong', 'bao nhieu', 'tien hoc', 'phi'
    ],
  },
  {
    faqMatch: /học thử|miễn phí/i,
    keywords: [
      'hoc thu', 'mien phi', 'free', '0d', '0 dong', 'thu nghiem', 'trai nghiem',
      'test thu', 'xem thu', 'co mat tien khong', 'hoc thu duoc khong', 'thu hoc'
    ],
  },
  {
    faqMatch: /hình thức|phương pháp|cách học/i,
    keywords: [
      'hinh thuc', 'cach hoc', 'hoc nhu the nao', 'hoc sao', 'hoc ra sao',
      'phuong phap', 'tu hoc', 'hoc online', 'hoc truc tuyen', 'video ngan',
      'hoc qua dau', 'hoc mang', 'hoc tren web', 'co giang vien khong',
      'den lop', 'offline', 'truc tiep', 'hoc o dau', 'dia diem'
    ],
  },
  {
    faqMatch: /đăng ký|tài khoản/i,
    keywords: [
      'dang ky', 'tao tai khoan', 'mo tai khoan', 'lap tai khoan', 'tao nick',
      'lap nick', 'cach dang ky', 'tham gia', 'dk', 'dang nhap', 'mo tk'
    ],
  },
  {
    faqMatch: /khóa học|dạy những gì|môn/i,
    keywords: [
      'khoa hoc', 'cac khoa', 'hoc gi', 'mon hoc', 'word', 'excel', 'powerpoint',
      'mos', 'ic3', 'tin hoc van phong', 'day nhung gi', 'day mon gi', 'mon nao',
      'cac mon', 'chuong trinh'
    ],
  },
  {
    faqMatch: /ai|chấm điểm|gợi ý/i,
    keywords: [
      'ai cham', 'cham diem', 'goi y', 'cham bai', 'ai tu van', 'cham tu dong',
      'cham sao', 'cham diem the nao', 'ai cham bai'
    ],
  },
  {
    faqMatch: /liên hệ|hotline|zalo|hỗ trợ/i,
    keywords: [
      'lien he', 'hotline', 'zalo', 'so dien thoai', 'tu van vien', 'gap nguoi',
      'ho tro', 'ad oi', 'gap ai', 'sdt', 'so dt', 'dien thoai'
    ],
  },
];

/** Bộ phân tích tri thức nội bộ & so khớp ngữ nghĩa với các FAQ do Admin cấu hình */
function matchFaq(query, faqs) {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;

  const normQuery = normalizeText(query);
  const words = normQuery.split(' ').filter((w) => w.length > 1);

  let bestMatch = null;
  let highestScore = 0;

  for (const faq of faqs) {
    let score = 0;
    const normQ = normalizeText(faq.question);

    // 1. Trùng khớp hoàn toàn câu hỏi
    if (normQuery === normQ) {
      score += 20;
    } else if (normQuery.includes(normQ) || normQ.includes(normQuery)) {
      score += 12;
    }

    // 2. Trùng từ khóa admin đã cấu hình trong FAQ
    if (Array.isArray(faq.keywords)) {
      for (const kw of faq.keywords) {
        const normKw = normalizeText(kw);
        if (normKw && normQuery.includes(normKw)) {
          score += 6;
        }
      }
    }

    // 3. So khớp bộ từ đồng nghĩa mở rộng
    for (const synGroup of TOPIC_SYNONYMS) {
      if (synGroup.faqMatch.test(faq.question)) {
        for (const kw of synGroup.keywords) {
          if (normQuery.includes(kw)) {
            score += 8;
            break;
          }
        }
      }
    }

    // 4. Đếm số từ trùng khớp (Token overlap)
    for (const w of words) {
      if (normQ.includes(w)) {
        score += 1.5;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = faq;
    }
  }

  return highestScore >= 4 ? bestMatch : null;
}

/** Tự động gợi ý 1-2 câu hỏi tiếp theo có liên quan từ tri thức Admin cấu hình */
function getRelevantSuggestions(matchedFaq, allFaqs, history = []) {
  if (!Array.isArray(allFaqs) || allFaqs.length === 0) return [];

  // Thu thập các câu hỏi đã được hỏi để không gợi ý lại
  const asked = new Set();
  if (matchedFaq) asked.add(normalizeText(matchedFaq.question));

  if (Array.isArray(history)) {
    for (const h of history) {
      if (h?.text) asked.add(normalizeText(h.text));
    }
  }

  // Bản đồ liên kết ngữ nghĩa giữa các câu hỏi phổ biến
  const relationMap = {
    // Học thử -> Đăng ký ngay, Học phí
    'faq-1': ['faq-4', 'faq-2'],
    // Học phí -> Học thử 0đ, Có những khóa nào
    'faq-2': ['faq-1', 'faq-6'],
    // Hình thức học -> AI chấm điểm, Học thử miễn phí
    'faq-3': ['faq-5', 'faq-1'],
    // Đăng ký -> Học thử miễn phí, Liên hệ tư vấn
    'faq-4': ['faq-1', 'faq-7'],
    // AI chấm điểm -> Hình thức học, Học thử
    'faq-5': ['faq-3', 'faq-1'],
    // Khóa học -> Học phí, Đăng ký học thử
    'faq-6': ['faq-2', 'faq-1'],
    // Liên hệ -> Đăng ký tài khoản, Học thử
    'faq-7': ['faq-4', 'faq-1'],
  };

  const currentId = matchedFaq?.id;
  const preferredIds = relationMap[currentId] || [];

  const candidates = [];

  // Lấy các câu hỏi ưu tiên theo bản đồ
  for (const id of preferredIds) {
    const f = allFaqs.find((item) => item.id === id);
    if (f && !asked.has(normalizeText(f.question))) {
      candidates.push(f.question);
    }
  }

  // Nếu chưa đủ 2 câu, chọn từ các FAQ khác của Admin chưa được hỏi
  if (candidates.length < 2) {
    for (const f of allFaqs) {
      if (
        f.id !== currentId &&
        !candidates.includes(f.question) &&
        !asked.has(normalizeText(f.question))
      ) {
        candidates.push(f.question);
        if (candidates.length >= 2) break;
      }
    }
  }

  // Chỉ lấy tối đa 1-2 câu ngắn gọn, không tràn lan
  return candidates.slice(0, 2);
}

/** Gọi Gemini nếu có API Key */
async function callGemini(apiKey, systemPrompt, knowledgeContext, userMessage, history = []) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

  const promptText = `
${systemPrompt}

THÔNG TIN VÀ KIẾN THỨC BẠN ĐÃ ĐƯỢC HUẤN LUYỆN:
${knowledgeContext}

YÊU CẦU:
- Trả lời bằng tiếng Việt thân thiện, súc tích, ngắn gọn (2-4 câu).
- Trọng tâm tư vấn về tự học, học phí, học thử, tính năng AI, video ngắn và cách đăng ký.
- Nếu học viên hỏi đăng ký hoặc học thử, hãy hướng dẫn bấm nút Đăng ký trên màn hình.
  `.trim();

  const contents = [
    { role: 'user', parts: [{ text: promptText }] },
    { role: 'model', parts: [{ text: 'Chào bạn, mình là Cố vấn học tập DewSkill! Mình đã sẵn sàng hỗ trợ bạn.' }] },
  ];

  // Thêm lịch sử hội thoại gần nhất
  if (Array.isArray(history)) {
    for (const h of history.slice(-4)) {
      if (h.sender === 'user') {
        contents.push({ role: 'user', parts: [{ text: h.text }] });
      } else if (h.sender === 'bot') {
        contents.push({ role: 'model', parts: [{ text: h.text }] });
      }
    }
  }

  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 400,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return reply || null;
}

/** Hàm chính xử lý câu hỏi của khách hàng */
export async function askAiConsultant(userMessage, history = []) {
  const query = String(userMessage || '').trim();
  if (!query) {
    return {
      text: 'Chào bạn! Mình có thể giúp gì cho bạn về các khóa tự học tin học tại DewSkill ạ?',
      suggestions: ['Học phí bao nhiêu?', 'Có được học thử không?', 'Cách đăng ký tài khoản?'],
    };
  }

  const [aiData, site] = await Promise.all([getAiKnowledge(), getSite()]);
  const lmsRegisterUrl = lmsLink(site.lmsUrl, 'start');

  const apiKey = aiData.apiKey || process.env.GEMINI_API_KEY || '';

  // 1. Thử gọi LLM nếu có API key
  if (apiKey) {
    try {
      const knowledgeContext = `
Trang web: ${site.brandName}
Địa chỉ LMS học thử & đăng ký: ${lmsRegisterUrl}
Hotline: ${site.hotline || 'Chưa cập nhật'}
Zalo: ${site.zaloUrl || 'Chưa cập nhật'}

CÂU HỎI THƯỜNG GẶP:
${aiData.faqs.map((f) => `- Q: ${f.question}\n  A: ${f.answer}`).join('\n')}

GHI CHÚ THÊM:
${aiData.customKnowledge || ''}
      `;

      const llmReply = await callGemini(apiKey, aiData.systemPrompt, knowledgeContext, query, history);
      if (llmReply) {
        const isRegisterQuery = /đăng ký|học thử|tài khoản|thử nghiệm/i.test(query);
        const dynamicSuggestions = getRelevantSuggestions(null, aiData.faqs || [], history);
        return {
          text: llmReply,
          actionLink: isRegisterQuery ? lmsRegisterUrl : null,
          actionLabel: isRegisterQuery ? 'Đăng ký học thử ngay ➔' : null,
          suggestions: dynamicSuggestions,
        };
      }
    } catch (err) {
      console.warn('[AI Consultant LLM fallback]', err.message);
    }
  }

  // 2. Chế độ Tri thức thông minh (Built-in Knowledge Matcher theo FAQ Admin cấu hình)
  const matched = matchFaq(query, aiData.faqs || []);

  if (matched) {
    const isRegisterQuery = /đăng ký|học thử|tài khoản|thử nghiệm/i.test(query) || /đăng ký|học thử/i.test(matched.question);
    const dynamicSuggestions = getRelevantSuggestions(matched, aiData.faqs || [], history);
    return {
      text: matched.answer,
      actionLink: isRegisterQuery ? lmsRegisterUrl : null,
      actionLabel: isRegisterQuery ? 'Đăng ký học thử miễn phí ➔' : null,
      suggestions: dynamicSuggestions,
    };
  }

  // Chào hỏi thông thường
  if (/^(chào|hello|hi|alo|chao ban|ad ơi|cho mình hỏi)/i.test(query)) {
    const dynamicSuggestions = getRelevantSuggestions(null, aiData.faqs || [], history);
    return {
      text: `Chào bạn! Mình là Cố vấn học tập DewSkill 💧. Bạn đang quan tâm đến khóa tự học nào (Word, Excel, PowerPoint...), hay muốn biết về học phí và cách học thử miễn phí ạ?`,
      suggestions: dynamicSuggestions.length > 0 ? dynamicSuggestions : ['Có được học thử miễn phí không?', 'Học phí các khóa học như thế nào?'],
    };
  }

  // Phản hồi mặc định khi câu hỏi chưa có trong tri thức
  const dynamicSuggestions = getRelevantSuggestions(null, aiData.faqs || [], history);
  return {
    text: `Cảm ơn bạn đã hỏi! Về "${query}", bạn có thể trải nghiệm trực tiếp qua cổng học thử miễn phí của DewSkill hoặc để lại số điện thoại ở cuối trang để chuyên viên hỗ trợ chi tiết nhé!`,
    actionLink: lmsRegisterUrl,
    actionLabel: 'Vào học thử miễn phí ➔',
    suggestions: dynamicSuggestions,
  };
}

