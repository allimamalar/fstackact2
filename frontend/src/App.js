import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);

  // UPDATED: Must include /api/notes to match your Backend routes
  // Ensure it looks exactly like this:
  const API_BASE = "http://localhost:3001/api/notes";
  // 1. Fetch Notes from Backend
  const fetchNotes = async () => {
    try {
      const response = await fetch(API_BASE);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNotes(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // 2. Handle Form Submission (Create & Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Fields cannot be empty!");

    const noteData = { title, content };

    try {
      let response;
      if (editId) {
        // PUT request to /api/notes/:id
        response = await fetch(`${API_BASE}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData),
        });
      } else {
        // POST request to /api/notes
        response = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setEditId(null);
      setTitle('');
      setContent('');
      fetchNotes(); 
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Server error. Please check your backend deployment.");
    }
  };

  // 3. Delete Note
  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      // DELETE request to /api/notes/:id
      const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNotes(notes.filter(note => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete the note.");
    }
  };

  const startEdit = (note) => {
    setEditId(note._id);
    setTitle(note.title);
    setContent(note.content);
  };

  return (
    <div className="App">
      <h1>Student Notes Manager</h1>

      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        <textarea 
          placeholder="Write a note..." 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
        />
        <div className="btn-container">
          <button type="submit" style={{ background: editId ? '#28a745' : '#007bff' }}>
            {editId ? 'Update Note' : 'Save Note'}
          </button>
          {editId && (
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={() => {setEditId(null); setTitle(''); setContent('');}}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr style={{ margin: '40px 0', border: '0', borderTop: '1px solid #ddd' }} />

      {loading ? (
        <p style={{textAlign: 'center'}}>Connecting to database...</p>
      ) : (
        <div className="notes-list">
          {notes.length === 0 && (
            <p style={{textAlign: 'center', gridColumn: '1/-1'}}>No notes found.</p>
          )}
          {notes.map(note => (
            <div key={note._id} className="note-card">
              <div>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
              </div>
              <div className="note-actions">
                <button className="btn-edit" onClick={() => startEdit(note)}>Edit</button>
                <button className="btn-delete" onClick={() => deleteNote(note._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;