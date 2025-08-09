import React, { useState } from 'react';

const ReceivePage = () => {
  const [code, setCode] = useState('');
  const [files, setFiles] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setFiles(null);
    // TODO: Replace mock with Supabase fetch logic
    if (code === 'test123') {
      setFiles([
        { name: 'demo-image.png', url: '/path/to/demo-image.png' },
        { name: 'demo-doc.pdf', url: '/path/to/demo-doc.pdf' }
      ]);
    } else {
      setError('Invalid code or files not found.');
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Glassy Info/Header Card */}
      <div className="bg-white/10 border border-white/20 rounded-xl p-6 mb-8 text-left shadow">
        <h2 className="text-xl font-bold text-white mb-2">Receive Files</h2>
        <p className="text-gray-200">
          Enter your unique code to instantly download files sent from any other device.
        </p>
      </div>
      {/* Main code input box */}
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
        >
          Retrieve Files
        </button>
        {error && <div className="text-red-400 mt-4">{error}</div>}
      </form>
      {/* Display the files if found */}
      {files && (
        <div className="mt-8 bg-black/20 rounded-lg p-4 shadow text-left">
          <h3 className="text-lg font-semibold text-white mb-2">Files to download:</h3>
          <ul className="space-y-2">
            {files.map((file, idx) => (
              <li key={idx}>
                <a
                  href={file.url}
                  download
                  className="text-blue-400 underline hover:text-blue-600 break-all"
                >
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReceivePage;
