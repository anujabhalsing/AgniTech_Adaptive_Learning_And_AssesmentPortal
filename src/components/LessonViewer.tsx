import React, { useState } from 'react';
import { CheckCircle2, BookOpen, ChevronRight, AlertTriangle, Target, Info } from 'lucide-react';
import { Lesson, Topic } from '../types';
import { useApp } from '../context/AppContext';
import CodeBlock from './CodeBlock';

interface LessonViewerProps {
  lesson: Lesson;
  topic: Topic;
  onComplete: () => void;
  onStartQuiz: () => void;
}

export default function LessonViewer({ lesson, topic, onComplete, onStartQuiz }: LessonViewerProps) {
  const { state, completeLesson } = useApp();
  const { user } = state;
  const isCompleted = user.completedTopics.includes(topic.id);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleComplete = () => {
    if (!isCompleted) {
      completeLesson(topic.id, topic.xpReward);
    }
    onComplete();
  };

  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    return text.split('\n\n').map((block, i) => {
      if (block.startsWith('**') && block.endsWith('**')) {
        return <strong key={i}>{block.slice(2, -2)}</strong>;
      }

      // Handle inline bold
      const parts = block.split(/(\*\*[^*]+\*\*)/g);
      const rendered = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={j} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '1px 6px', borderRadius: 4, fontSize: '0.9em', fontFamily: 'JetBrains Mono, monospace' }}>{part.slice(1, -1)}</code>;
        }
        return part;
      });

      // Lists
      if (block.includes('\n-')) {
        const lines = block.split('\n');
        return (
          <div key={i} style={{ marginBottom: 12 }}>
            {lines.map((line, li) => {
              if (line.startsWith('- ')) {
                return (
                  <div key={li} style={{ display: 'flex', gap: 8, marginBottom: 4, paddingLeft: 8 }}>
                    <span style={{ color: 'var(--primary)', marginTop: 2 }}>•</span>
                    <span style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{renderInline(line.slice(2))}</span>
                  </div>
                );
              }
              return <p key={li} style={{ margin: 0, fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.7 }}>{renderInline(line)}</p>;
            })}
          </div>
        );
      }

      return (
        <p key={i} style={{ marginBottom: 12, fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {rendered}
        </p>
      );
    });
  };

  const renderInline = (text: string) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '1px 5px', borderRadius: 3, fontSize: '0.9em', fontFamily: 'JetBrains Mono, monospace' }}>{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="animate-fadeIn" style={{ maxWidth: 760 }}>
      {/* Header */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <span className={`badge badge-${topic.difficulty}`}>{topic.difficulty}</span>
          <span className="badge" style={{ color: 'var(--text-muted)', background: 'var(--bg)', borderColor: 'var(--border)' }}>
            ~{topic.estimatedMinutes} min
          </span>
          {lesson.aiGenerated && (
            <span className="badge" style={{ color: '#7C3AED', background: '#F5F3FF', borderColor: '#DDD6FE' }}>
              AI-generated content
            </span>
          )}
          {isCompleted && (
            <span className="badge badge-mastered">
              <CheckCircle2 size={11} style={{ marginRight: 3 }} /> Completed
            </span>
          )}
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
          {lesson.title}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 16 }}>
          {topic.description}
        </p>

        {/* Learning objectives */}
        <div style={{ background: 'rgba(79,70,229,0.04)', border: '1px solid rgba(79,70,229,0.12)', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Target size={15} color="var(--primary)" />
            <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--primary)' }}>Learning Objectives</span>
          </div>
          {topic.objectives.map((obj, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
              <CheckCircle2 size={14} color="var(--primary)" style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{obj}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <BookOpen size={18} color="var(--primary)" />
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>Explanation</h2>
        </div>
        <div>{renderContent(lesson.content)}</div>
      </div>

      {/* Code example */}
      {lesson.codeExample && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 16 }}>💻</span>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>Code Example</h2>
          </div>
          <CodeBlock
            code={lesson.codeExample}
            language={lesson.language || 'python'}
            output={lesson.output}
          />
        </div>
      )}

      {/* Key points */}
      {lesson.keyPoints.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Info size={18} color="#7C3AED" />
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>Key Points</h2>
          </div>
          {lesson.keyPoints.map((point, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
              <span style={{
                background: 'rgba(124,58,237,0.1)', color: '#7C3AED',
                borderRadius: '50%', width: 22, height: 22, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, marginTop: 2,
              }}>
                {i + 1}
              </span>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{renderInline(point)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Common mistakes */}
      {lesson.commonMistakes.length > 0 && (
        <div className="card" style={{ marginBottom: 16, borderColor: 'rgba(217,119,6,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <AlertTriangle size={18} color="var(--warning)" />
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>Common Mistakes</h2>
          </div>
          {lesson.commonMistakes.map((mistake, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--warning)', fontSize: 16, flexShrink: 0 }}>⚠</span>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{renderInline(mistake)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          className="btn btn-primary btn-lg"
          style={{ flex: 1, minWidth: 200 }}
          onClick={handleComplete}
        >
          {isCompleted ? 'Continue' : `Mark Complete · +${topic.xpReward} XP`}
          <ChevronRight size={18} />
        </button>
        <button
          className="btn btn-secondary btn-lg"
          style={{ flex: 1, minWidth: 200 }}
          onClick={onStartQuiz}
        >
          Test My Knowledge →
        </button>
      </div>
    </div>
  );
}
