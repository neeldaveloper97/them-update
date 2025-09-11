import axios from 'axios';
import { toast } from 'react-toastify';
import { hideLoader, showLoader } from '@/services/loaderService';

let activeRequests = 0;
let activeGetRequests = 0;
let billCallback = null;

const pendingRequests = new Map();
const isBrowser = typeof window !== 'undefined';

const stableSerialize = (val) => {
  try {
    if (typeof FormData !== 'undefined' && val instanceof FormData) {
      const parts = [];
      for (const [k, v] of val.entries()) {
        if (typeof File !== 'undefined' && v instanceof File) {
          parts.push(`${k}:${v.name}:${v.size}:${v.type}:${v.lastModified}`);
        } else {
          parts.push(`${k}:${String(v)}`);
        }
      }
      parts.sort();
      return `FormData(${parts.join('|')})`;
    }
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
};

const getRequestKey = (config) => {
  const method = (config.method || 'get').toLowerCase();
  const url = config.url || '';
  const params = stableSerialize(config.params);
  const data = stableSerialize(config.data);
  return `${method}:${url}:${params}:${data}`;
};

export const onAllRequestsDone = (callback) => {
  billCallback = callback;
};

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const key = getRequestKey(config);
    if (pendingRequests.has(key)) {
      return Promise.reject({
        __CANCEL__: true,
        reason: 'Duplicate request',
        config,
      });
    }
    pendingRequests.set(key, true);

    activeRequests++;

    if (isBrowser) {
      try {
        const token = window.localStorage.getItem('token');
        if (token) {
          config.headers = {
            ...(config.headers || {}),
            Authorization: `Bearer ${token}`,
          };
        }
      } catch {}
    }
    if (
      typeof FormData !== 'undefined' &&
      config.data instanceof FormData &&
      config.headers
    ) {
      delete config.headers['Content-Type'];
    }

    const method = (config.method || 'get').toLowerCase();
    if (method === 'get') {
      if (activeGetRequests === 0) showLoader();
      activeGetRequests++;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    const { config } = response;
    const key = getRequestKey(config);
    pendingRequests.delete(key);

    activeRequests = Math.max(0, activeRequests - 1);

    const method = (config.method || 'get').toLowerCase();
    if (method === 'get') {
      activeGetRequests = Math.max(0, activeGetRequests - 1);
      if (activeGetRequests === 0) hideLoader();
    }

    if (activeRequests === 0 && billCallback) {
      const cb = billCallback;
      billCallback = null;
      try {
        cb();
      } catch {}
    }

    const msg =
      (response.data && response.data.message) ||
      response.message ||
      (response.data && response.data.data && response.data.data.message);

    if (msg && method !== 'get') toast.success(msg);

    return response;
  },
  (error) => {
    if (error && error.__CANCEL__) {
      return Promise.reject(error);
    }

    const cfg = error && error.config ? error.config : null;
    if (cfg) {
      const key = getRequestKey(cfg);
      pendingRequests.delete(key);
    }

    activeRequests = Math.max(0, activeRequests - 1);

    const method = (cfg && (cfg.method || 'get').toLowerCase()) || 'get';
    if (method === 'get') {
      activeGetRequests = Math.max(0, activeGetRequests - 1);
      if (activeGetRequests === 0) hideLoader();
    }

    if (activeRequests === 0 && billCallback) {
      const cb = billCallback;
      billCallback = null;
      try {
        cb();
      } catch {}
    }

    const status = error?.response?.status;
    const serverError = error?.response?.data;

    const message =
      (serverError && serverError.error && serverError.error.message) ||
      (serverError && serverError.message) ||
      (serverError && serverError.error);

    if (status === 401) {
      toast.error(message);
      if (isBrowser) {
        try {
          window.localStorage.removeItem('token');
          // Clear authentication cookies on 401 error
          document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'sidebar_state=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        } catch {}
      }
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
