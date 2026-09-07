import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function RandomlyHana() {
  const [notes, setNotes] = useState<{ id: string; text: string; type: string }[]>([]);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('Current obsession');

  const types = ['Current obsession', "Don't ask me why but...", 'Things I will never get tired of', 'Random'];

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes([...notes, { id: Math.random().toString(), text: newNote, type: noteType }]);
    setNewNote('');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Randomly Hana</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        The chaotic section.
      </p>

      <div className="hana-card p-4 mb-6">
        <select
          value={noteType}
          onChange={(e) => setNoteType(e.target.value)}
          className="hana-input mb-3 text-sm"
        >
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Type something..."
            className="hana-input flex-1 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && addNote()}
          />
          <button onClick={addNote} className="hana-btn px-3">
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="hana-card p-4">
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--primary)' }}>
              {note.type}
            </p>
            <p className="text-sm">{note.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
