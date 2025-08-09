import React, { useState, useCallback, useEffect } from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onFilesAdded = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(droppedFiles);
  }, []);

  const onDragOver = (event) => {
    event.preventDefault();
  };

  // Generate previews for image files
  useEffect(() => {
    const filePreviews = files
      .filter(file => file.type.startsWith("image/"))
      .map(file => URL.createObjectURL(file));

    setPreviews(filePreviews);

    return () => {
      filePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  // Simulate upload progress on files added
  useEffect(() => {
    if (files.length === 0) {
      setUploadProgress(0);
      return;
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress > 100) {
        clearInterval(interval);
        setUploadProgress(100);
      } else {
        setUploadProgress(progress);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [files]);

  return (
    <div>
      {/* Introductory Content */}
      <div className="bg-white/10 border border-white/20 rounded-xl p-6 mb-8 text-left max-w-xl mx-auto shadow">
        <h2 className="text-xl font-bold text-white mb-2">Introduction</h2>
        <p className="text-gray-200 mb-4">
          Send File Online is an innovative solution that empowers users to seamlessly transfer files between multiple devices, eliminating the hassle and limitations of traditional methods.
        </p>
        <h3 className="text-lg font-bold text-white mb-2">How to use:</h3>
        <ol className="list-decimal list-inside space-y-1 text-gray-200">
          <li>Choose a file that you want to copy to another device by uploading the file.</li>
          <li>Send your file to Online Clipboard by clicking the following button.</li>
          <li>At the other device, retrieve your text or file from Online Clipboard by entering your code.</li>
        </ol>
      </div>

      {/* Upload/Drop Zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-dashed border-gray-300 p-10 w-full max-w-xl text-center shadow-lg hover:border-blue-500 transition relative z-10 mx-auto"
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
                    <img
                      src={previews[idx]}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded"
                    />
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
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-gray-700 rounded-full h-4 mt-4">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            {uploadProgress === 100 && (
              <p className="text-green-400 font-semibold mt-2 text-center">
                Upload complete!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Additional Information Section  */}
      <div className="bg-white/10 border border-white/20 rounded-xl p-6 mt-8 text-left max-w-xl mx-auto shadow">
        <h2 className="text-xl font-bold text-white mb-3">
          About Send File Online - Effortless File Transfer Across Devices
        </h2>
        <p className="text-gray-200 mb-4">
          Send File Online is an innovative solution that empowers users to seamlessly transfer files between multiple devices, eliminating the hassle and limitations of traditional methods.
        </p>

        <h3 className="text-lg font-bold text-white mb-2">Key Features of Send File Online:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-200 mb-4">
          <li>
            <span className="font-semibold text-white">Cross-Device File Sharing:</span> Effortlessly send files between your desktop, laptop, tablet, and smartphone, regardless of operating system or device type.
          </li>
          <li>
            <span className="font-semibold text-white">Simple and Intuitive Interface:</span> The user-friendly interface makes file sharing a breeze, with drag-and-drop functionality and clear instructions.
          </li>
          <li>
            <span className="font-semibold text-white">Secure and Private:</span> Send File Online employs advanced encryption techniques to ensure the privacy and security of your files during transfer.
          </li>
          <li>
            <span className="font-semibold text-white">Supports Various File Types:</span> Send images, documents, videos, and more with ease. Our platform currently supports plain text, images, and files, with plans to expand support in the future.
          </li>
        </ul>

        <h3 className="text-lg font-bold text-white mb-2">Benefits of Using Send File Online:</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-200 mb-4">
          <li><span className="font-semibold text-white">Eliminate Email Overkill:</span> Avoid the hassle of using email for small file transfers, which can clog your inbox and waste time.</li>
          <li><span className="font-semibold text-white">No Software Installation Required:</span> Simply access Send File Online from your web browser, without needing any downloads or installations.</li>
          <li><span className="font-semibold text-white">Supports Various File Types:</span> Send images, documents, videos, and more with ease. Supports plain text, images, files, with plans to expand support.</li>
          <li><span className="font-semibold text-white">Cross-Platform Compatibility:</span> Send files between devices running Windows, macOS, iOS, and Android, ensuring seamless file sharing in any environment.</li>
          <li><span className="font-semibold text-white">Improved Productivity:</span> Streamline your workflow by quickly and easily sharing files between devices, saving you time and effort.</li>
        </ul>

        <h3 className="text-lg font-bold text-white mb-2">Conclusion:</h3>
        <p className="text-gray-200">
          Send File Online is the perfect solution for anyone who needs to transfer files between devices quickly, easily, and securely. Its cross-device compatibility, simple interface, and support for various file types make it the ideal choice for individuals and businesses alike.
        </p>
      </div>
    </div>
  );
};

export default UploadPage;
