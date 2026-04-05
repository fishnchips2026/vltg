import { useState } from 'react';
import { NoteSidebar } from '@/components/NoteSidebar';
import { NoteEditor } from '@/components/NoteEditor';
import { ExportImportDialog } from '@/components/ExportImportDialog';
import { useNotes } from '@/hooks/useNotes';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    searchQuery,
    setSearchQuery,
    exportNotes,
    importNotes,
  } = useNotes();

  const [backupOpen, setBackupOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSelectNote = (id: string) => {
    setActiveNoteId(id);
    if (isMobile) setSidebarOpen(false);
  };

  const sidebarContent = (
    <NoteSidebar
      notes={notes}
      activeNoteId={activeNoteId}
      onSelectNote={handleSelectNote}
      onCreateNote={createNote}
      filterTag={filterTag}
      onFilterTag={setFilterTag}
      searchQuery={searchQuery}
      onSearchQuery={setSearchQuery}
      onBackupRestore={() => { setSidebarOpen(false); setBackupOpen(true); }}
    />
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {isMobile ? (
        <>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="p-0 w-72">
              {sidebarContent}
            </SheetContent>
          </Sheet>
        </>
      ) : (
        sidebarContent
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {isMobile && (
          <div className="flex items-center px-3 py-2 border-b border-border bg-surface-1/50">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <span className="ml-2 font-heading font-bold text-sm text-foreground">
              VLTG<span className="text-primary">.</span>notes
            </span>
          </div>
        )}
        <NoteEditor
          note={activeNote}
          onUpdate={updateNote}
          onDelete={deleteNote}
        />
      </div>

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
