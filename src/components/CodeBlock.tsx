import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  output?: string;
}

export default function CodeBlock({ code, language = 'python', showLineNumbers = true, output }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  const lines = code.split('\n');

  // Minimal syntax highlighting using regex
  const highlight = (line: string, lang: string): string => {
    const keywords: Record<string, string[]> = {
      python: ['def', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'and', 'or', 'not',
        'True', 'False', 'None', 'import', 'from', 'class', 'try', 'except', 'with', 'as',
        'break', 'continue', 'pass', 'lambda', 'yield', 'global', 'nonlocal', 'del', 'raise',
        'print', 'len', 'range', 'type', 'int', 'str', 'float', 'bool', 'list', 'dict', 'set'],
      java: ['public', 'private', 'protected', 'static', 'void', 'int', 'double', 'float',
        'boolean', 'char', 'String', 'class', 'new', 'return', 'if', 'else', 'for', 'while',
        'do', 'switch', 'case', 'break', 'continue', 'import', 'extends', 'implements',
        'interface', 'abstract', 'final', 'this', 'super', 'null', 'true', 'false'],
      cpp: ['int', 'double', 'float', 'char', 'bool', 'void', 'const', 'return', 'if', 'else',
        'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'include', 'using',
        'namespace', 'class', 'struct', 'new', 'delete', 'nullptr', 'true', 'false',
        'cout', 'cin', 'endl', 'std'],
      javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
        'do', 'switch', 'case', 'break', 'continue', 'class', 'new', 'this', 'import',
        'export', 'default', 'from', 'async', 'await', 'true', 'false', 'null', 'undefined',
        'typeof', 'instanceof', 'console', 'document', 'window'],
      sql: ['SELECT', 'FROM', 'WHERE', 'ORDER', 'BY', 'GROUP', 'HAVING', 'JOIN', 'INNER',
        'LEFT', 'RIGHT', 'ON', 'AS', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'IS', 'NULL',
        'DISTINCT', 'LIMIT', 'OFFSET', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'INSERT',
        'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ASC', 'DESC'],
    };

    const kws = keywords[lang] || keywords['python'];

    // Escape HTML first
    let result = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Comments
    if (lang === 'python' && result.includes('#')) {
      const idx = result.indexOf('#');
      return (
        result.substring(0, idx) +
        `<span style="color:#6A9955">${result.substring(idx)}</span>`
      );
    }
    if ((lang === 'java' || lang === 'cpp' || lang === 'javascript') && result.includes('//')) {
      const idx = result.indexOf('//');
      return (
        result.substring(0, idx) +
        `<span style="color:#6A9955">${result.substring(idx)}</span>`
      );
    }

    // Strings
    result = result.replace(
      /(["'`])((?:(?!\1)[^\\]|\\.)*)(\1)/g,
      '<span style="color:#CE9178">$1$2$3</span>'
    );

    // Numbers
    result = result.replace(
      /\b(\d+(?:\.\d+)?)\b/g,
      '<span style="color:#B5CEA8">$1</span>'
    );

    // Keywords
    kws.forEach((kw) => {
      const re = new RegExp(`\\b(${kw})\\b`, 'g');
      result = result.replace(re, '<span style="color:#569CD6">$1</span>');
    });

    return result;
  };

  return (
    <div className="code-block">
      {/* Header */}
      <div className="code-block-header">
        <span style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {language}
        </span>
        <button
          onClick={handleCopy}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: copied ? '#4ADE80' : '#94A3B8',
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 12, padding: '2px 8px', borderRadius: 4,
            transition: 'color 0.2s',
          }}
          aria-label="Copy code"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code */}
      <div style={{ background: '#1E293B', padding: '16px', overflowX: 'auto' }}>
        <table style={{ borderSpacing: 0, width: '100%' }}>
          <tbody>
            {lines.map((line, i) => (
              <tr key={i}>
                {showLineNumbers && (
                  <td style={{
                    color: '#4A5568', fontSize: 13, paddingRight: 16,
                    userSelect: 'none', textAlign: 'right', verticalAlign: 'top',
                    fontFamily: 'JetBrains Mono, monospace',
                    whiteSpace: 'nowrap', minWidth: 32,
                  }}>
                    {i + 1}
                  </td>
                )}
                <td style={{ width: '100%' }}>
                  <code
                    style={{ fontSize: 13, color: '#E2E8F0', whiteSpace: 'pre', display: 'block' }}
                    dangerouslySetInnerHTML={{ __html: highlight(line, language) + '\n' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Output */}
      {output && (
        <div style={{ background: '#0F172A', borderTop: '1px solid #334155', padding: '12px 16px' }}>
          <div style={{ color: '#64748B', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
            Output
          </div>
          <pre style={{ color: '#4ADE80', fontSize: 13, margin: 0, fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'pre-wrap' }}>
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
