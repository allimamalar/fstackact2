import React, { useEffect, useState } from 'react';

export default function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const apiBase = process.env.REACT_APP_API_URL || ''; // CRA proxy

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      console.log('fetchNotes: GET /api/notes');
      const res = await fetch(`${apiBase}/api/notes`);
      const data = await res.json();
      console.log('fetchNotes: got', data);
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchNotes error:', err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { title: title.trim(), content: content.trim() };
    if (!payload.title && !payload.content) return;

    try {
      const url = editingId ? `${apiBase}/api/notes/${editingId}` : `${apiBase}/api/notes`;
      const method = editingId ? 'PUT' : 'POST';
      console.log('handleSubmit: sending', method, url, payload);
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      let saved;
      try {
        saved = JSON.parse(text);
      } catch (parseErr) {
        console.error('handleSubmit: response not JSON', text);
        throw new Error('Invalid JSON response from server');
      }
      if (!res.ok) {
        console.error('handleSubmit: server error', res.status, saved);
        throw new Error(`Save failed (${res.status})`);
      }
      console.log('handleSubmit: saved', saved);

      // ensure UI shows backend state: update local list OR refresh from server
      if (editingId) {
        setNotes(prev => prev.map(n => (n._id === saved._id ? saved : n)));
      } else {
        // append returned saved note (preferred)
        setNotes(prev => [saved, ...prev]);
        // also refresh from server to be safe:
        fetchNotes();
      }

      setTitle('');
      setContent('');
      setEditingId(null);
    } catch (err) {
      console.error('handleSubmit error:', err);
      // keep form data so user can retry
    }
  }

  function startEdit(note) {
    setTitle(note.title || '');
    setContent(note.content || '');
    setEditingId(note._id || note.id);
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle('');
    setContent('');
  }

  async function handleDelete(id) {
    if (!confirm('Delete this note?')) return;
    try {
      const res = await fetch(`${apiBase}/api/notes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setNotes(prev => prev.filter(n => (n._id || n.id) !== id));
    } catch (err) {
      console.error('handleDelete error:', err);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '1rem auto', fontFamily: 'sans-serif' }}>
      <h2>Notes</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
        />
        <div>
          <button type="submit" style={{ marginRight: 8 }}>
            {editingId ? 'Save changes' : 'Save'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        {notes.length === 0 && <p>No notes yet.</p>}
        {notes.map(note => {
          const id = note._id || note.id;
          return (
            <div key={id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 8 }}>
              <strong>{note.title}</strong>
              <p style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
              <div>
                <button onClick={() => startEdit(note)} style={{ marginRight: 8 }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}