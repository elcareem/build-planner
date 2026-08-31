'use client';

import { useState } from 'react';
import { SectionEditor } from '../editor/SectionEditor';
import { generateSectionApi } from '@/lib/api';

interface EditableSectionCardProps {
  title: string;
  sectionKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentContent: any;
  onUpdateSection: (updatedContent: any) => void;
  children: React.ReactNode;
  isProse?: boolean;
}

export function EditableSectionCard({
  title,
  sectionKey,
  currentContent,
  onUpdateSection,
  children,
  isProse = true,
}: EditableSectionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showRegenModal, setShowRegenModal] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to extract string content for Tiptap
  const textContent =
    typeof currentContent === 'object' && currentContent?.content
      ? currentContent.content
      : typeof currentContent === 'string'
      ? currentContent
      : '';

  function handleHtmlChange(newHtml: string) {
    if (typeof currentContent === 'object' && currentContent !== null) {
      onUpdateSection({ ...currentContent, content: newHtml });
    } else {
      onUpdateSection(newHtml);
    }
  }

  async function handleRegenerateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!instruction.trim() || isRegenerating) return;

    setError(null);
    setIsRegenerating(true);

    const result = await generateSectionApi({
      sectionKey,
      currentContent,
      instruction: instruction.trim(),
    });

    setIsRegenerating(false);

    if (result.ok) {
      onUpdateSection(result.data);
      setShowRegenModal(false);
      setInstruction('');
      setIsEditing(false);
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="relative mb-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm">
      {/* Header with Title and Action Affordances */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--color-border)]">
        <h2 className="text-xl font-bold text-[var(--color-heading)] tracking-tight">
          {title}
        </h2>

        <div className="flex items-center gap-2">
          {isProse && (
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--color-heading)] hover:border-[var(--color-teal)] hover:text-[var(--color-teal)] transition-colors"
            >
              {isEditing ? 'Done Editing' : 'Edit Section'}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setError(null);
              setShowRegenModal(!showRegenModal);
            }}
            className="rounded-lg border border-[var(--color-teal)]/30 bg-[var(--color-teal-light)]/50 px-3 py-1.5 text-xs font-medium text-[var(--color-teal)] hover:bg-[var(--color-teal)] hover:text-white transition-colors"
          >
            ✨ Regenerate
          </button>
        </div>
      </div>

      {/* Regeneration Instruction Modal / Inline Popover */}
      {showRegenModal && (
        <form
          onSubmit={handleRegenerateSubmit}
          className="mb-6 p-4 rounded-xl border border-[var(--color-teal)]/40 bg-[var(--color-teal-light)]/30 text-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[var(--color-heading)]">
              Regenerate &ldquo;{title}&rdquo; section
            </span>
            <button
              type="button"
              onClick={() => setShowRegenModal(false)}
              className="text-[var(--color-muted)] hover:text-[var(--color-heading)]"
            >
              ✕
            </button>
          </div>
          <p className="text-[var(--color-muted)] text-xs">
            Enter a prompt instruction for AI to refine just this section. Neighboring sections will not be affected.
          </p>

          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g. Make this more specific to Lagos corporate professionals"
            className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-white text-xs text-[var(--color-heading)] focus:outline-none focus:border-[var(--color-teal)]"
            disabled={isRegenerating}
          />

          {error && (
            <p className="text-xs text-red-600 font-medium">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowRegenModal(false)}
              className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-heading)]"
              disabled={isRegenerating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!instruction.trim() || isRegenerating}
              className="px-4 py-1.5 rounded-lg bg-[var(--color-teal)] text-white font-medium hover:bg-[var(--color-teal-hover)] disabled:opacity-50 transition-colors"
            >
              {isRegenerating ? 'Regenerating…' : 'Apply AI Update'}
            </button>
          </div>
        </form>
      )}

      {/* Main Section Body: Render Tiptap Editor or Normal Child Content */}
      {isEditing ? (
        <SectionEditor content={textContent} onChange={handleHtmlChange} />
      ) : (
        children
      )}
    </div>
  );
}
