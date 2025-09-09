import axios from '@/lib/axiosInstance';

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1`;

export const planService = {
  getPlans: async (agentId) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/plans/${agentId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};

export const checkoutService = {
  createCheckoutSession: async (
    userId,
    planId,
    lookup_key,
    successUrl,
    cancelUrl
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/stripe/create-checkout-session`,
        {
          userId,
          planId,
          lookupKey: lookup_key,
          successUrl,
          cancelUrl,
        }
      );
      return response.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  },
};
