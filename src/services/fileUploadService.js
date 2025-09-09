import axios from '@/lib/axiosInstance';

export const uploadFiles = async (files, userId) => {
  try {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });

    formData.append('userId', userId);
    const response = await axios.post('/v1/images/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload files');
    }

    const data = await response.json();
    return data.files;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};

export const getFileUrl = (fileId) => {
  return `/api/files/${fileId}`;
};
