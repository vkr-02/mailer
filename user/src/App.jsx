
import { useState } from 'react'
import './App.css'

function App() {
  const [title, setTitle] = useState('Order Confirmation')
  const [subject, setSubject] = useState('Your order is confirmed!')
  const [heading, setHeading] = useState('Thanks for your order, {{customerName}}!')
  const [bodyText, setBodyText] = useState(
    "We've received your order and are getting it ready."
  )
  const [buttonText, setButtonText] = useState('View Your Order')
  const [buttonColor, setButtonColor] = useState('#2563eb')
  const [message, setMessage] = useState('')

  
const handleSave = async () => {
    try {
        setMessage('Saving template...')

        const response = await fetch('http://localhost:5000/api/templates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                trigger: 'order_placed',
                subject,
                heading,
                bodyText,
                buttonText,
                buttonColor
            })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Failed to save template')
        }

        setMessage('Template saved successfully!')
        console.log('Saved template:', data.template)
    } catch (error) {
        console.error('Save error:', error)
        setMessage(error.message || 'Could not save template.')
    }
}


  return (
    <main className="editor-page">
      <header className="page-header">
        <h1>Email Template Editor</h1>
        <p>Customize your email and preview it before saving.</p>
      </header>

      <div className="editor-layout">
        <section className="editor-panel">
          <h2>Email Settings</h2>

          <label htmlFor="title">Template name</label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <label htmlFor="subject">Email subject</label>
          <input
            id="subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />

          <label htmlFor="heading">Heading</label>
          <input
            id="heading"
            value={heading}
            onChange={(event) => setHeading(event.target.value)}
          />

          <label htmlFor="bodyText">Body text</label>
          <textarea
            id="bodyText"
            rows={4}
            value={bodyText}
            onChange={(event) => setBodyText(event.target.value)}
          />

          <label htmlFor="buttonText">Button text</label>
          <input
            id="buttonText"
            value={buttonText}
            onChange={(event) => setButtonText(event.target.value)}
          />

          <label htmlFor="buttonColor">Button color</label>
          <input
            id="buttonColor"
            type="color"
            value={buttonColor}
            onChange={(event) => setButtonColor(event.target.value)}
          />

          <button type="button" onClick={handleSave}>
            Save Template
          </button>

          <p role="status">{message}</p>
        </section>

        <section className="preview-panel">
          <h2>Live Preview</h2>
          <p className="subject-preview">
            <strong>Subject:</strong> {subject}
          </p>

          <article className="email-preview">
            <h2>{heading.replace('{{customerName}}', 'Vaibhavi')}</h2>
            <p>{bodyText}</p>

            <div className="order-details">
              <p><strong>Order number:</strong> ORD-1024</p>
              <p><strong>Order total:</strong> ₹1,499</p>
            </div>

            <button
              type="button"
              style={{ backgroundColor: buttonColor }}
              className="preview-button"
            >
              {buttonText}
            </button>
          </article>
        </section>
      </div>
    </main>
  )
}

export default App
