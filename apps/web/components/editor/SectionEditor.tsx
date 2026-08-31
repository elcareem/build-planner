'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface SectionEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function SectionEditor({ content, onChange }: SectionEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose max-w-none text-sm text-[var(--color-heading)] leading-relaxed focus:outline-none min-h-[140px] p-4 bg-[var(--color-surface)] rounded-b-xl',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-[var(--color-teal)]/40 rounded-xl overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 bg-[var(--color-teal-light)]/50 border-b border-[var(--color-border)] text-xs">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded font-bold transition-colors ${
            editor.isActive('bold')
              ? 'bg-[var(--color-teal)] text-white'
              : 'text-[var(--color-heading)] hover:bg-[var(--color-teal)]/10'
          }`}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded italic transition-colors ${
            editor.isActive('italic')
              ? 'bg-[var(--color-teal)] text-white'
              : 'text-[var(--color-heading)] hover:bg-[var(--color-teal)]/10'
          }`}
          title="Italic"
        >
          I
        </button>
        <div className="w-[1px] h-4 bg-[var(--color-border)] mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-[var(--color-teal)] text-white'
              : 'text-[var(--color-heading)] hover:bg-[var(--color-teal)]/10'
          }`}
          title="Bullet List"
        >
          • Bullet List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-[var(--color-teal)] text-white'
              : 'text-[var(--color-heading)] hover:bg-[var(--color-teal)]/10'
          }`}
          title="Numbered List"
        >
          1. Numbered List
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
