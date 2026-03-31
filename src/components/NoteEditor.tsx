import { useState, useEffect, useRef } from 'react';
import { Pin, Trash2, Tag, Shield, Zap } from 'lucide-react';
import { Note, NOTE_TAGS } from '@/hooks/useNotes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NoteEditorProps {
  note: Note | null;
  onUpdate: (id: string, changes: Partial<Pick<Note, 'title' | 'content' | 'pinned' | 'tag'>>) => void;
  onDelete: (id: string) => void;
}

const tagColors: Record<string, string> = {
  personal: 'bg-primary/20 text-primary border-primary/30',
  work: 'bg-accent/20 text-accent border-accent/30',
  ideas: 'bg-energy-glow/20 text-energy-glow border-energy-glow/30',
  encrypted: 'bg-destructive/20 text-destructive border-destructive/30',
};

export function NoteEditor({ note, onUpdate, onDelete }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showTagPicker, setShowTagPicker] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note?.id]);

  useEffect(() => {
    if (!note) return;
    const timeout = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        onUpdate(note.id, { title, content });
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [title, content]);

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background bg-grid">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Zap className="w-12 h-12 text-primary/30 mx-auto mb-4" />
          <p className="font-heading text-xl text-muted-foreground">No note selected</p>
          <p className="font-mono text-xs text-muted-foreground/60 mt-2">
            Create or select a note to start writing
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-border bg-surface-1/50">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Shield className="w-3.5 h-3.5 text-primary/60" />
          <span className="text-[10px] font-mono uppercase tracking-widest">Offline · Private</span>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setShowTagPicker(!showTagPicker)}
            >
              <Tag className="w-3.5 h-3.5" />
            </Button>
            {showTagPicker && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-md p-2 z-10 flex flex-col gap-1 min-w-[120px]">
                {NOTE_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      onUpdate(note.id, { tag: note.tag === tag ? undefined : tag });
                      setShowTagPicker(false);
                    }}
                    className={cn(
                      'px-2 py-1 rounded text-xs font-mono text-left transition-colors border',
                      note.tag === tag ? tagColors[tag] : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-surface-2'
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', note.pinned ? 'text-accent' : 'text-muted-foreground hover:text-foreground')}
            onClick={() => onUpdate(note.id, { pinned: !note.pinned })}
          >
            <Pin className={cn('w-3.5 h-3.5', note.pinned && 'rotate-45')} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(note.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-3xl w-full mx-auto">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Untitled"
          className="w-full bg-transparent font-heading text-2xl font-bold text-foreground outline-none placeholder:text-muted-foreground/40 mb-4"
        />
        <textarea
          ref={contentRef}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Start writing..."
          className="w-full bg-transparent font-mono text-sm text-foreground/80 outline-none resize-none min-h-[60vh] leading-relaxed placeholder:text-muted-foreground/30"
        />
      </div>

      {/* Status bar */}
      <div className="px-6 py-2 border-t border-border flex items-center gap-4">
        <span className="text-[10px] font-mono text-muted-foreground">
          {content.length} chars · {content.split(/\s+/).filter(Boolean).length} words
        </span>
        <span className="text-[10px] font-mono text-muted-foreground ml-auto">
          Last edited {note.updatedAt.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
