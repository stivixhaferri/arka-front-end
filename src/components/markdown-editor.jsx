'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your Markdown here...',
}) {
  const insertSyntax = (syntax) => {
    onChange(value + syntax);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        <button onClick={() => insertSyntax('# Heading 1\n')}>H1</button>
        <button onClick={() => insertSyntax('## Heading 2\n')}>H2</button>
        <button onClick={() => insertSyntax('**bold text**')}>Bold</button>
        <button onClick={() => insertSyntax('_italic text_')}>Italic</button>
        <button onClick={() => insertSyntax('`inline code`')}>Code</button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-64 p-3 border rounded text-sm font-mono resize-none"
      />
      <div className="p-3 border rounded prose max-w-none overflow-auto">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
      </div>
    </div>
  );
}
