import React, { useState, useRef } from 'react';
import './App.css';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ko', name: 'Korean' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' },
];

// Real translation function calling the Cloudflare Function API
const translateWithAPI = async (text: string, targetLangName: string): Promise<string> => {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, targetLang: targetLangName }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Translation failed');
  }

  const data = await response.json();
  return data.translatedText;
};

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [targetLang, setTargetLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTranslate = async () => {
    if (!description.trim()) return;

    setIsTranslating(true);
    setResult(null);

    // Get the full language name from the code
    const selectedLang = LANGUAGES.find(l => l.code === targetLang)?.name || 'English';

    try {
      const translatedText = await translateWithAPI(description, selectedLang);
      setResult(translatedText);
    } catch (error: any) {
      console.error('Translation failed', error);
      setResult(`Error: ${error.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Foodie Translate</h1>
        <p>Snap, Describe, and Translate</p>
      </header>

      <main>
        <div className="card">
          <h2 className="section-title">
            <span role="img" aria-label="camera">📸</span> 1. Upload Food Photo
          </h2>
          
          <div 
            className="upload-area" 
            onClick={() => fileInputRef.current?.click()}
          >
            {image ? (
              <>
                <img src={image} alt="Food preview" className="image-preview" />
                <button className="remove-btn" onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}>
                  Remove
                </button>
              </>
            ) : (
              <div className="upload-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <p>Tap to upload or drag a photo</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">
            <span role="img" aria-label="edit">✍️</span> 2. Describe the Food
          </h2>
          
          <div className="input-group">
            <label className="label">Description</label>
            <textarea 
              placeholder="e.g., This delicious pasta has a rich tomato sauce and fresh basil..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="label">Translate to</label>
            <select 
              value={targetLang} 
              onChange={(e) => setTargetLang(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button 
            className="translate-btn" 
            onClick={handleTranslate}
            disabled={isTranslating || !description.trim()}
          >
            {isTranslating ? (
              <>
                <span className="spinner"></span>
                Translating...
              </>
            ) : (
              'Translate Now'
            )}
          </button>
        </div>

        {result && (
          <div className="card result-card">
            <h2 className="section-title">
              <span role="img" aria-label="sparkles">✨</span> Translation Result
            </h2>
            <p className="translated-text">{result}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
