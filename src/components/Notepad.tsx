import { useState, useEffect, FC } from 'react';
import { Save, Trash2, PenLine, Plus, Loader2 } from 'lucide-react';

interface Note {
  id: number;
  content: string;
  timestamp: string;
}

interface NoteCardProps {
  note: Note;
  onDelete: (id: number) => void;
  onUpdate: (id: number, content: string) => void;
}

export default function Notepad() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote }),
      });
      
      if (res.ok) {
        setNewNote('');
        setIsAdding(false);
        fetchNotes();
      }
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const deleteNote = async (id: number) => {
    if (!confirm('Radera anteckning?')) return;

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setNotes(notes.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const updateNote = async (id: number, content: string) => {
    try {
      await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      // Optimistic update or refetch? Refetch is safer for timestamp.
      // But for typing speed, maybe just local state update.
      // Let's just update local state and debounce the API call if we were doing real-time.
      // For now, let's just save on blur or have a save button?
      // Actually, let's just have a "Save" button for edits or auto-save.
      // Let's keep it simple: List of read-only notes, click to edit?
      // Or just textareas that save on blur.
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  return (
    <div className="p-4 pb-24">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Anteckningar</h2>
          <p className="text-slate-500 dark:text-slate-400">Sparade i molnet</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform active:scale-95 hover:bg-blue-700"
        >
          <Plus size={24} />
        </button>
      </header>

      {/* Add Note Form */}
      {isAdding && (
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Skriv ny anteckning..."
            className="mb-3 min-h-[100px] w-full resize-none rounded-lg border-0 bg-slate-50 p-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-white"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Avbryt
            </button>
            <button
              onClick={addNote}
              disabled={!newNote.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Spara
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-slate-400" />
        </div>
      ) : notes.length === 0 && !isAdding ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
          <PenLine size={48} className="mb-4 opacity-20" />
          <p>Inga anteckningar än.</p>
          <button 
            onClick={() => setIsAdding(true)}
            className="mt-4 text-blue-600 hover:underline dark:text-blue-400"
          >
            Skapa din första
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {notes.map((note) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onDelete={deleteNote} 
              onUpdate={updateNote} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface NoteCardProps {
  note: Note;
  onDelete: (id: number) => void;
  onUpdate: (id: number, content: string) => void;
}

const NoteCard: FC<NoteCardProps> = ({ note, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);

  const handleSave = () => {
    if (content.trim() !== note.content) {
      onUpdate(note.id, content);
    }
    setIsEditing(false);
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-slate-800">
      {isEditing ? (
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px] w-full resize-none rounded-lg border-0 bg-slate-50 p-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-white"
            autoFocus
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={() => {
                setContent(note.content);
                setIsEditing(false);
              }}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Avbryt
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
            >
              Spara
            </button>
          </div>
        </div>
      ) : (
        <>
          <div 
            onClick={() => setIsEditing(true)}
            className="min-h-[100px] cursor-pointer whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300"
          >
            {note.content}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700">
            <span className="text-xs text-slate-400">
              {new Date(note.timestamp).toLocaleDateString('sv-SE', { 
                day: 'numeric', 
                month: 'short', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-700 dark:hover:text-blue-400"
              >
                <PenLine size={14} />
              </button>
              <button
                onClick={() => onDelete(note.id)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
