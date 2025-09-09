let loaderSubscribers = [];
let activeRequests = 0;

export const subscribeLoader = (callback) => {
  loaderSubscribers.push(callback);
  return () => {
    loaderSubscribers = loaderSubscribers.filter((cb) => cb !== callback);
  };
};

const notifySubscribers = () => {
  loaderSubscribers.forEach((cb) => cb(activeRequests > 0));
};

export const showLoader = () => {
  activeRequests++;
  notifySubscribers();
};

export const hideLoader = () => {
  activeRequests = Math.max(0, activeRequests - 1);
  notifySubscribers();
};
