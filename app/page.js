'use client';
import { React, useState, useEffect } from 'react';

export default function App() {
  const [startDate, setStartDate] = useState('20250101');
  const [data, setData] = useState('');
  const [theme, setTheme] = useState('grass');
  const [size, setSize] = useState('14');
  const [imageUrl, setImageUrl] = useState('');
  const [origin, setOrigin] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });

  const BUTTON_THEMES = {
    grass: { bg: '#30a14e', hover: '#216e39' },
    ocean: { bg: '#6080ff', hover: '#365dfd' },
    violet: { bg: '#8b5cf6', hover: '#6d28d9' },
    rose: { bg: '#f43f5e', hover: '#be123c' },
    amber: { bg: '#f59e0b', hover: '#b45309' },
    teal: { bg: '#40a8b6', hover: '#1e6b78' },
    mono: { bg: '#4b5563', hover: '#1f2937' },
  };

  useEffect(() => {
    setOrigin(window.location.origin);
    const exampleData = Array.from({ length: 180 }, () => Math.floor(Math.random() * 25)).join(',');
    setData(exampleData);
  }, []);

  useEffect(() => {
    const isValidDate = /^\d{8}$/.test(startDate);
    if (origin && startDate && data && isValidDate) {
      const query = new URLSearchParams({ 
        start: startDate, 
        data: data,
        theme: theme,
        size: size,
      }).toString();
      setImageUrl(`${origin}/api/graph?${query}`);
    } else if (!isValidDate) {
      setImageUrl('');
    }
  }, [origin, startDate, data, theme, size]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const handleCopyToClipboard = () => {
    if (!imageUrl) {
      showToast('Please enter a valid date.');
      return;
    }
    const markdownText = `![Activity Graph](${imageUrl})`;
    navigator.clipboard.writeText(markdownText)
      .then(() => {
        showToast('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Copy failed', err)
        showToast('Failed to copy.');
      });
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center font-sans p-4">
      <a 
        href="https://github.com/qkrwns1478/my-activity-graph" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="View source on GitHub"
        className="fixed top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
        </svg>
      </a>

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">Activity Graph Generator</h1>
          <p className="text-gray-500 mt-2">Make a dynamic activity graph for cooler README</p>
        </header>
        <main className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date (YYYYMMDD)
              </label>
              <input
                type="text"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="20250101"
                maxLength="8"
              />
            </div>
            <div>
              <label htmlFor="theme-select" className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                id="theme-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="grass">Grass</option>
                <option value="ocean">Ocean</option>
                <option value="violet">Violet</option>
                <option value="rose">Rose</option>
                <option value="amber">Amber</option>
                <option value="teal">Teal</option>
                <option value="mono">Mono</option>
              </select>
            </div>
            <div>
              <label htmlFor="size-select" className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <select
                id="size-select"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="12">Smaller</option>
                <option value="14">Regular</option>
                <option value="16">Larger</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
                Activity data (separated by commas)
              </label>
              <textarea
                id="data"
                rows="5"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="5,0,12,8,..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
              <div className="mt-2 p-4 border border-gray-200 rounded-md flex justify-center items-center bg-gray-50 overflow-auto min-h-[150px]">
                {imageUrl ? (
                  <object 
                    type="image/svg+xml" 
                    data={imageUrl} 
                    aria-label="Activity Graph Preview"
                    key={imageUrl}
                  >
                    Failed to load SVG
                  </object>
                ) : (
                  <div className="text-gray-500">Please enter a valid date (YYYYMMDD)</div>
                )}
              </div>
            </div>
            {imageUrl && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Markdown</h3>
                <div className="mt-2 p-3 bg-gray-100 rounded-md text-sm text-gray-600 break-all font-mono">
                  {`![Activity Graph](${imageUrl})`}
                </div>
                <div className='mt-3 flex justify-center'>
                  <button
                    onClick={handleCopyToClipboard}
                    className="px-4 py-2 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                    style={{ backgroundColor: BUTTON_THEMES[theme].bg, '--tw-ring-color': BUTTON_THEMES[theme].bg }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = BUTTON_THEMES[theme].hover}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = BUTTON_THEMES[theme].bg}
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {toast.show && (
        <div className="fixed bottom-5 right-5 bg-gray-800 text-white px-5 py-3 rounded-lg shadow-lg animate-fade-in-out">
          {toast.message}
        </div>
      )}
    </div>
  );
}
