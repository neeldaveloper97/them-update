import axios from '@/lib/axiosInstance';

export const uploadImage = async (file, userId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);

  const response = await axios.post('/v1/med-optimize/bill-parse', formData);
  return response.data;
};

export const getImage = async (imageId) => {
  const response = await axios.get(`/v1/images/user/${imageId}`);
  return response.data;
};

export const deleteFile = async (key) => {
  const response = await axios.post(`/v1/images/delete`, { key });
  return response.data;
};

export const getMedicalBills = async (userId) => {
  const response = await axios.get(`/v1/med-optimize/bills?userId=${userId}`);
  return response.data;
};

export const uploadFileByProvider = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('token', token);

    const response = await axios.post(
      '/v1/med-optimize/provider/upload',
      formData
    );

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
