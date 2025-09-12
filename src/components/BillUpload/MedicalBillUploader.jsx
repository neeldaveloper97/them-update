import React, { useEffect, useRef, useState } from 'react';
import DragDropUploader from '@/components/DragDropUploader';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

const allowedTypes = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
];

const parsingSteps = [
  'Extracting text from document',
  'Detecting line items & dates',
  'Validating totals and calculations',
  'Flagging potential errors',
  'Generating AI recommendations',
];

function getFileIcon(type) {
  if (type.includes('pdf')) return '📄';
  if (type.includes('image')) return '🖼️';
  return '📁';
}
export default function MedicalBillUploader({
  onUpload,
  onUploadSuccess,
  uploadImageThunk,
  userId,
  dispatch,
  getMedicalBillsThunk,
  uploadFileByProviderThunk,
  token,
  getImageThunk,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [parsingFiles, setParsingFiles] = useState([]);
  const [backgroundProcessing, setBackgroundProcessing] = useState([]);
  const [inputKey, setInputKey] = useState(Date.now());

  const [isUploading, setIsUploading] = useState(false);
  const isBusy = isUploading || parsingFiles.length > 0;

  const MAX_IDLE_PROGRESS = 99;
  const timersRef = useRef(new Map());

  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024;
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error:
          'Unsupported file format. Please upload PDF, JPG, PPT, WORD or PNG files only.',
      };
    }
    if (file.size > maxSize) {
      return { valid: false, error: 'File size exceeds 10MB limit.' };
    }
    const isDuplicate = selectedFiles.some(
      (f) => f.name === file.name && f.size === file.size
    );
    if (isDuplicate)
      return { valid: false, error: 'This file has already been selected.' };
    return { valid: true };
  };

  const removeSelectedFile = (index) => {
    if (isBusy) return;
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const simulateParsingProgressForProvider = (fileId) => {
    let progress = 0;

    const interval = setInterval(() => {
      const delta = Math.max(0.8, (MAX_IDLE_PROGRESS - progress) * 0.14);
      progress = Math.min(
        progress + delta + Math.random() * 0.1,
        MAX_IDLE_PROGRESS
      );

      const stepIndex = Math.min(
        Math.floor((progress / 100) * parsingSteps.length),
        parsingSteps.length - 1
      );

      setParsingFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                progress,
                currentStep: stepIndex,
                stepText: parsingSteps[stepIndex],
              }
            : f
        )
      );
    }, 1500);

    timersRef.current.set(fileId, interval);

    return () => {
      const idleInterval = timersRef.current.get(fileId);
      if (idleInterval) {
        clearInterval(idleInterval);
        timersRef.current.delete(fileId);
      }

      let finalProgress = null;
      setParsingFiles((prev) => {
        const f = prev.find((x) => x.id === fileId);
        finalProgress = f
          ? Math.max(f.progress, MAX_IDLE_PROGRESS)
          : MAX_IDLE_PROGRESS;
        return prev;
      });

      const smoothInterval = setInterval(() => {
        finalProgress += 1.7;
        if (finalProgress >= 100) {
          finalProgress = 100;
          clearInterval(smoothInterval);

          setTimeout(() => {
            setParsingFiles((prev) => prev.filter((f) => f.id !== fileId));
            setBackgroundProcessing((prev) => [
              ...prev,
              { id: fileId, status: 'completing' },
            ]);
          }, 1500);
        }

        setParsingFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  progress: finalProgress,
                  stepText: finalProgress < 100 ? 'Finalizing...' : 'Done',
                }
              : f
          )
        );
      }, 1100);
    };
  };

  const simulateParsingProgress = (fileId) => {
    let progress = 0;

    const interval = setInterval(() => {
      const delta = Math.max(0.6, (MAX_IDLE_PROGRESS - progress) * 0.12);
      progress = Math.min(
        progress + delta + Math.random() * 0.8,
        MAX_IDLE_PROGRESS
      );

      const stepIndex = Math.min(
        Math.floor((progress / 100) * parsingSteps.length),
        parsingSteps.length - 1
      );

      setParsingFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                progress,
                currentStep: stepIndex,
                stepText: parsingSteps[stepIndex],
              }
            : f
        )
      );
    }, 600);

    timersRef.current.set(fileId, interval);

    // Return finisher function to smoothly complete to 100%
    return () => {
      const idleInterval = timersRef.current.get(fileId);
      if (idleInterval) {
        clearInterval(idleInterval);
        timersRef.current.delete(fileId);
      }

      let finalProgress = null;
      setParsingFiles((prev) => {
        const f = prev.find((x) => x.id === fileId);
        finalProgress = f
          ? Math.max(f.progress, MAX_IDLE_PROGRESS)
          : MAX_IDLE_PROGRESS;
        return prev;
      });

      const smoothInterval = setInterval(() => {
        finalProgress += 1.5;
        if (finalProgress >= 100) {
          finalProgress = 100;
          clearInterval(smoothInterval);

          setTimeout(() => {
            setParsingFiles((prev) => prev.filter((f) => f.id !== fileId));
            setBackgroundProcessing((prev) => [
              ...prev,
              { id: fileId, status: 'completing' },
            ]);
          }, 300);
        }

        setParsingFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  progress: finalProgress,
                  stepText: finalProgress < 100 ? 'Finalizing...' : 'Done',
                }
              : f
          )
        );
      }, 120);
    };
  };
  useEffect(() => {
    return () => {
      timersRef.current.forEach((intId) => clearInterval(intId));
      timersRef.current.clear();
    };
  }, []);

  const uploadFiles = async () => {
    if (selectedFiles.length === 0 || isBusy) return;

    setIsUploading(true);
    const currentSelection = [...selectedFiles];

    const filesToParse = currentSelection.map((file, index) => ({
      id: `parsing-${Date.now()}-${index}`,
      name: file.name,
      file,
      progress: 0,
      currentStep: 0,
      stepText: parsingSteps[0],
    }));

    setParsingFiles(filesToParse);
    setSelectedFiles([]);

    try {
      for (const file of currentSelection) {
        const fileObj = filesToParse.find((f) => f.name === file.name);
        if (!fileObj) continue;

        try {
          let finishProvider;
          if (token) {
            finishProvider = simulateParsingProgressForProvider(fileObj.id);
            await dispatch(uploadFileByProviderThunk({ file, token })).unwrap();
          }

          const finishMain = simulateParsingProgress(fileObj.id);
          const mainRes = await dispatch(
            uploadImageThunk({ file, userId })
          ).unwrap();

          if (!mainRes?.success) {
            throw new Error('Main upload failed');
          }

          finishProvider?.();
          finishMain?.();

          await dispatch(getMedicalBillsThunk(userId));
          await dispatch(getImageThunk(userId));

          onUploadSuccess?.();
        } catch (error) {
          const intId = timersRef.current.get(fileObj.id);
          if (intId) {
            clearInterval(intId);
            timersRef.current.delete(fileObj.id);
          }
          setParsingFiles((prev) => prev.filter((f) => f.id !== fileObj.id));
        }
      }
      onUpload?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      setInputKey(Date.now());
    }
  };

  const handleFileSelection = (files) => {
    if (isBusy) {
      toast.info(
        'An upload is already in progress. Please wait for it to finish.'
      );
      setInputKey(Date.now());
      return;
    }

    const errors = [];
    let newFile = null;

    Array.from(files).forEach((file) => {
      const validation = validateFile(file);
      if (validation.valid) {
        newFile = file;
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) errors.forEach((e) => toast.error(e));

    if (newFile) setSelectedFiles([newFile]);
    setInputKey(Date.now());
  };

  return (
    <div className="bg-white shadow-1 p-4 lg:p-5 rounded-xl">
      <h2 className="mb-4 font-bold text-org-primary-dark text-xl lg:text-2xl">
        Upload medical bills
      </h2>
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Supported formats:</strong> PDF, JPG, PNG, PPT, WORD (max 10MB
          each)
        </p>
      </div>

      <div className="relative min-h-[180px]">
        <DragDropUploader
          key={inputKey}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx"
          onFilesChange={handleFileSelection}
          multiple={false}
          disabled={isBusy}
          aria-disabled={isBusy}
        />
        {isBusy && (
          <div className="absolute inset-0 z-10 rounded-lg bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <span className="text-sm">Uploading… please wait</span>
          </div>
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-medium text-sm">Selected Files:</h3>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{getFileIcon(file.type)}</span>
                <span className="text-sm truncate max-w-[150px]">
                  {file.name}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeSelectedFile(index)}
                className="h-6 w-6 p-0"
                disabled={isBusy}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            onClick={uploadFiles}
            className="w-full mt-3 bg-org-primary"
            disabled={isBusy || selectedFiles.length === 0}
          >
            {isBusy ? (
              'Uploading…'
            ) : (
              <>
                Upload {selectedFiles.length} file
                {selectedFiles.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      )}

      {parsingFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          <h3 className="font-medium text-sm">Processing Files:</h3>
          {parsingFiles.map((file) => (
            <div key={file.id} className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-sm text-blue-600">
                  {Math.round(file.progress)}%
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${file.progress}%` }}
                />
              </div>
              <p className="text-xs text-blue-700">{file.stepText}</p>
              {file.progress < 50 && (
                <p className="text-xs text-blue-600 mt-1">
                  Thanks! We're carefully reading your bill. This can take{' '}
                  <strong>about a minute</strong>.
                </p>
              )}
              {file.progress >= 50 && file.progress < 80 && (
                <p className="text-xs text-blue-600 mt-1">
                  We're piecing together line items and CPT codes—accuracy
                  first, speed second.
                </p>
              )}
              {file.progress >= 80 && file.progress < 90 && (
                <p className="text-xs text-blue-600 mt-1">
                  Deeply checking totals and calculations to ensure everything
                  adds up correctly.
                </p>
              )}
              {file.progress >= 90 && file.progress < 100 && (
                <p className="text-xs text-blue-600 mt-1">
                  Almost there—double-checking totals so you don't have to.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
