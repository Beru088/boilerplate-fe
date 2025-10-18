'use client'

import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Link from '@tiptap/extension-link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Code,
  Quote,
  Minus,
  Strikethrough,
  Link as LinkIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import '@/styles/tiptap.css'

interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  className?: string
  disabled?: boolean
}

const RichTextEditor = ({ value = '', onChange, className, disabled = false }: RichTextEditorProps) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false
      }),
      TextStyle,
      TextAlign.configure({
        types: ['paragraph'],
        alignments: ['left', 'center', 'right']
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800'
        }
      })
    ],
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    }
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [editor, value])

  const openLinkDialog = () => {
    if (!editor) return
    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to, ' ')
    setLinkText(selectedText)
    setLinkUrl('')
    setIsLinkDialogOpen(true)
  }

  const handleAddLink = () => {
    if (!editor || !linkUrl.trim()) return

    if (linkText.trim()) {
      editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run()
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run()
    }
    setIsLinkDialogOpen(false)
    setLinkUrl('')
    setLinkText('')
  }

  const handleCancelLink = () => {
    setIsLinkDialogOpen(false)
    setLinkUrl('')
    setLinkText('')
  }

  if (!editor) {
    return null
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    children,
    disabled = false,
    tooltip
  }: {
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    disabled?: boolean
    tooltip?: string
  }) => {
    const button = (
      <Button
        type='button'
        variant='ghost'
        size='sm'
        onClick={onClick}
        disabled={disabled}
        className={cn('h-8 w-8 p-0', isActive && 'bg-accent text-accent-foreground')}
      >
        {children}
      </Button>
    )

    if (tooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      )
    }

    return button
  }

  return (
    <div className={cn('rounded-md border', className)}>
      <TooltipProvider>
        <div className='bg-muted/50 flex items-center gap-1 border-b p-2'>
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            tooltip='Undo'
          >
            <Undo className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            tooltip='Redo'
          >
            <Redo className='h-4 w-4' />
          </ToolbarButton>
          <div className='bg-border mx-1 h-4 w-px' />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            tooltip='Bold'
          >
            <Bold className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            tooltip='Italic'
          >
            <Italic className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            tooltip='Underline'
          >
            <Underline className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            tooltip='Strikethrough'
          >
            <Strikethrough className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            tooltip='Inline Code'
          >
            <Code className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton onClick={openLinkDialog} isActive={editor.isActive('link')} tooltip='Add Link'>
            <LinkIcon className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            tooltip='Bullet List'
          >
            <List className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            tooltip='Numbered List'
          >
            <ListOrdered className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            tooltip='Blockquote'
          >
            <Quote className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} tooltip='Horizontal Rule'>
            <Minus className='h-4 w-4' />
          </ToolbarButton>
          <div className='bg-border mx-1 h-4 w-px' />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            tooltip='Align Left'
          >
            <AlignLeft className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            tooltip='Align Center'
          >
            <AlignCenter className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            tooltip='Align Right'
          >
            <AlignRight className='h-4 w-4' />
          </ToolbarButton>
        </div>
      </TooltipProvider>

      <EditorContent editor={editor} className='p-3 focus:outline-none' />

      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
            <DialogDescription>Enter the URL and optional link text for your link.</DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='link-url' className='text-right'>
                URL
              </Label>
              <Input
                id='link-url'
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                placeholder='https://example.com'
                className='col-span-3'
                autoFocus
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='link-text' className='text-right'>
                Text
              </Label>
              <Input
                id='link-text'
                value={linkText}
                onChange={e => setLinkText(e.target.value)}
                placeholder='Link text (optional)'
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={handleCancelLink}>
              Cancel
            </Button>
            <Button type='button' onClick={handleAddLink} disabled={!linkUrl.trim()}>
              Add Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RichTextEditor
