'use client'

import React, { useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Eraser,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo
} from 'lucide-react'

export interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  placeholder?: string
  className?: string
  minHeightClass?: string
}

export function RichTextEditor({
  value,
  onChange,
  label,
  error,
  placeholder = 'Tulis konten artikel... tambahkan heading, list, atau gambar.',
  className,
  minHeightClass = 'min-h-[320px]'
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        bulletList: { keepMarks: true, keepAttributes: true },
        orderedList: { keepMarks: true, keepAttributes: true }
      }),
      Underline,
      Link.configure({
        autolink: true,
        openOnClick: false,
        linkOnPaste: true
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: { class: 'rounded-lg border border-muted/40 mx-auto my-4' }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Placeholder.configure({
        placeholder
      })
    ],
    content: value || '<p></p>',
    editorProps: {
      attributes: {
        // KITA GUNAKAN STYLE MANUAL (Arbitrary Variants)
        // Ini memaksa style muncul meskipun plugin typography tidak aktif
        class: cn(
          'w-full bg-background focus:outline-none p-4 rounded-b-lg text-foreground leading-7 text-sm',

          // Style untuk Heading H2
          '[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-4 [&_h2]:leading-tight',

          // Style untuk Heading H3
          '[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-3',

          // Style untuk Bullet List (UL)
          '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-4',

          // Style untuk Numbered List (OL)
          '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-4',

          // Style untuk List Item (LI)
          '[&_li]:my-1.5 [&_li]:leading-normal',

          // Style untuk Paragraf
          '[&_p]:my-3',

          // Style untuk Bold & Italic
          '[&_strong]:font-bold [&_strong]:text-foreground',
          '[&_em]:italic',

          // Style untuk Blockquote
          '[&_blockquote]:border-l-4 [&_blockquote]:border-primary/50 [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:bg-muted/10',

          // Style untuk Code Block
          '[&_code]:bg-muted [&_code]:rounded-sm [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs',
          '[&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0',

          // Style untuk Link
          '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:font-medium',

          // Style untuk Gambar
          '[&_img]:rounded-md [&_img]:border [&_img]:border-muted [&_img]:mx-auto [&_img]:my-4',

          minHeightClass
        )
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (value !== current) {
      editor.commands.setContent(value || '<p></p>', false)
    }
  }, [editor, value])

  const handleInsertImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt('Masukkan URL gambar (https://...)')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const handleInsertLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Masukkan URL', previousUrl || 'https://')

    if (url === null) return
    if (url === '') {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const onToggle = useCallback(
    (action: () => void) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      action()
    },
    []
  )

  if (!editor) return null

  return (
    <div className={cn('space-y-2', className)}>
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="flex flex-wrap gap-1 border-b bg-muted/40 px-2 py-2">
          <ToolbarButton
            icon={Bold}
            label="Bold"
            active={editor.isActive('bold')}
            onClick={onToggle(() => editor.chain().focus().toggleBold().run())}
            disabled={!editor.can().chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            icon={Italic}
            label="Italic"
            active={editor.isActive('italic')}
            onClick={onToggle(() => editor.chain().focus().toggleItalic().run())}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            icon={UnderlineIcon}
            label="Underline"
            active={editor.isActive('underline')}
            onClick={onToggle(() => editor.chain().focus().toggleUnderline().run())}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
          />
          <ToolbarButton
            icon={Strikethrough}
            label="Strikethrough"
            active={editor.isActive('strike')}
            onClick={onToggle(() => editor.chain().focus().toggleStrike().run())}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
          />
          <ToolbarSeparator />
          <ToolbarButton
            icon={Heading2}
            label="Heading 2"
            active={editor.isActive('heading', { level: 2 })}
            onClick={onToggle(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
            disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
          />
          <ToolbarButton
            icon={Heading3}
            label="Heading 3"
            active={editor.isActive('heading', { level: 3 })}
            onClick={onToggle(() => editor.chain().focus().toggleHeading({ level: 3 }).run())}
            disabled={!editor.can().chain().focus().toggleHeading({ level: 3 }).run()}
          />
          <ToolbarSeparator />
          <ToolbarButton
            icon={List}
            label="Bullet List"
            active={editor.isActive('bulletList')}
            onClick={onToggle(() => editor.chain().focus().toggleBulletList().run())}
            disabled={!editor.can().chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            icon={ListOrdered}
            label="Numbered List"
            active={editor.isActive('orderedList')}
            onClick={onToggle(() => editor.chain().focus().toggleOrderedList().run())}
            disabled={!editor.can().chain().focus().toggleOrderedList().run()}
          />
          <ToolbarButton
            icon={Quote}
            label="Quote"
            active={editor.isActive('blockquote')}
            onClick={onToggle(() => editor.chain().focus().toggleBlockquote().run())}
            disabled={!editor.can().chain().focus().toggleBlockquote().run()}
          />
          <ToolbarButton
            icon={Minus}
            label="Horizontal Rule"
            onClick={onToggle(() => editor.chain().focus().setHorizontalRule().run())}
            disabled={!editor.can().chain().focus().setHorizontalRule().run()}
          />
          <ToolbarButton
            icon={Code}
            label="Code Block"
            active={editor.isActive('codeBlock')}
            onClick={onToggle(() => editor.chain().focus().toggleCodeBlock().run())}
            disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
          />
          <ToolbarSeparator />
          <ToolbarButton
            icon={AlignLeft}
            label="Align Left"
            active={editor.isActive({ textAlign: 'left' })}
            onClick={onToggle(() => editor.chain().focus().setTextAlign('left').run())}
            disabled={!editor.can().chain().focus().setTextAlign('left').run()}
          />
          <ToolbarButton
            icon={AlignCenter}
            label="Align Center"
            active={editor.isActive({ textAlign: 'center' })}
            onClick={onToggle(() => editor.chain().focus().setTextAlign('center').run())}
            disabled={!editor.can().chain().focus().setTextAlign('center').run()}
          />
          <ToolbarButton
            icon={AlignRight}
            label="Align Right"
            active={editor.isActive({ textAlign: 'right' })}
            onClick={onToggle(() => editor.chain().focus().setTextAlign('right').run())}
            disabled={!editor.can().chain().focus().setTextAlign('right').run()}
          />
          <ToolbarButton
            icon={AlignJustify}
            label="Justify"
            active={editor.isActive({ textAlign: 'justify' })}
            onClick={onToggle(() => editor.chain().focus().setTextAlign('justify').run())}
            disabled={!editor.can().chain().focus().setTextAlign('justify').run()}
          />
          <ToolbarSeparator />
          <ToolbarButton
            icon={ImageIcon}
            label="Gambar"
            onClick={onToggle(() => {
              handleInsertImage()
            })}
          />
          <ToolbarButton
            icon={LinkIcon}
            label="Link"
            active={editor.isActive('link')}
            onClick={onToggle(() => {
              handleInsertLink()
            })}
          />
          <ToolbarSeparator />
          <ToolbarButton icon={Undo} label="Undo" onClick={onToggle(() => editor.chain().focus().undo().run())} disabled={!editor.can().undo()} />
          <ToolbarButton icon={Redo} label="Redo" onClick={onToggle(() => editor.chain().focus().redo().run())} disabled={!editor.can().redo()} />
          <ToolbarButton
            icon={Eraser}
            label="Clear"
            onClick={onToggle(() => editor.chain().focus().clearNodes().unsetAllMarks().run())}
            disabled={!editor.can().chain().focus().clearNodes().unsetAllMarks().run()}
          />
        </div>
        <EditorContent editor={editor} className="rounded-b-lg" />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

interface ToolbarButtonProps {
  icon: React.ElementType
  label: string
  active?: boolean
  disabled?: boolean
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

function ToolbarButton({ icon: Icon, label, active = false, disabled = false, onClick }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className={cn('h-8 w-8', active && 'bg-primary/10 text-primary')}
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}

function ToolbarSeparator() {
  return <div className="mx-1 h-6 w-px bg-border" />
}
