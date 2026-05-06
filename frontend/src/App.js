import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);

  // Centralized API URL
  const API_BASE = "http://10.36.241.12:5000/api/notes";

  // 1. Fetch Notes from Backend
  const fetchNotes = async () => {
    try {
      const response = await fetch(API_BASE);
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
      if (editId) {
        await fetch(`${API_BASE}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData),
        });
        setEditId(null);
      } else {
        await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData),
        });
      }
      setTitle('');
      setContent('');
      fetchNotes(); 
    } catch (error) {
      alert("Server error. Please check if the backend terminal is running.");
    }
  };

  // 3. Delete Note
  const deleteNote = async (id) => {
    try {
      await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      setNotes(notes.filter(note => note._id !== id));
    } catch (error) {
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
        <p style={{textAlign: 'center'}}>Connecting to backend...</p>
      ) : (
        <div className="notes-list">
          {notes.length === 0 && (
            <p style={{textAlign: 'center', gridColumn: '1/-1'}}>No notes found in database.</p>
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

// THIS LINE IS ESSENTIAL
export default App;