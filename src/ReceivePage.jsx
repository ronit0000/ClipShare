import React, { useState, useEffect } from 'react';
import { LockClosedIcon, ExclamationTriangleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { supabase } from './supabaseClient';
import { verifyPassword } from './utils/passwordUtils';
import { isExpired, getTimeRemaining, formatExpiryDate } from './utils/expirationUtils';

const ReceivePage = () => {
  const [code, setCode] = useState('');
  const [files, setFiles] = useState(null);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);
  
  // Password and expiration states
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [uploadData, setUploadData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isFileExpired, setIsFileExpired] = useState(false);

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
    setRequiresPassword(false);
    setUploadData(null);
    
    // Query the DB with all necessary fields
    const { data, error: dbError } = await supabase
      .from('uploads')
      .select('files, password_hash, expires_at, created_at')
      .eq('code', code)
      .single();
      
    if (dbError || !data) {
      setError('Invalid code or files not found.');
      setSearching(false);
      return;
    }

    // Check if file has expired
    if (data.expires_at && isExpired(data.expires_at)) {
      setIsFileExpired(true);
      setError('This file has expired and is no longer available.');
      setSearching(false);
      return;
    }

    // Update time remaining display
    if (data.expires_at) {
      const remaining = getTimeRemaining(data.expires_at);
      setTimeRemaining(remaining);
    }

    // Check if password is required
    if (data.password_hash) {
      setRequiresPassword(true);
      setUploadData(data);
      setSearching(false);
      return;
    }

    // No password required, show files directly
    setFiles(data.files);
    setUploadData(data);
    setSearching(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSearching(true);

    if (!password.trim()) {
      setError('Please enter a password.');
      setSearching(false);
      return;
    }

    // Verify password
    const isValid = await verifyPassword(password, uploadData.password_hash);
    
    if (!isValid) {
      setError('Incorrect password. Please try again.');
      setSearching(false);
      return;
    }

    // Password correct, show files
    setFiles(uploadData.files);
    setRequiresPassword(false);
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

      {/* Code Entry Form */}
      {!requiresPassword && (
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
          {error && (
            <div className={`mt-4 flex items-center justify-center ${isFileExpired ? 'text-orange-400' : 'text-red-400'}`}>
              {isFileExpired && <ExclamationTriangleIcon className="w-5 h-5 mr-2" />}
              {error}
            </div>
          )}
        </form>
      )}

      {/* Password Entry Form */}
      {requiresPassword && (
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-yellow-400/50 p-10 text-center shadow-lg mx-auto"
        >
          <div className="flex items-center justify-center mb-4">
            <LockClosedIcon className="w-6 h-6 text-yellow-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">Password Required</h3>
          </div>
          <p className="text-gray-300 mb-6">This file is password protected. Please enter the password to access it.</p>
          
          <label htmlFor="receive-password" className="block mb-2 text-sm font-medium text-white">
            Password
          </label>
          <input
            id="receive-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded bg-gray-900/60 border border-gray-600 text-white focus:outline-none focus:border-yellow-400 mb-6"
            placeholder="Enter password"
            required
            autoFocus
          />
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                setRequiresPassword(false);
                setPassword('');
                setUploadData(null);
                setError('');
              }}
              className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg text-white font-medium transition"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white font-medium transition"
              disabled={!password || searching}
            >
              {searching ? "Verifying..." : "Unlock Files"}
            </button>
          </div>
          
          {error && <div className="text-red-400 mt-4">{error}</div>}
        </form>
      )}
      {files && uploadData && (
        <div className="mt-8 bg-black/20 rounded-lg p-4 shadow text-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Files to download:</h3>
            {timeRemaining && !timeRemaining.expired && (
              <div className="flex items-center text-sm text-orange-400">
                <ClockIcon className="w-4 h-4 mr-1" />
                Expires in {timeRemaining.timeString}
              </div>
            )}
          </div>

          {/* File expiration warning */}
          {uploadData.expires_at && (
            <div className="mb-4 p-3 bg-orange-900/30 border border-orange-600/50 rounded-lg">
              <div className="flex items-center text-sm text-orange-300">
                <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                <span>This file expires on {formatExpiryDate(uploadData.expires_at)}</span>
              </div>
            </div>
          )}

          <ul className="space-y-3">
            {files.map((file, idx) => (
              <li key={idx} className="flex items-center justify-between bg-gray-800/30 rounded-lg p-3">
                <div className="flex items-center space-x-4">
                  {file.type?.startsWith('image/') ? (
                    <img src={file.url} alt={file.name} className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded">
                      <span className="text-xs select-none">{file.name.split('.').pop()?.toUpperCase()}</span>
                    </div>
                  )}
                  <span className="text-white font-medium break-all">{file.name}</span>
                </div>
                <a 
                  href={file.url} 
                  download 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
          
          {/* Download All Button */}
          {files.length > 1 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => files.forEach(file => {
                  const link = document.createElement('a');
                  link.href = file.url;
                  link.download = file.name;
                  link.click();
                })}
                className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium transition"
              >
                Download All Files
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReceivePage;
