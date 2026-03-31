import { useState, useCallback } from 'react';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  pinned: boolean;
  tag?: string;
}

const TAGS = ['personal', 'work', 'ideas', 'encrypted'] as const;
export type NoteTag = typeof TAGS[number];
export const NOTE_TAGS = TAGS;

const createId = () => crypto.randomUUID();

const defaultNotes: Note[] = [
  {
    id: createId(),
    title: 'Welcome to VLTG Notes',
    content: `Your private, high-voltage notebook.\n\nEverything stays local. No tracking. No cloud sync. Just you and your thoughts at full throttle.\n\n⚡ Tips:\n- Click + to create a new note\n- Pin important notes to keep them at the top\n- Tag notes for quick filtering\n- Your data never leaves this device`,
    createdAt: new Date(),
    updatedAt: new Date(),
    pinned: true,
    tag: 'personal',
  },
  {
    id: createId(),
    title: 'Quick Ideas',
    content: 'Dump raw thoughts here. Refine later.\n\nNo judgment. No structure. Just capture.',
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000),
    pinned: false,
    tag: 'ideas',
  },
];

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('vltg-notes');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt),
        updatedAt: new Date(n.updatedAt),
      }));
    }
    return defaultNotes;
  });
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id ?? null);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const persist = useCallback((updated: Note[]) => {
    localStorage.setItem('vltg-notes', JSON.stringify(updated));
  }, []);

  const activeNote = notes.find(n => n.id === activeNoteId) ?? null;

  const filteredNotes = filterTag
    ? notes.filter(n => n.tag === filterTag)
    : notes;

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  const createNote = useCallback(() => {
    const note: Note = {
      id: createId(),
      title: 'Untitled',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      pinned: false,
    };
    const updated = [note, ...notes];
    setNotes(updated);
    setActiveNoteId(note.id);
    persist(updated);
  }, [notes, persist]);

  const updateNote = useCallback((id: string, changes: Partial<Pick<Note, 'title' | 'content' | 'pinned' | 'tag'>>) => {
    const updated = notes.map(n =>
      n.id === id ? { ...n, ...changes, updatedAt: new Date() } : n
    );
    setNotes(updated);
    persist(updated);
  }, [notes, persist]);

  const deleteNote = useCallback((id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    if (activeNoteId === id) {
      setActiveNoteId(updated[0]?.id ?? null);
    }
    persist(updated);
  }, [notes, activeNoteId, persist]);

  return {
    notes: sortedNotes,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    createNote,
    updateNote,
    deleteNote,
    filterTag,
    setFilterTag,
  };
}
