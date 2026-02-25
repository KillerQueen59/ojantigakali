'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import {
  Bold, Italic, Strikethrough, Code, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Undo, Redo,
  Link as LinkIcon, ImageIcon, Upload, Globe,
} from 'lucide-react'

interface Props {
  content: string
  onChange: (html: string) => void
}

export default function TiptapEditor({ content, onChange }: Props) {
  const fileInputRef  = useRef<HTMLInputElement>(null)
  const imgPanelRef  = useRef<HTMLDivElement>(null)
  const [imgPanel, setImgPanel] = useState(false)
  const [imgUrl, setImgUrl]     = useState('')

  // ── insert helpers ──────────────────────────────────────────────────
  const insertFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      editor?.chain().focus().setImage({ src }).run()
    }
    reader.readAsDataURL(file)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const insertUrl = useCallback(() => {
    const src = imgUrl.trim()
    if (!src) return
    editor?.chain().focus().setImage({ src }).run()
    setImgUrl('')
    setImgPanel(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgUrl])

  // ── editor ──────────────────────────────────────────────────────────
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Placeholder.configure({ placeholder: 'Write something thoughtful…' }),
      Image.configure({ inline: false, allowBase64: true, HTMLAttributes: { class: 'editor-img' } }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'tiptap-editor' },
      handleDrop(_, event) {
        const files = event.dataTransfer?.files
        if (!files?.length) return false
        const file = files[0]
        if (!file.type.startsWith('image/')) return false
        event.preventDefault()
        insertFile(file)
        return true
      },
      handlePaste(_, event) {
        const items = event.clipboardData?.items
        if (!items) return false
        for (const item of Array.from(items)) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile()
            if (file) { event.preventDefault(); insertFile(file); return true }
          }
        }
        return false
      },
    },
  })

  // close img panel on outside click
  useEffect(() => {
    if (!imgPanel) return
    const handler = (e: MouseEvent) => {
      if (imgPanelRef.current && !imgPanelRef.current.contains(e.target as Node)) {
        setImgPanel(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [imgPanel])

  if (!editor) return null

  // ── toolbar helpers ─────────────────────────────────────────────────
  const btn = (active: boolean, onClick: () => void, title: string, icon: React.ReactNode) => (
    <button
      key={title}
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      title={title}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 30, height: 30, borderRadius: 6, border: 'none',
        background: active ? 'var(--icon-accent)' : 'none',
        color: active ? '#fff' : 'var(--window-text)',
        cursor: 'pointer', opacity: active ? 1 : 0.75,
        transition: 'background 0.15s',
      }}
    >
      {icon}
    </button>
  )

  const sep = () => (
    <div style={{ width: 1, background: 'var(--window-titlebar-border)', margin: '2px 4px', alignSelf: 'stretch' }} />
  )

  const setLink = () => {
    const prev = editor.getAttributes('link').href ?? ''
    const url = window.prompt('URL', prev)
    if (url === null) return
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div style={{ border: '1px solid var(--window-titlebar-border)', borderRadius: 10, overflow: 'visible', background: 'var(--window-bg)' }}>

      {/* ── Toolbar ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2,
        padding: '8px 10px',
        borderBottom: '1px solid var(--window-titlebar-border)',
        background: 'var(--window-titlebar)',
        borderRadius: '10px 10px 0 0',
      }}>
        {btn(editor.isActive('bold'),        () => editor.chain().focus().toggleBold().run(),        'Bold',          <Bold size={13} />)}
        {btn(editor.isActive('italic'),      () => editor.chain().focus().toggleItalic().run(),      'Italic',        <Italic size={13} />)}
        {btn(editor.isActive('strike'),      () => editor.chain().focus().toggleStrike().run(),      'Strikethrough', <Strikethrough size={13} />)}
        {btn(editor.isActive('code'),        () => editor.chain().focus().toggleCode().run(),        'Inline code',   <Code size={13} />)}
        {sep()}
        {btn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'Heading 2', <Heading2 size={13} />)}
        {btn(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'Heading 3', <Heading3 size={13} />)}
        {sep()}
        {btn(editor.isActive('bulletList'),  () => editor.chain().focus().toggleBulletList().run(),  'Bullet list',   <List size={13} />)}
        {btn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), 'Ordered list',  <ListOrdered size={13} />)}
        {btn(editor.isActive('blockquote'),  () => editor.chain().focus().toggleBlockquote().run(),  'Blockquote',    <Quote size={13} />)}
        {btn(false, () => editor.chain().focus().setHorizontalRule().run(), 'Divider', <Minus size={13} />)}
        {sep()}
        {btn(editor.isActive('link'), setLink, 'Link', <LinkIcon size={13} />)}

        {/* ── Image button + panel ── */}
        <div ref={imgPanelRef} style={{ position: 'relative' }}>
          <button
            onMouseDown={(e) => { e.preventDefault(); setImgPanel((v) => !v) }}
            title="Insert image"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 30, height: 30, borderRadius: 6, border: 'none',
              background: imgPanel ? 'var(--icon-accent)' : 'none',
              color: imgPanel ? '#fff' : 'var(--window-text)',
              cursor: 'pointer', opacity: 0.85, transition: 'background 0.15s',
            }}
          >
            <ImageIcon size={13} />
          </button>

          {imgPanel && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: '50%',
              transform: 'translateX(-50%)',
              width: 260,
              background: 'var(--window-bg)',
              border: '1px solid var(--window-titlebar-border)',
              borderRadius: 10,
              boxShadow: '0 8px 32px var(--window-shadow)',
              padding: 14,
              zIndex: 9999,
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              {/* Upload from device */}
              <button
                onMouseDown={(e) => { e.preventDefault(); fileInputRef.current?.click() }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 12px', borderRadius: 8, border: 'none',
                  background: 'var(--window-titlebar)',
                  color: 'var(--window-text)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%',
                }}
              >
                <Upload size={14} style={{ color: 'var(--icon-accent)' }} />
                Upload from device
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--window-titlebar-border)' }} />
                <span style={{ fontSize: 11, color: 'var(--window-text-muted)' }}>or URL</span>
                <div style={{ flex: 1, height: 1, background: 'var(--window-titlebar-border)' }} />
              </div>

              {/* From URL */}
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Globe size={12} style={{
                    position: 'absolute', left: 9, top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--window-text-muted)', pointerEvents: 'none',
                  }} />
                  <input
                    value={imgUrl}
                    onChange={(e) => setImgUrl(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); insertUrl() } }}
                    placeholder="https://..."
                    style={{
                      width: '100%', padding: '8px 10px 8px 28px',
                      borderRadius: 7,
                      border: '1px solid var(--window-titlebar-border)',
                      background: 'var(--window-titlebar)',
                      color: 'var(--window-text)',
                      fontSize: 12, fontFamily: 'inherit', outline: 'none',
                    }}
                  />
                </div>
                <button
                  onMouseDown={(e) => { e.preventDefault(); insertUrl() }}
                  style={{
                    padding: '8px 12px', borderRadius: 7, border: 'none',
                    background: 'var(--icon-accent)', color: '#fff',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  Insert
                </button>
              </div>

              <p style={{ fontSize: 11, color: 'var(--window-text-muted)', lineHeight: 1.5 }}>
                You can also <strong>paste</strong> or <strong>drag & drop</strong> an image directly into the editor.
              </p>
            </div>
          )}
        </div>

        <div style={{ flex: 1 }} />
        {btn(!editor.can().undo(), () => editor.chain().focus().undo().run(), 'Undo', <Undo size={13} />)}
        {btn(!editor.can().redo(), () => editor.chain().focus().redo().run(), 'Redo', <Redo size={13} />)}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) { insertFile(file); setImgPanel(false) }
          e.target.value = ''
        }}
      />

      {/* Editor area */}
      <div style={{ padding: '16px 20px', minHeight: 320 }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
