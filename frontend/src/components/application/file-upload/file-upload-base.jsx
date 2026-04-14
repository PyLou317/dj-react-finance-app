import { useId, useRef, useState } from 'react';
import { FileIcon as FileTypeIcon } from '@untitledui/file-icons';
import {
  CheckCircle,
  Trash01,
  UploadCloud02,
  XCircle,
} from '@untitledui/icons';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../../base/buttons/button';
import { ButtonUtility } from '../../base/buttons/button-utility';
import { ProgressBar } from '../../base/progress-indicators/progress-indicators';
import { FeaturedIcon } from '../../foundations/featured-icon/featured-icon';

export const getReadableFileSize = (bytes) => {
  if (bytes === 0) return '0 KB';
  const suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.floor(bytes / Math.pow(1024, i)) + ' ' + suffixes[i];
};

export const FileUploadDropZone = ({
  hint,
  isDisabled,
  accept,
  allowsMultiple = true,
  maxSize,
  onDropFiles,
  onDropUnacceptedFiles,
  onSizeLimitExceed,
}) => {
  const id = useId();
  const inputRef = useRef(null);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const isFileTypeAccepted = (file) => {
    if (!accept) return true;
    const acceptedTypes = accept.split(',').map((type) => type.trim());

    return acceptedTypes.some((acceptedType) => {
      if (acceptedType.startsWith('.')) {
        const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
        return extension === acceptedType.toLowerCase();
      }
      if (acceptedType.endsWith('/*')) {
        const typePrefix = acceptedType.split('/')[0];
        return file.type.startsWith(`${typePrefix}/`);
      }
      return file.type === acceptedType;
    });
  };

  const handleDragIn = (event) => {
    if (isDisabled) return;
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragOut = (event) => {
    if (isDisabled) return;
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(false);
  };

  const processFiles = (files) => {
    setIsInvalid(false);
    const acceptedFiles = [];
    const unacceptedFiles = [];
    const oversizedFiles = [];

    const filesToProcess = allowsMultiple ? files : files.slice(0, 1);

    filesToProcess.forEach((file) => {
      if (maxSize && file.size > maxSize) {
        oversizedFiles.push(file);
        return;
      }
      if (isFileTypeAccepted(file)) {
        acceptedFiles.push(file);
      } else {
        unacceptedFiles.push(file);
      }
    });

    if (oversizedFiles.length > 0 && typeof onSizeLimitExceed === 'function') {
      setIsInvalid(true);
      onSizeLimitExceed(oversizedFiles);
    }

    if (acceptedFiles.length > 0 && typeof onDropFiles === 'function') {
      onDropFiles(acceptedFiles);
    }

    if (
      unacceptedFiles.length > 0 &&
      typeof onDropUnacceptedFiles === 'function'
    ) {
      setIsInvalid(true);
      onDropUnacceptedFiles(unacceptedFiles);
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDrop = (event) => {
    if (isDisabled) return;
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(false);
    processFiles(Array.from(event.dataTransfer.files));
  };

  return (
    <div
      isdisabled={isDisabled.toString()}
      onDragOver={handleDragIn}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative flex flex-col items-center gap-3 rounded-xl bg-primary px-6 py-4 text-tertiary ring-1 ring-secondary transition duration-100 ease-linear ring-inset cursor-pointer ${
        isDraggingOver ? 'ring-2 ring-brand' : ''
      } ${isDisabled ? 'cursor-not-allowed bg-secondary opacity-60' : ''}`}
    >
      <FeaturedIcon
        icon={UploadCloud02}
        color="gray"
        theme="modern"
        size="md"
      />
      <div className="flex flex-col gap-1 text-center">
        <div className="flex items-center justify-center gap-1">
          <input
            ref={inputRef}
            id={id}
            type="file"
            className="sr-only"
            disabled={isDisabled}
            accept={accept}
            multiple={allowsMultiple}
            onChange={(e) => processFiles(Array.from(e.target.files || []))}
          />
          <div className="font-semibold text-sm" size="md">
            Click to upload
          </div>
          <span className="text-sm max-md:hidden">or drag and drop</span>
        </div>
        <p className={`text-xs ${isInvalid ? 'text-error-primary' : ''}`}>
          {hint || 'CSV files only (max. 10MB)'}
        </p>
      </div>
    </div>
  );
};

export const FileListItemProgressBar = ({
  name,
  size,
  progress,
  failed,
  type,
  onDelete,
  onRetry,
}) => {
  const isComplete = progress === 100;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative flex gap-3 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset ${failed ? 'ring-2 ring-error' : ''}`}
    >
      <FileTypeIcon
        className="size-10 shrink-0"
        type={type ?? 'empty'}
        theme="light"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex w-full justify-between items-start">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-secondary">
              {name}
            </p>
            <p className="text-xs text-tertiary">{getReadableFileSize(size)}</p>
          </div>
          <ButtonUtility
            color="tertiary"
            tooltip="Delete"
            icon={Trash01}
            size="xs"
            onClick={onDelete}
          />
        </div>
        <div className="mt-2">
          <ProgressBar labelPosition="right" value={progress} />
        </div>
        {failed && (
          <Button
            color="link-destructive"
            size="sm"
            onClick={onRetry}
            className="mt-1"
          >
            Try again
          </Button>
        )}
      </div>
    </motion.li>
  );
};

export const FileUpload = {
  Root: ({ children }) => <div className="flex flex-col gap-4">{children}</div>,
  List: ({ children }) => (
    <ul className="flex flex-col gap-3">
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </ul>
  ),
  DropZone: FileUploadDropZone,
  ListItemProgressBar: FileListItemProgressBar,
};
