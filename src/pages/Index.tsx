import { NoteSidebar } from '@/components/NoteSidebar';
import { NoteEditor } from '@/components/NoteEditor';
import { useNotes } from '@/hooks/useNotes';

const Index = () => {
  const {
    notes,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    createNote,
    updateNote,
    deleteNote,
    filterTag,
    setFilterTag,
  } = useNotes();

  return (
    <div className="flex h-screen overflow-hidden">
      <NoteSidebar
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={setActiveNoteId}
        onCreateNote={createNote}
        filterTag={filterTag}
        onFilterTag={setFilterTag}
      />
      <NoteEditor
        note={activeNote}
        onUpdate={updateNote}
        onDelete={deleteNote}
      />
    </div>
  );
};

export default Index;
