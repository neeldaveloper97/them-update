import UplodIcon from '@/app/assets/uploadIcon.svg';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

export default function DragDropUploader({ onFilesChange }) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  function handleFiles(selectedFiles) {
    const fileArray = Array.from(selectedFiles);
    setFiles(fileArray);
    if (onFilesChange) onFilesChange(fileArray);
  }

  function handleFileChange(e) {
    handleFiles(e.target.files);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center h-64 w-full bg-org-primary-light-50 justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer select-none ${dragActive ? 'border-teal-600 bg-teal-50' : 'border-org-primary-transparent'}`}
        onClick={() => inputRef.current?.click()}
      >
        <div>
          <Image src={UplodIcon.src} width={78} height={70} alt="Upload Icon" />
        </div>
        <div className="text-center mt-3">
          <p className="text-sm font-medium mb-1">
            Drag & drop files or{' '}
            <span className="text-teal-600 underline cursor-pointer">
              Browse
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            Supported Formats: JPEG, PNG, GIF, JPG, PDF, AI, Word, PPT
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </>
  );
}
