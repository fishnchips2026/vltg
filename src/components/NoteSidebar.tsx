import { Plus, Pin, Shield, Zap, HardDrive } from 'lucide-react';
import { Note, NOTE_TAGS } from '@/hooks/useNotes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface NoteSidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  filterTag: string | null;
  onFilterTag: (tag: string | null) => void;
  onBackupRestore: () => void;
}

const tagColors: Record<string, string> = {
  personal: 'bg-primary/20 text-primary',
  work: 'bg-accent/20 text-accent',
  ideas: 'bg-energy-glow/20 text-energy-glow',
  encrypted: 'bg-destructive/20 text-destructive',
};

export function NoteSidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  filterTag,
  onFilterTag,
  onBackupRestore,
}: NoteSidebarProps) {
  return (
    <div className="w-72 h-full flex flex-col border-r border-border bg-sidebar">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-primary" />
          <h1 className="font-heading font-bold text-lg text-foreground tracking-tight">
            VLTG<span className="text-primary">.</span>notes
          </h1>
          <div className="ml-auto flex items-center gap-1 text-muted-foreground">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono uppercase tracking-widest">Local</span>
          </div>
        </div>

        <Button variant="energy" size="sm" className="w-full font-mono text-xs" onClick={onCreateNote}>
          <Plus className="w-3.5 h-3.5" />
          New Note
        </Button>
      </div>

      {/* Tag filters */}
      <div className="px-4 py-3 flex gap-1.5 flex-wrap border-b border-border">
        <button
          onClick={() => onFilterTag(null)}
          className={cn(
            'px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider transition-colors',
            !filterTag ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          All
        </button>
        {NOTE_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => onFilterTag(filterTag === tag ? null : tag)}
            className={cn(
              'px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider transition-colors',
              filterTag === tag ? tagColors[tag] : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {notes.map(note => (
            <motion.button
              key={note.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => onSelectNote(note.id)}
              className={cn(
                'w-full text-left px-4 py-3 border-b border-border transition-colors group',
                activeNoteId === note.id
                  ? 'bg-surface-2 border-l-2 border-l-primary'
                  : 'hover:bg-surface-2/50 border-l-2 border-l-transparent'
              )}
            >
              <div className="flex items-center gap-1.5">
                {note.pinned && <Pin className="w-3 h-3 text-accent rotate-45" />}
                <span className="font-heading font-medium text-sm text-foreground truncate">
                  {note.title}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1 font-mono">
                {note.content.slice(0, 60) || 'Empty note'}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] text-muted-foreground font-mono">
                  {note.updatedAt.toLocaleDateString()}
                </span>
                {note.tag && (
                  <span className={cn('text-[9px] px-1.5 py-0.5 rounded font-mono uppercase', tagColors[note.tag])}>
                    {note.tag}
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border flex items-center justify-between">
        <p className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">
          ⚡ {notes.length} notes
        </p>
        <button
          onClick={onBackupRestore}
          className="text-muted-foreground hover:text-primary transition-colors"
          title="Backup & Restore"
        >
          <HardDrive className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
