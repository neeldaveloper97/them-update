import { io } from 'socket.io-client';

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000';

let dashboardSocket = null;
let isConnected = false;
let eventListeners = [];

export const initializeDashboardSocket = (callbacks = {}) => {
  const { onConnect, onDisconnect, onError, onDashboardEvent } = callbacks;

  if (dashboardSocket && isConnected) {
    if (onConnect) onConnect(dashboardSocket);
    return dashboardSocket;
  }

  dashboardSocket = io(`${BASE_URL}/dashboard`, { transports: ['websocket'] });

  dashboardSocket.on('connect', () => {
    isConnected = true;
    if (onConnect) onConnect(dashboardSocket);
  });

  dashboardSocket.on('disconnect', () => {
    isConnected = false;
    if (onDisconnect) onDisconnect();
  });

  dashboardSocket.on('error', (error) => {
    console.error('Dashboard socket error:', error);
    if (onError) onError(error);
  });

  dashboardSocket.on('dashboard_event', (event) => {
    if (onDashboardEvent) onDashboardEvent(event);

    eventListeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in dashboard event listener:', err);
      }
    });
  });

  return dashboardSocket;
};

export const addDashboardEventListener = (listener) => {
  if (typeof listener !== 'function') {
    console.error('Dashboard event listener must be a function');
    return () => {};
  }

  eventListeners.push(listener);

  return () => {
    eventListeners = eventListeners.filter((l) => l !== listener);
  };
};

export const disconnectDashboardSocket = () => {
  if (dashboardSocket) {
    dashboardSocket.disconnect();
    dashboardSocket = null;
    isConnected = false;
    eventListeners = [];
  }
};

export const getDashboardSocket = () => {
  return dashboardSocket;
};

export const isDashboardSocketConnected = () => {
  return isConnected;
};
