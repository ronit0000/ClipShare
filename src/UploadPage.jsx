import React, { useState, useCallback, useEffect } from "react";
import { CloudArrowUpIcon, LockClosedIcon, ClockIcon } from "@heroicons/react/24/solid";
import { supabase } from "./supabaseClient";
import { nanoid } from "nanoid";
import { hashPassword, validatePasswordStrength } from "./utils/passwordUtils";
import { EXPIRY_OPTIONS, calculateExpiryTime } from "./utils/expirationUtils";
import PasswordStrengthIndicator from "./components/PasswordStrengthIndicator";

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [code, setCode] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  
  // New state for password protection and expiration
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [expiryHours, setExpiryHours] = useState(24);
  const [passwordError, setPasswordError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const onFilesAdded = (event) => {
    setFiles(Array.from(event.target.files));
    setPreviews([]); // reset previews
    setCode(null);
    setError("");
    setPasswordError("");
  };

  const onDrop = useCallback((event) => {
    event.preventDefault();
    setFiles(Array.from(event.dataTransfer.files));
    setPreviews([]);
    setCode(null);
    setError("");
    setPasswordError("");
  }, []);

  const onDragOver = (event) => event.preventDefault();

  // Image previews
  useEffect(() => {
    const filePreviews = files
      .filter(file => file.type.startsWith('image/'))
      .map(file => URL.createObjectURL(file));
    setPreviews(filePreviews);
    return () => filePreviews.forEach(url => URL.revokeObjectURL(url));
  }, [files]);

  // Validate password before upload
  const validatePassword = () => {
    if (!passwordEnabled) return true;
    
    const validation = validatePasswordStrength(password);
    if (!validation.isValid) {
      setPasswordError(validation.message);
      return false;
    }
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    
    setPasswordError("");
    return true;
  };

  // Upload logic
  const handleUpload = async () => {
    if (!validatePassword()) {
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError("");
    setPasswordError("");
    
    const uploadCode = nanoid(8);
    let uploadedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = `${uploadCode}/${file.name}`;
      const { error: upErr } = await supabase.storage
        .from('clipshare-files')
        .upload(filePath, file, { upsert: false });
      if (upErr) {
        setError(`Failed to upload ${file.name}: ${upErr.message}`);
        setUploading(false);
        return;
      }
      // Get the publicly accessible file URL
      const { data: urlData } = supabase.storage
        .from('clipshare-files')
        .getPublicUrl(filePath);
      uploadedFiles.push({
        name: file.name,
        url: urlData.publicUrl,
        type: file.type
      });
      setUploadProgress(Math.round(((i + 1) / files.length) * 100));
    }

    // Hash password if enabled
    let passwordHash = null;
    if (passwordEnabled && password.trim()) {
      try {
        passwordHash = await hashPassword(password);
      } catch (error) {
        setError("Failed to secure password. Please try again.");
        setUploading(false);
        return;
      }
    }

    // Calculate expiration time
    const expiresAt = calculateExpiryTime(expiryHours);

    // Store in database with password and expiration
    const { error: dbError } = await supabase.from("uploads").insert([{
      code: uploadCode,
      files: uploadedFiles,
      password_hash: passwordHash,
      expiry_hours: expiryHours,
      expires_at: expiresAt
    }]);
    
    if (dbError) {
      setError(`Saving code failed: ${dbError.message}`);
      setUploading(false);
      return;
    }

    setCode(uploadCode);
    setUploading(false);
  };

  return (
    <div>
      {/* Intro Block */}
      <div className="bg-white/10 border border-white/20 rounded-xl p-6 mb-8 text-left max-w-xl mx-auto shadow">
        <h2 className="text-xl font-bold text-white mb-2">Introduction</h2>
        <p className="text-gray-200 mb-4">
        Clip Share is an innovative solution that empowers users to seamlessly transfer files between multiple devices, eliminating the hassle and limitations of traditional methods.
        </p>
        <h3 className="text-lg font-bold text-white mb-2">How to use:</h3>
        <ol className="list-decimal list-inside space-y-1 text-gray-200">
          <li>Choose a file that you want to copy to another device by uploading the file.</li>
          <li>Send your file to Online Clipboard by clicking the following button.</li>
          <li>At the other device, retrieve your text or file from Online Clipboard by entering your code.</li>
        </ol>
      </div>

      {/* Drop/upload zone and UI */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-dashed border-gray-300 p-10 w-full max-w-xl text-center shadow-lg hover:border-blue-500 transition mx-auto"
      >
        <CloudArrowUpIcon className="mx-auto h-16 w-16 text-blue-400" />
        <h2 className="text-2xl font-bold mt-4 text-white">Upload Your Files</h2>
        <p className="text-gray-300 mt-2">
          Drag & drop files here, or click below to select
        </p>

        <input
          type="file"
          multiple
          id="fileElem"
          className="hidden"
          onChange={onFilesAdded}
          disabled={uploading}
        />
        <label
          htmlFor="fileElem"
          className="inline-block mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium shadow-lg cursor-pointer transition"
        >
          Select Files
        </label>

        {files.length > 0 && (
          <div className="mt-6 text-left bg-black/20 rounded-lg p-4 max-h-60 overflow-y-auto">
            <h3 className="font-semibold text-white mb-2">Selected Files:</h3>
            <ul className="space-y-2 text-gray-200">
              {files.map((file, idx) => (
                <li key={idx} className="flex items-center space-x-4">
                  {file.type.startsWith("image/") && previews[idx] ? (
                    <img src={previews[idx]} alt={file.name} className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded">
                      <span className="text-xs select-none">
                        {file.name.split('.').pop()?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="truncate">{file.name}</span>
                </li>
              ))}
            </ul>
            {/* Progress bar */}
            {(uploading || uploadProgress > 0) && uploadProgress < 100 && (
              <div className="w-full bg-gray-700 rounded-full h-4 mt-4">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            {uploadProgress === 100 && (
              <p className="text-green-400 font-semibold mt-2 text-center">Upload complete!</p>
            )}
          </div>
        )}
        {error && <div className="text-red-400 mt-4">{error}</div>}

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-center mx-auto mt-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition"
        >
          <ClockIcon className="w-4 h-4 mr-2" />
          Advanced Options
          <span className="ml-2">{showAdvanced ? '▼' : '▶'}</span>
        </button>

        {/* Advanced Options Panel */}
        {showAdvanced && (
          <div className="mt-4 bg-black/30 rounded-lg p-6 text-left space-y-4">
            {/* Expiration Settings */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <ClockIcon className="inline w-4 h-4 mr-1" />
                File Expiration
              </label>
              <select
                value={expiryHours}
                onChange={(e) => setExpiryHours(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {EXPIRY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Password Protection Toggle */}
            <div>
              <label className="flex items-center text-sm font-medium text-white mb-2">
                <input
                  type="checkbox"
                  checked={passwordEnabled}
                  onChange={(e) => {
                    setPasswordEnabled(e.target.checked);
                    if (!e.target.checked) {
                      setPassword("");
                      setConfirmPassword("");
                      setPasswordError("");
                    }
                  }}
                  className="mr-2 w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                />
                <LockClosedIcon className="w-4 h-4 mr-1" />
                Password Protection
              </label>
            </div>

            {/* Password Fields */}
            {passwordEnabled && (
              <div className="space-y-3 pl-6 border-l-2 border-blue-500">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Password (min. 6 characters)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <PasswordStrengthIndicator password={password} className="mt-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {passwordError && (
                  <div className="text-red-400 text-sm">{passwordError}</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Upload Button */}
        <button
          className="block mx-auto mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-bold shadow-lg transition disabled:opacity-60"
          onClick={handleUpload}
          disabled={!files.length || uploading}
        >
          {uploading ? "Uploading..." : "Upload and Get Code"}
        </button>
        {/* Display code result */}
        {code && (
          <div className="mt-6 bg-black/40 rounded-lg p-4">
            <h3 className="text-lg font-bold text-blue-300 mb-2 text-center">
              Share this code or link:
            </h3>
            <div className="text-2xl text-center font-mono text-white tracking-widest mb-2">{code}</div>
            <div className="text-gray-300 text-center break-all mb-3">
              {window.location.origin}/receive?code={code}
            </div>
            
            {/* Upload Details */}
            <div className="text-sm text-gray-400 text-center space-y-1 border-t border-gray-600 pt-3">
              <div className="flex items-center justify-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                Expires in {EXPIRY_OPTIONS.find(opt => opt.value === expiryHours)?.label || `${expiryHours}h`}
              </div>
              {passwordEnabled && (
                <div className="flex items-center justify-center text-yellow-400">
                  <LockClosedIcon className="w-4 h-4 mr-1" />
                  Password protected
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info Block - below */}
      <div className="bg-white/10 border border-white/20 rounded-xl p-6 mt-8 text-left max-w-xl mx-auto shadow">
        <h2 className="text-xl font-bold text-white mb-3">
          About Clip Share - Effortless File Transfer Across Devices
        </h2>
        <p className="text-gray-200 mb-4">
        Clip Share is an innovative solution that empowers users to seamlessly transfer files between multiple devices, eliminating the hassle and limitations of traditional methods.
        </p>
        <h3 className="text-lg font-bold text-white mb-2">Key Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-200 mb-4">
          <li>
            <span className="font-semibold text-white">Cross-Device File Sharing:</span> Effortlessly send files between your desktop, laptop, tablet, and smartphone.
          </li>
          <li>
            <span className="font-semibold text-white">Simple and Intuitive Interface.</span>
          </li>
          <li>
            <span className="font-semibold text-white">Secure and Private.</span>
          </li>
          <li>
            <span className="font-semibold text-white">Supports Various File Types.</span>
          </li>
        </ul>
        <h3 className="text-lg font-bold text-white mb-2">Benefits:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-200 mb-4">
          <li><span className="font-semibold text-white">Eliminate Email Overkill.</span></li>
          <li><span className="font-semibold text-white">No Software Installation Required.</span></li>
          <li><span className="font-semibold text-white">Cross-Platform Compatibility.</span></li>
          <li><span className="font-semibold text-white">Improved Productivity.</span></li>
        </ul>
        <h3 className="text-lg font-bold text-white mb-2">Conclusion:</h3>
        <p className="text-gray-200">
        Clip Share is the perfect solution for anyone who needs to transfer files between devices quickly, easily, and securely.
        </p>
      </div>
    </div>
  );
};

export default UploadPage;
