import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '600px',
      margin: '40px auto',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f9f9f9',
      color: '#333'
    }}>
      <header>
        <h1 style={{ color: '#0070f3', marginBottom: '10px' }}>React Testing Sandbox</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          A minimal React + Vite + TypeScript starter with Vitest and Testing Library.
        </p>
      </header>

      <main style={{ marginTop: '30px' }}>
        <section style={{ marginBottom: '30px' }}>
          <h2>Counter</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button
              onClick={() => setCount(prev => prev - 1)}
              style={{
                padding: '8px 16px',
                fontSize: '1rem',
                cursor: 'pointer',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: '#fff'
              }}
              aria-label="decrement"
            >
              -
            </button>
            <span data-testid="counter-value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {count}
            </span>
            <button
              onClick={() => setCount(prev => prev + 1)}
              style={{
                padding: '8px 16px',
                fontSize: '1rem',
                cursor: 'pointer',
                borderRadius: '4px',
                border: '1px solid #0070f3',
                backgroundColor: '#0070f3',
                color: '#fff'
              }}
              aria-label="increment"
            >
              +
            </button>
          </div>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h2>Interactive Input</h2>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something here..."
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              boxSizing: 'border-box'
            }}
          />
          {text && (
            <p style={{ marginTop: '10px', fontSize: '1rem' }}>
              You typed: <strong data-testid="typed-text">{text}</strong>
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
