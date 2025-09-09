import axios from '@/lib/axiosInstance';

const handleError = (error) => {
  if (axios.isAxiosError(error)) {
    const res = error.response;
    return {
      data: res?.data?.data || null,
      statusCode: res?.status || 500,
      message:
        res?.data?.message || res?.data?.error,
      success: false,
    };
  }

  return {
    data: null,
    statusCode: 500,
    message: 'Unexpected error occurred.',
    success: false,
  };
};

const formatResponse = (res) => ({
  data: res?.data || null,
  statusCode: res.status,
  message: res.data?.message || 'Success',
  success: true,
});

export const chatService = {
  fetchChatHistory: async (userId, conversationId) => {
    try {
      const url = `/v1/message/${conversationId}?userId=${userId}`;
      const res = await axios.get(url);
      return formatResponse(res);
    } catch (error) {
      return handleError(error);
    }
  },
};
