import axios from '@/lib/axiosInstance';

export const getMedicalBills = async (userId) => {
  const response = await axios.get(`/v1/med-optimize?userId=${userId}`);
  return response.data;
};

export const getMedicalBillsById = async (billId) => {
  const response = await axios.get(`/v1/med-optimize/${billId}`);
  return response.data;
};
