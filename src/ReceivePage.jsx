import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const ReceivePage = () => {
  const [code, setCode] = useState('');
  const [files, setFiles] = useState(null);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);

  // Auto-populate code if present in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get('code');
    if (urlCode && !code) setCode(urlCode);
  }, [code]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFiles(null);
    setError('');
    setSearching(true);
    // Query the DB
    const { data, error: dbError } = await supabase
      .from('uploads')
      .select('files')
      .eq('code', code)
      .single();
    if (dbError || !data) {
      setError('Invalid code or files not found.');
      setSearching(false);
      return;
    }
    setFiles(data.files);
    setSearching(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Glassy header */}
      <div className="bg-white/10 border border-white/20 rounded-xl p-6 mb-8 text-left shadow">
        <h2 className="text-xl font-bold text-white mb-2">Receive Files</h2>
        <p className="text-gray-200">
          Enter your unique code to instantly download files sent from another device.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-dashed border-gray-300 p-10 text-center shadow-lg mx-auto"
      >
        <label htmlFor="receive-code" className="block mb-4 text-lg font-semibold text-white">
          Enter code
        </label>
        <input
          id="receive-code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-4 py-3 rounded bg-gray-900/60 border border-gray-600 text-white focus:outline-none focus:border-blue-400 mb-6"
          placeholder="Example: 7Y6X2A"
          required
        />
        <button
          type="submit"
          className="w-full mt-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium shadow-lg transition"
          disabled={!code || searching}
        >
          {searching ? "Fetching..." : "Retrieve Files"}
        </button>
        {error && <div className="text-red-400 mt-4">{error}</div>}
      </form>
      {files && (
        <div className="mt-8 bg-black/20 rounded-lg p-4 shadow text-left">
          <h3 className="text-lg font-semibold text-white mb-2">Files to download:</h3>
          <ul className="space-y-2">
            {files.map((file, idx) => (
              <li key={idx} className="flex items-center space-x-4">
                {file.type?.startsWith('image/') ? (
                  <img src={file.url} alt={file.name} className="w-12 h-12 object-cover rounded" />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded">
                    <span className="text-xs select-none">{file.name.split('.').pop()?.toUpperCase()}</span>
                  </div>
                )}
                <a href={file.url} download className="text-blue-400 underline hover:text-blue-600 break-all">{file.name}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReceivePage;
