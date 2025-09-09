import { io } from 'socket.io-client';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

const SOCKET_OPTIONS = {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  transports: ['websocket', 'polling'],
};

const SOCKET_DASHBOARD_OPTIONS = {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  transports: ['websocket', 'polling'],
  query: {
    userId:
      typeof window !== 'undefined'
        ? sessionStorage.getItem('chatUserId')
        : null,
  },
};

export const initializeSocket = (callbacks) => {
  const {
    onConnect,
    onDisconnect,
    onConnectError,
    onAgentResponse,
    onError,
    onAgentStream,
    onAgentStreamEnd,
    onAgentStreamError,
    onDashboardEvent,
  } = callbacks;

  const socket = io(BASE_URL, SOCKET_OPTIONS);

  const socketDashboard = io(`${BASE_URL}`, SOCKET_DASHBOARD_OPTIONS);

  socket.on('connect', () => {
    if (onConnect) onConnect(socket);
  });

  socket.on('disconnect', () => {
    if (onDisconnect) onDisconnect();
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    if (onConnectError) onConnectError(error);

    if (BASE_URL.startsWith('https')) {
      const httpUrl = BASE_URL.replace('https', 'http');
      socket.io.uri = httpUrl;
      socket.connect();
    }
  });

  socket.on('agent_response', (data) => {
    if (onAgentResponse) onAgentResponse(data);
  });

  socket.on('agent_response_stream', ({ delta }) => {
    if (callbacks.onAgentStream) {
      callbacks.onAgentStream(delta);
    }
  });

  socket.on('agent_response_stream_end', () => {
    if (callbacks.onAgentStreamEnd) {
      callbacks.onAgentStreamEnd();
    }
  });

  socket.on('agent_response_stream_error', ({ error }) => {
    console.error('Stream error:', error);
    if (callbacks.onAgentStreamError) {
      callbacks.onAgentStreamError(error);
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
    if (onError) onError(error);
  });

  socketDashboard.on('connect', () => {
    console.log('Dashboard socket connected');
  });

  socketDashboard.on('dashboard_event', (event) => {
    console.log('Dashboard Event:', event);
    if (onDashboardEvent) onDashboardEvent(event);
  });

  socketDashboard.on('disconnect', () => {
    console.log('Dashboard socket disconnected');
  });

  return { socket, socketDashboard };
};

export function sendMessage(
  socket,
  userId,
  sessionId,
  message,
  orgId = null,
  file = null
) {
  if (!socket?.connected) {
    console.error('Socket not connected');
    return false;
  }

  const payload = {
    userId,
    message,
    agent: orgId,
    sessionId,
  };

  if (file) {
    if (
      (file.base64 || file.uri) &&
      (file.name || file.filename) &&
      (file.type || file.mimetype)
    ) {
      const originalFilename = file.name || file.filename;
      const sanitizedFilename = originalFilename.replace(/\s+/g, '_');
      payload.imageBase64 = file.base64 || file.uri;
      payload.filename = sanitizedFilename;
      payload.mimetype = file.type || file.mimetype;
    } else {
      console.error('Invalid file object provided to sendMessage', file);
    }
  }

  socket.emit('user_message', payload);
  return true;
}

export const disconnectSocket = ({ socket, socketDashboard }) => {
  if (socket) socket.disconnect();
  if (socketDashboard) socketDashboard.disconnect();
};
