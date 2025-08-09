import React, { useState, useCallback } from 'react';

const UploadPage = () => {
  const [files, setFiles] = useState([]);

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

  return (
    <div 
      onDrop={onDrop} 
      onDragOver={onDragOver} 
      style={{
        border: '3px dashed #555', 
        borderRadius: '10px',
        height: '200px',
        width: '400px',
        margin: '40px auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor: '#f9f9f9'
      }}
    >
      <input 
        type="file" 
        multiple 
        id="fileElem" 
        style={{ display: 'none' }} 
        onChange={onFilesAdded} 
      />
      <label htmlFor="fileElem" style={{ cursor: 'pointer', marginBottom: '10px', color: '#007bff' }}>
        Click to select files
      </label>
      <p>or drag and drop files here</p>
      
      {files.length > 0 && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <strong>Selected Files:</strong>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {files.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
