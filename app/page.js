'use client';
import React, { useState, useEffect } from 'react';

export default function App() {
  const [startDate, setStartDate] = useState('20250101');
  const [data, setData] = useState('');
  const [theme, setTheme] = useState('grass');
  const [imageUrl, setImageUrl] = useState('');
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
    const exampleData = Array.from({ length: 180 }, () => Math.floor(Math.random() * 25)).join(',');
    setData(exampleData);
  }, []);

  useEffect(() => {
    if (origin && startDate && data) {
      const query = new URLSearchParams({ 
        start: startDate, 
        data: data,
        theme: theme,
      }).toString();
      setImageUrl(`${origin}/api/graph?${query}`);
    } else {
      setImageUrl('');
    }
  }, [origin, startDate, data, theme]);

  const handleCopyToClipboard = () => {
    const markdownText = `![Activity Graph](${imageUrl})`;
    navigator.clipboard.writeText(markdownText)
      .then(() => alert('마크다운 코드가 클립보드에 복사되었습니다!'))
      .catch(err => console.error('Copy failed', err));
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center font-sans p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">활동 달력 이미지 생성기</h1>
          <p className="text-gray-500 mt-2">GitHub README에 사용할 수 있는 동적 활동 그래프를 만들어보세요.</p>
        </header>
        <main className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                시작 날짜 (YYYYMMDD)
              </label>
              <input
                type="text"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="20250101"
              />
            </div>
            <div>
              <label htmlFor="theme-select" className="block text-sm font-medium text-gray-700 mb-1">
                테마 선택
              </label>
              <select
                id="theme-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="grass">Grass</option>
                <option value="halloween">Halloween</option>
                <option value="teal">Teal</option>
                <option value="blue">Blue</option>
                <option value="winter">Winter</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
                활동 데이터 (쉼표로 구분)
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
          {imageUrl && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">생성된 이미지 URL</h3>
                <div className="mt-2 p-3 bg-gray-100 rounded-md text-sm text-gray-600 break-all font-mono">
                  {imageUrl}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">미리보기</h3>
                <div className="mt-2 p-4 border border-gray-200 rounded-md flex justify-center items-center bg-gray-50">
                  <img src={imageUrl} alt="Generated Activity Graph" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">GitHub README용 마크다운</h3>
                <div className="mt-2 p-3 bg-gray-100 rounded-md text-sm text-gray-600 break-all font-mono">
                  {`![Activity Graph](${imageUrl})`}
                </div>
                <button
                  onClick={handleCopyToClipboard}
                  className="mt-3 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  마크다운 복사
                </button>
              </div>
            </div>
          )}
        </main>
        <footer className="text-center text-gray-400 text-sm pt-6 border-t">
          <p>
            © 2025 ParkJS. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
