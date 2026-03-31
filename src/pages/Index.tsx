import { useState } from 'react';
import { NoteSidebar } from '@/components/NoteSidebar';
import { NoteEditor } from '@/components/NoteEditor';
import { ExportImportDialog } from '@/components/ExportImportDialog';
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
    exportNotes,
    importNotes,
  } = useNotes();

  const [backupOpen, setBackupOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <NoteSidebar
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={setActiveNoteId}
        onCreateNote={createNote}
        filterTag={filterTag}
        onFilterTag={setFilterTag}
        onBackupRestore={() => setBackupOpen(true)}
      />
      <NoteEditor
        note={activeNote}
        onUpdate={updateNote}
        onDelete={deleteNote}
      />
      <ExportImportDialog
        open={backupOpen}
        onClose={() => setBackupOpen(false)}
        onExport={exportNotes}
        onImport={importNotes}
      />
    </div>
  );
};

export default Index;
