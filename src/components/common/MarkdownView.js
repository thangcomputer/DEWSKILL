import React from 'react';

/** Parser Markdown đơn giản, an toàn và tối ưu SEO typography */
export default function MarkdownView({ content = '' }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let tableRows = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let listItems = [];
  let listType = null; // 'ul' | 'ol'

  function flushList() {
    if (listItems.length > 0 && listType) {
      const Tag = listType;
      elements.push(
        <Tag key={`list-${elements.length}`} className={listType === 'ul' ? 'my-4 list-disc pl-6 space-y-1.5' : 'my-4 list-decimal pl-6 space-y-1.5'}>
          {listItems.map((item, idx) => (
            <li key={idx} className="text-slate-700 leading-relaxed font-medium">
              {renderInline(item)}
            </li>
          ))}
        </Tag>
      );
      listItems = [];
      listType = null;
    }
  }

  function flushTable() {
    if (tableRows.length > 0) {
      const header = tableRows[0];
      const rows = tableRows.slice(1);
      elements.push(
        <div key={`table-${elements.length}`} className="my-6 overflow-x-auto rounded-xl border border-dew-200 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-dew-50 text-dew-900 border-b border-dew-200">
              <tr>
                {header.map((col, idx) => (
                  <th key={idx} className="p-3 font-bold">{renderInline(col)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dew-100 bg-white">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-dew-50/50">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3 text-slate-700 font-medium">{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
  }

  function renderInline(text) {
    if (!text) return null;

    // Phân tách link markdown [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <a
          key={`a-${lastIndex}`}
          href={match[2]}
          target={match[2].startsWith('http') ? '_blank' : undefined}
          rel={match[2].startsWith('http') ? 'noopener noreferrer' : undefined}
          className="font-bold text-dew-600 underline hover:text-dew-700"
        >
          {match[1]}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    // Render bold & inline code
    return parts.map((part, pIdx) => {
      if (typeof part !== 'string') return part;

      // Xử lý **bold** và `code`
      const subSegments = [];
      const boldCodeRegex = /(\*\*([^*]+)\*\*|`([^`]+)`)/g;
      let sLastIndex = 0;
      let sMatch;

      while ((sMatch = boldCodeRegex.exec(part)) !== null) {
        if (sMatch.index > sLastIndex) {
          subSegments.push(part.substring(sLastIndex, sMatch.index));
        }
        if (sMatch[2]) {
          subSegments.push(<strong key={`b-${pIdx}-${sLastIndex}`} className="font-extrabold text-ink">{sMatch[2]}</strong>);
        } else if (sMatch[3]) {
          subSegments.push(
            <code key={`c-${pIdx}-${sLastIndex}`} className="rounded bg-dew-100 px-1.5 py-0.5 text-xs font-mono font-bold text-dew-800">
              {sMatch[3]}
            </code>
          );
        }
        sLastIndex = sMatch.index + sMatch[0].length;
      }
      if (sLastIndex < part.length) {
        subSegments.push(part.substring(sLastIndex));
      }
      return <React.Fragment key={pIdx}>{subSegments}</React.Fragment>;
    });
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Code fence
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${elements.length}`} className="my-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs font-mono text-emerald-300">
            <code>{codeBuffer.join('\n')}</code>
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        flushList();
        flushTable();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    // Table row: | col | col |
    if (line.startsWith('|') && line.endsWith('|')) {
      flushList();
      // Bỏ qua separator |---|---|
      if (line.includes('---')) continue;
      const cols = line.split('|').slice(1, -1).map((s) => s.trim());
      tableRows.push(cols);
      continue;
    } else {
      flushTable();
    }

    // Bullet list: - or *
    if (/^[-*]\s+/.test(line)) {
      if (listType !== 'ul') flushList();
      listType = 'ul';
      listItems.push(line.replace(/^[-*]\s+/, ''));
      continue;
    }

    // Numbered list: 1.
    if (/^\d+\.\s+/.test(line)) {
      if (listType !== 'ol') flushList();
      listType = 'ol';
      listItems.push(line.replace(/^\d+\.\s+/, ''));
      continue;
    }

    flushList();

    // Empty line
    if (!line) {
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="mt-8 mb-4 text-2xl font-black text-ink sm:text-3xl">{renderInline(line.slice(2))}</h1>);
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="mt-8 mb-3 flex items-center gap-2 border-b border-dew-100 pb-2 text-xl font-black text-dew-900 sm:text-2xl">
          <span className="h-6 w-1.5 rounded-full bg-dew-500"></span>
          {renderInline(line.slice(3))}
        </h2>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="mt-6 mb-2 text-lg font-extrabold text-ink">{renderInline(line.slice(4))}</h3>);
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="my-4 rounded-xl border-l-4 border-amber-400 bg-amber-50/70 p-4 text-sm font-semibold text-amber-900">
          {renderInline(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    // HR
    if (line === '---' || line === '***') {
      elements.push(<hr key={i} className="my-6 border-dew-100" />);
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="my-3 text-base leading-relaxed text-slate-700 font-medium">
        {renderInline(line)}
      </p>
    );
  }

  flushList();
  flushTable();

  return <div className="seo-article-content space-y-2">{elements}</div>;
}
