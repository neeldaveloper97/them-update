import axios from '@/lib/axiosInstance';

import { v4 as uuidv4 } from 'uuid';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const getUserId = async (orgId) => {
  let storedId = sessionStorage.getItem('chatUserId');
  let sessionId = sessionStorage.getItem('sessionId');

  if (!storedId && !sessionId) {
    try {
      const randomEmail = `user-${uuidv4()}@gmail.com`;

      const { data } = await axios.post(`${BASE_URL}/api/v1/auth/signup`, {
        email: randomEmail,
        password: 'Secure@Password123',
        agent: orgId || 'them',
      });

      const userIdFromServer = data?.data?.user?.id;
      const userSessionId = data?.sessionId;

      if (userIdFromServer && userSessionId) {
        storedId = userIdFromServer;
        sessionId = userSessionId;
        sessionStorage.setItem('chatUserId', storedId);
        sessionStorage.setItem('sessionId', sessionId);
      } else {
        throw new Error('No user ID returned from server.');
      }
    } catch (error) {
      console.error('Failed to register new user:', error);
      throw error;
    }
  }

  return { storedId, sessionId };
};

export const getBaseUrl = () => BASE_URL;
export const submitNegotiationCase = async (id, poa) => {
  if (poa && poa.pdfFile instanceof File) {
    const form = new FormData();
    form.append('billId', String(id));

    form.append('file', poa.pdfFile, poa.pdfFile.name || 'poa.pdf');

    const { pdfFile, ...poaJson } = poa;
    form.append('poa', JSON.stringify(poaJson));

    const response = await axios.post(
      `${BASE_URL}/api/v1/med/negotiation-cases`,
      form,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  }

  const response = await axios.post(
    `${BASE_URL}/api/v1/med/negotiation-cases`,
    { billId: id },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
};
export const submitNegotiationAction = async ({
  negotiation_case_id,
  situation,
  action,
  message,
  amount,
  url,
}) => {
  const formData = new FormData();
  formData.append('negotiation_case_id', negotiation_case_id);
  formData.append('situation', situation);
  formData.append('action', action);
  formData.append('message', message);
  formData.append('amount', amount);
  if (url) {
    formData.append('file', url);
  }
  const response = await axios.post(
    `${BASE_URL}/api/v1/med/negotiation-cases/response`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return response.data;
};

export const fetchNegotiationCases = async (userId) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/med/negotiation-cases/user/${userId}`
  );
  return response.data;
};

export const fetchNegotiationCaseById = async (caseId) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/med/negotiation-cases/${caseId}`
  );
  return response.data;
};

export const fetchNegotiationCaseByBillId = async (billId) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/med/negotiation-cases/bill/${billId}`
  );
  return response.data;
};

export const updateNegotiationCase = async (caseId, negotiationData) => {
  const response = await axios.patch(
    `${BASE_URL}/api/v1/med/negotiation-cases/${caseId}`,
    negotiationData,
    {
      headers:
        negotiationData instanceof FormData
          ? undefined
          : { 'Content-Type': 'application/json' },
    }
  );
  return response.data;
};

export const deleteNegotiationCase = async (caseId) => {
  const response = await axios.delete(
    `${BASE_URL}/api/v1/med/negotiation-cases/${caseId}`
  );
  return response.data;
};

export const contactUs = async (contactData) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/them-contact`,
    contactData,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
  return response.data;
};

export const startNegotiation = async (billId) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/med/negotiation-cases/${billId}`
  );
  return response.data;
};

export const updateError = async (billId, data) => {
  const response = await axios.patch(
    `${BASE_URL}/api/v1/med-optimize/bill/${billId}`,
    data,
    {
      headers:
        data instanceof FormData
          ? undefined
          : { 'Content-Type': 'application/json' },
    }
  );
  return response.data;
};
