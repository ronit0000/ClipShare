import React, { useState, useCallback, useEffect } from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";
import { supabase } from "./supabaseClient";
import { nanoid } from "nanoid";

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [code, setCode] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const onFilesAdded = (event) => {
    setFiles(Array.from(event.target.files));
    setPreviews([]); // reset previews
    setCode(null);
    setError("");
  };

  const onDrop = useCallback((event) => {
    event.preventDefault();
    setFiles(Array.from(event.dataTransfer.files));
    setPreviews([]);
    setCode(null);
    setError("");
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

  // Upload logic
  const handleUpload = async () => {
    setUploading(true);
    setUploadProgress(0);
    setError("");
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

    // Store in database
    const { error: dbError } = await supabase.from("uploads").insert([{
      code: uploadCode,
      files: uploadedFiles
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
            <div className="text-gray-300 text-center break-all">
              {window.location.origin}/receive?code={code}
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
