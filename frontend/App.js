
function App() {
  // Use your live Vercel URL here
  const BASE_URL = 'https://fstackact2.vercel.app/api/notes';

  // 1. Fetch Notes from Backend
  const fetchNotes = async () => {
    try {
      // Changed from localhost to BASE_URL
      const response = await fetch(BASE_URL); 
      const data = await response.json();
      setNotes(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setLoading(false);
    }
  };

  // 2. Add Note
  const addNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Please add both a title and content!");

    try {
      // Changed from localhost to BASE_URL
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        setTitle('');
        setContent('');
        fetchNotes(); 
      }
    } catch (error) {
      alert("Failed to save note");
    }
  };

  // 3. Delete Note
  const deleteNote = async (id) => {
    try {
      // Changed from localhost to BASE_URL + ID
      await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
      setNotes(notes.filter(note => note._id !== id));
    } catch (error) {
      alert("Failed to delete note");
    }
  };
