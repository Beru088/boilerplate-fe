'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { FontSize } from '@tiptap/extension-font-size'
import { Button } from '@/components/ui/button'
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
  Heading1,
  Heading2,
  Heading3,
  Code,
  Quote,
  Minus,
  Strikethrough
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import '@/styles/tiptap.css'

interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  className?: string
  disabled?: boolean
}

const RichTextEditor = ({ value = '', onChange, className, disabled = false }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      TextStyle,
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right']
      })
    ],
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    }
  })

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

          <div className='flex items-center gap-1'>
            <Select
              value={editor.getAttributes('textStyle').fontSize || '16px'}
              onValueChange={value => editor.chain().focus().setFontSize(value).run()}
            >
              <SelectTrigger className='h-8 w-20'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='12px'>12px</SelectItem>
                <SelectItem value='14px'>14px</SelectItem>
                <SelectItem value='16px'>16px</SelectItem>
                <SelectItem value='18px'>18px</SelectItem>
                <SelectItem value='20px'>20px</SelectItem>
                <SelectItem value='24px'>24px</SelectItem>
                <SelectItem value='28px'>28px</SelectItem>
                <SelectItem value='32px'>32px</SelectItem>
              </SelectContent>
            </Select>
          </div>

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

          <div className='bg-border mx-1 h-4 w-px' />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            tooltip='Heading 1'
          >
            <Heading1 className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            tooltip='Heading 2'
          >
            <Heading2 className='h-4 w-4' />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            tooltip='Heading 3'
          >
            <Heading3 className='h-4 w-4' />
          </ToolbarButton>

          <div className='bg-border mx-1 h-4 w-px' />

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
    </div>
  )
}

export default RichTextEditor
