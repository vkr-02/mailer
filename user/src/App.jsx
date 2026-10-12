
import { useState } from 'react'
import './App.css'

function App() {
  const [html, setHtml] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    try {
      setMessage('Saving...');

      const response = await fetch('http://localhost:5000/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          html
        })
      });

      const data = await response.json();

      if(!response.ok) {
        throw new Error(data.message || 'Failed to save template');
      };

      setMessage('Template saved successfully');
      console.log('Saved template', data.template);
    } catch (error) {
      setMessage(error.message || 'Something went wrong');
      console.log('Save error', error);
    }
  };

  return (
    <div>
      <h1>Email Template Editor</h1>

      <label htmlFor="email-html">Email HTML</label>

      <label htmlFor="template-title">Template title</label>
      <input 
      id='template-title'
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder='e.g. Welcome Email'
      />

      <textarea
        id="email-html"
        value={html}
        onChange={(event) => setHtml(event.target.value)}
        placeholder="Write your email HTML here..."
        rows={15}
      />

      <button type="button" onClick={handleSave}>
        Save HTML
      </button>
      <p>{message}</p>
    </div>
  )
}

export default App
