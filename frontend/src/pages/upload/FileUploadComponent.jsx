import { forwardRef, useState } from 'react';
import { FileUpload } from '../../components/application/file-upload/file-upload-base';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { useMutation } from '@tanstack/react-query';
import { uploadTransactionFile } from '@/api/transactions';

const FileUploadProgressBar = forwardRef(
  ({ isDisabled, selectedAccountId }, ref) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const queryClient = useQueryClient();
    const { getToken } = useAuth();

    const uploadMutation = useMutation({
      mutationFn: async ({ fileObject, id, account_id }) => {
        const token = await getToken();

        console.log('Mutation is sending Account ID:', account_id);

        return uploadTransactionFile(
          token,
          fileObject,
          account_id,
          (percent) => {
            setUploadedFiles((prev) =>
              prev.map((f) => (f.id === id ? { ...f, progress: percent } : f)),
            );
          },
        );
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
      },
      onError: (error, { id }) => {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Failed to upload transactions.';
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, failed: true, progress: 0 } : f,
          ),
        );
      },
    });

    const handleDropFiles = (fileList) => {
      const newFiles = Array.from(fileList).map((file) => ({
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: file.size,
        progress: 0,
        fileObject: file,
      }));

      setUploadedFiles((prev) => [
        ...newFiles.map(({ fileObject, ...rest }) => rest),
        ...prev,
      ]);

      newFiles.forEach((f) => {
        uploadMutation.mutate({
          fileObject: f.fileObject,
          id: f.id,
          account_id: selectedAccountId,
        });
      });
    };

    return (
      <div ref={ref}>
        <span className="text-xs text-center font-semibold text-fg-quaternary uppercase tracking-wider">
          3.Upload Your File(s)
        </span>
        <FileUpload.Root>
          {/* Ensure isDisabled is a boolean from props */}
          <FileUpload.DropZone
            isDisabled={isDisabled}
            onDropFiles={handleDropFiles}
          />

          <FileUpload.List>
            {uploadedFiles.map((file) => (
              <FileUpload.ListItemProgressBar
                key={file.id}
                id={file.id}
                name={file.name}
                size={file.size}
                progress={file.progress}
                onDelete={() =>
                  setUploadedFiles((prev) =>
                    prev.filter((f) => f.id !== file.id),
                  )
                }
              />
            ))}
          </FileUpload.List>
        </FileUpload.Root>
      </div>
    );
  },
);

export default FileUploadProgressBar;
