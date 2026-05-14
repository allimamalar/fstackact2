import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  // YOUR VERCEL BACKEND URL
  const BASE_URL = 'https://fstackact2.vercel.app/api/notes';

  // 1. Fetch Notes
  const fetchNotes = async () => {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // 2. Add Note
  const addNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Please fill in both fields");

    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        const newNote = await response.json();
        setNotes([newNote, ...notes]); // Update list immediately
        setTitle('');
        setContent('');
      }
    } catch (error) {
      alert("Error saving note");
    }
  };

  // 3. Delete Note
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setNotes(notes.filter(note => note._id !== id));
      }
    } catch (error) {
      alert("Error deleting note");
    }
  };

  return (
    <div className="App">
      <h1>My Notes Sharing App</h1>
      <form onSubmit={addNote} className="note-form">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
        <button type="submit">Save Note</button>
      </form>
      <hr />
      {loading ? <p>Loading...</p> : (
        <div className="notes-container">
          {notes.map(note => (
            <div key={note._id} className="note-card">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <button onClick={() => deleteNote(note._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;